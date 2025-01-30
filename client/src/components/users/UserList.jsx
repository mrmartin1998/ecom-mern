import React, { useState, useEffect } from 'react';
import { userService } from '@/services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        if (data.message) {
          setError(data.message);
        } else {
          setUsers(data);
        }
      } catch (error) {
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">User List</h2>
        {error ? (
          <p className="text-error">{error}</p>
        ) : (
          <ul className="list-disc list-inside">
            {users.map(user => (
              <li key={user._id} className="py-2">
                {user.username} - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserList; 