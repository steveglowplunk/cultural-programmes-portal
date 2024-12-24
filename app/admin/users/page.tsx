"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CreateUserButton from "@/components/admin/user-control/CreateUserButton";
import UserTable from "@/components/admin/user-control/UserTable";

const UserPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  // const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [editUser, setEditUser] = useState<any>(null);
  

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get("/api/users");
  //       setUsers(response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchUsers();
  // }, []);


  // const handleUpdate = async (id: string) => {
  //   try {
  //     const response = await axios.put(`/api/users/${id}`, editUser);
  //     setUsers(users.map((user) => (user.id === id ? response.data : user)));
  //     setEditUser(null);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mx-auto h-full w-full overflow-y-scroll">
      <div className="ml-10 mt-5 flex max-w-[calc(100vw-220px)] items-center">
        <p className="text-3xl">User List</p>
      </div>
      {/* <div className="mr-2 flex items-end justify-end">
          <CreateUserButton/>
      </div> */}


      {/* <div>
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
      </div> */}

      {/* <div>
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
      </div> */}
      <UserTable/>

    </div>
  );
};

export default UserPage;