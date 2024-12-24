import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { Password } from 'primereact/password';

const CreateUser = ({ isDialogOpen, setIsDialogOpen, fetchUsers }: { isDialogOpen: boolean, setIsDialogOpen: Dispatch<SetStateAction<boolean>>, fetchUsers: () => void }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [bIsSignupLoading, setBIsSignupLoading] = useState(false);

  //   const handleSubmit = async () => {
  //     try {
  //       await axios.post('/admin/users', {username, name, email, password });
  //       setIsDialogOpen(false);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setBIsSignupLoading(true);
    try {
      console.log('username', username);
      console.log('name', name);
      console.log('email', email);
      console.log('password', password);
      await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/admin/users', { username, name, email, password });
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setError('Failed to create user');
    } finally {
      setBIsSignupLoading(false);
    }
  };

  return (
    <Dialog header="Create User" visible={isDialogOpen} onHide={() => setIsDialogOpen(false)} className='w-[30rem]'>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-2xl">Username</p>
          <InputText
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <p className="text-2xl">Email</p>
          <InputText
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <p className="text-2xl">Password</p>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full [&>*:first-child]:w-full"
            toggleMask
            pt={{
              input: { className: "w-full" },
            }}
          />
        </div>
        <div>
          <p className="text-2xl">Confirm Password</p>
          <Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full [&>*:first-child]:w-full"
            toggleMask
            pt={{
              input: { className: "w-full" },
            }}
          />
        </div>
        <Button type="submit" label="Sign Up" loading={bIsSignupLoading} />
      </form>
      {error && <p>{error}</p>}


      {/* <div className="p-field">
        <label htmlFor="username">Username</label>
        <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="p-field">
        <label htmlFor="name">Name</label>
        <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="p-field">
        <label htmlFor="email">Email</label>
        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="p-field">
        <label htmlFor="password">Password</label>
        <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} /> */}
    </Dialog>
  );
};

export default CreateUser;