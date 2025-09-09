import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4200/users')
      .then(response => setUsers(response.data)) 
      .catch(error => console.error('Error fetching users:', error));
    
  }, [users]);   

  const deleteUser = (id) => {
    axios.delete(`http://localhost:4200/users/delete/${id}`)
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">👥 User Dashboard</h1>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No users found.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6">
            {users.map(user => (
              <li key={user._id} className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-xl transition">
                <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
                <p className="text-gray-600">🏆 {user.rank}</p>
                <p className="text-gray-500 text-sm">⭐ {user.contributionScore} LP</p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-md transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UsersList;