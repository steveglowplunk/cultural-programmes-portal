"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const UserPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [editUser, setEditUser] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/users", newUser);
      setUsers([...users, response.data]);
      setNewUser({ username: "", password: "" });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.put(`/api/users/${id}`, editUser);
      setUsers(users.map((user) => (user.id === id ? response.data : user)));
      setEditUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>User Management</h1>

      <div>
        <h2>Create New User</h2>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <div>
        <h2>User List</h2>
        {users.map((user) => (
          <div key={user.id}>
            {editUser && editUser.id === user.id ? (
              <div>
                <input
                  type="text"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                />
                <input
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                />
                <button onClick={() => handleUpdate(user.id)}>Save</button>
                <button onClick={() => setEditUser(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>Username: {user.username}</p>
                <button onClick={() => setEditUser(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;