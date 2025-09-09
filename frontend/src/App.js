import * as React from "react";
import { Admin, Resource, List, Datagrid, TextField, EmailField, Edit, SimpleForm, TextInput, NumberInput, Create, Show, SimpleShowLayout, NumberField, TopToolbar, CreateButton, ExportButton, Pagination, useDataProvider, Title, CardContentInner } from "react-admin";

/**
 * Minimal dataProvider for a NestJS + Mongoose backend.
 * Assumptions:
 *  - API base URL: http://localhost:3000
 *  - UsersController exposes REST endpoints under /users
 *    (GET /users, GET /users/:id, POST /users, PUT /users/:id, DELETE /users/:id)
 *  - Documents have MongoDB _id; we map it to `id` for react-admin
 */
const API_URL = "http://localhost:3000";

const httpClient = async (url, options = {}) => {
  const opts = {
    ...options,
    headers: new Headers({ "Content-Type": "application/json", ...(options.headers || {}) }),
  };
  const res = await fetch(url, opts);
  console.log("Res: ",res);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  // try JSON, else return as-is
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
};

const mapId = (doc) => ({ id: doc._id ?? doc.id, ...doc });

const dataProvider = {
  async getList(resource, params) {
    // Basic pagination & sorting (server can ignore if unsupported)
    const { page, perPage } = params.pagination || { page: 1, perPage: 25 };
    const sort = params.sort || { field: "id", order: "ASC" };
    const query = new URLSearchParams({
      _page: String(page),
      _limit: String(perPage),
      _sort: sort.field,
      _order: sort.order,
    }).toString();
    const data = await httpClient(`${API_URL}/${resource}?${query}`);

    // If your Nest controller returns an array, we need a total. We'll fallback to length.
    const array = Array.isArray(data) ? data : data?.items || [];
    const total = data?.total ?? array.length;
    return { data: array.map(mapId), total };
  },

  async getOne(resource, params) {
    const data = await httpClient(`${API_URL}/${resource}/${params.id}`);
    return { data: mapId(data) };
  },

  async create(resource, params) {
    const data = await httpClient(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    return { data: mapId(data) };
  },

  async update(resource, params) {
    const data = await httpClient(`${API_URL}/${resource}/${params.id}` ,{
      method: "PUT",
      body: JSON.stringify(params.data),
    });
    return { data: mapId(data) };
  },

  async delete(resource, params) {
    await httpClient(`${API_URL}/${resource}/${params.id}`, { method: "DELETE" });
    return { data: { id: params.id } };
  },

  // Optional (bulk)
  async deleteMany(resource, params) {
    const results = await Promise.all(
      params.ids.map((id) => httpClient(`${API_URL}/${resource}/${id}`, { method: "DELETE" }))
    );
    return { data: results.map((_, i) => params.ids[i]) };
  },
};

/**
 * ------- UI: Users Resource -------
 */
const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const UserPagination = (props) => <Pagination rowsPerPageOptions={[10, 25, 50]} {...props} />;

export const UserList = (props) => (
  <List {...props} actions={<ListActions />} pagination={<UserPagination />}
        sort={{ field: 'username', order: 'ASC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="username" label="Username" />
      <EmailField source="email" label="Email" />
      <TextField source="rank" label="Rank" />
      <NumberField source="contributionScore" label="Score" />
    </Datagrid>
  </List>
);

export const UserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="username" />
      <EmailField source="email" />
      <TextField source="rank" />
      <NumberField source="contributionScore" />
    </SimpleShowLayout>
  </Show>
);

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="username" validate={[required()]} />
      <TextInput source="email" type="email" validate={[required()]} />
      {/* Normally you would not edit raw passwords here */}
      <TextInput source="password" type="password" />
      <TextInput source="rank" />
      <NumberInput source="contributionScore" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="username" validate={[required()]} />
      <TextInput source="email" type="email" validate={[required()]} />
      <TextInput source="password" type="password" validate={[required()]} />
      <TextInput source="rank" />
      <NumberInput source="contributionScore" />
    </SimpleForm>
  </Create>
);

/**
 * Small helper to avoid importing from ra-core directly in multiple places
 */
const required = (msg = 'Required') => (value) => (value ? undefined : msg);

/**
 * ------- Custom Dashboard with simple KPIs -------
 */
const DashboardCard = ({ title, value, subtitle }) => (
  <div className="rounded-2xl shadow-md p-6 border border-gray-100 bg-white">
    <div className="text-sm text-gray-500">{subtitle}</div>
    <div className="text-2xl font-semibold mt-1">{title}</div>
    <div className="text-4xl font-bold mt-2">{value}</div>
  </div>
);

const Dashboard = () => {
  const dp = useDataProvider();
  const [count, setCount] = React.useState(0);
  const [topRank, setTopRank] = React.useState("—");

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await dp.getList('users', { pagination: { page: 1, perPage: 1000 } });
        if (!active) return;
        setCount(data.length);
        // simple derived metric
        const top = [...data].sort((a,b) => (b.contributionScore||0) - (a.contributionScore||0))[0];
        setTopRank(top?.username ? `${top.username} (${top.contributionScore||0})` : '—');
        console.log(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { active = false; };
  }, [dp]);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard title={count} subtitle="Users" value="" />
      <DashboardCard title={topRank} subtitle="Top contributor" value="" />
      <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-md">
        <div className="text-xl font-semibold mb-2">Quick Tips</div>
        <ul className="list-disc pl-5 text-gray-600">
          <li>Click a row to view user details.</li>
          <li>Use the Create button to add users.</li>
          <li>Sort by clicking column headers.</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * ------- App -------
 */
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Admin dataProvider={dataProvider} dashboard={Dashboard}>
        <Resource name="users" list={UserList} show={UserShow} edit={UserEdit} create={UserCreate} />
        {/* You can add <Resource name="posts" /> and <Resource name="comments" /> later */}
      </Admin>
    </div>
  );
}
