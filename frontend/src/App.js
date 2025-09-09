import React, { useState } from 'react';
import UserList from './users/usersList';
import UserForm from './users/usersForm';

function App() {
  const [users, setUsers] = useState([]);

  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <div className="App">
      <UserForm onUserCreated={handleUserCreated} />
      <UserList />
    </div>
  );
}

export default App;