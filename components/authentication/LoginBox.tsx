import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { Password } from "primereact/password";
import axios from "axios";

// login box component for login page, used for both standard user and admin login
const LoginBox = ({ bUseAdmin }: { bUseAdmin?: boolean }) => {
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bIsLoginLoading, setBIsLoginLoading] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBIsLoginLoading(true);
    try {
      console.log("Sending request to backend with:", { email, password });
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        setMessage("Login successful!");
        // Redirect to event-info page
        router.push(response.data.redirectUrl);
      } else {
        setMessage("Invalid email or password");
      }
    } catch (error) {
      setMessage("Eorro. Please try again.");
    } finally {
      setBIsLoginLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <InputText
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" label="Login" loading={bIsLoginLoading} />
      </form>
      {message && <p>{message}</p>}
      <p>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginBox;
