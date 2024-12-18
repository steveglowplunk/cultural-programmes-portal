import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { Password } from 'primereact/password';

const CreateUser = ({ isDialogOpen, setIsDialogOpen }: {isDialogOpen: boolean, setIsDialogOpen: Dispatch<SetStateAction<boolean>>}) => {
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
      await axios.post( process.env.NEXT_PUBLIC_BACKEND_URL +'/admin/users', { username, name, email, password });
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      setError('Failed to create user');
    } finally {
      setBIsSignupLoading(false);
    }
  };



  return (
    <Dialog header="Create User" visible={isDialogOpen} onHide={() => setIsDialogOpen(false)}>
        <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="username">Username</label>
          <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="p-field">
          <label htmlFor="name">Name</label>
          <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="p-field">
          <label htmlFor="password">Password</label>
          <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="p-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Password id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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