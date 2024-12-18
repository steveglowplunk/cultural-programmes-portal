"use client";

import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import axios from "axios";

// signup form component for signup page
const SignupBox = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bIsSignupLoading, setbIsSignupLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setbIsSignupLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setbIsSignupLoading(false);
      return;
    }
    if (!password || password.length < 6 || password.length > 255) {
      setError("Invalid password");
      setbIsSignupLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/signup",
        {
          username: userName, // 使用正確的鍵名
          email,
          password,
        }
      );
      if (response.data.success) {
        setError("User registered successfully!");
        // Redirect to login page or other page
        router.push("event-info");
      } else if (response.status === 401) {
        console.log(response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setbIsSignupLoading(false);
    }
  };

  return (
    <div className="flex md:w-2/3 items-center justify-center">
      <div className="flex flex-col p-12 md:w-[34rem] h-fit custom-shadow-border rounded-[50px]">
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <p className="text-2xl">Username</p>
            <InputText
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
              className="w-full"
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
              className="w-full"
              pt={{
                input: { className: "w-full" },
              }}
            />
          </div>
          <Button type="submit" label="Sign Up" loading={bIsSignupLoading} />
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default SignupBox;
