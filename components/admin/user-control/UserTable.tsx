import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteUser from './DeleteUser';
import EditUser from './EditUser';  

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<any>(null);

// ...

useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await axios.get( process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/users",); // Use the imported environment variable
            
            console.log('response.data:', response.data)
            setUsers(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    fetchUsers();
}, []);

//   const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`/api/users/${id}`);
//       setUsers(users.filter((user) => user.id !== id));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUpdate = async (id: string) => {
//     try {
//       const response = await axios.put(`/api/users/${id}`, editUser);
//       setUsers(users.map((user) => (user.id === id ? response.data : user)));
//       setEditUser(null);
//     } catch (err) {
//       console.log(err);
//     }
//   };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div>
        <EditUser userId={rowData._id}/>
        <DeleteUser userId={rowData._id}/>
      </div>
    );
  };

  return (
    <DataTable value={users} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '12rem' }}>
      <Column field="name" header="Name" />
      <Column field="username" header="Username" />
      <Column field="email" header="Email" />
      <Column field="password" header="Password" />
      <Column body={actionBodyTemplate} header="Actions" />
    </DataTable>
  );
};

export default UserTable;