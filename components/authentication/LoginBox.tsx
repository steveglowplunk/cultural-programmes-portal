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
  const [bIsLoginLoading, setBIsLoginLoading] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    setMessage("");

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
        localStorage.setItem("token", response.data.token); // 存儲 JWT
        // Redirect to event-info page
        console.log("Redirecting to event-info page");
        router.push("/event-info");
      } else {
        setMessage("Invalid email or password");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          setMessage("Invalid email or password");
        } else {
          console.error("Error logging in:", error);
          setMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        console.error("Unexpected error:", error);
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setBIsLoginLoading(false);
    }
  };

  return (
    <>
      <div className="flex md:w-2/3 items-center justify-center">
        <div className="flex flex-col p-12 md:w-[34rem] h-fit custom-shadow-border rounded-[50px]">
          <p className="text-3xl">Sign in</p>
          {/* {!bUseAdmin ? <p className="text-xl font-light">to connect with other chads</p> : <p className="text-xl font-light">to access admin panel</p>} */}
          <hr className="h-px my-10 bg-gray-400" />
          <form
            onSubmit={handleLogin}
            className="flex flex-col h-full [&>*]:my-2"
          >
            <p className="text-2xl">Email address</p>
            <InputText
              className="custom-shadow-border-light"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* <br className='my-2' /> */}
            <p className="text-2xl">Password</p>
            <Password
              className="custom-shadow-border-light [&>*:first-child]:w-full"
              toggleMask
              feedback={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              pt={{
                input: { className: "w-full" },
              }}
            />
            {message ? (
              <div className="text-red-600">{message}</div>
            ) : (
              <br className="!my-5" />
            )}
            <div className="flex w-full justify-center">
              <Button
                onClick={() => {
                  setMessage("");
                }}
                className="px-20"
                label="Continue"
                loading={bIsLoginLoading}
              />
            </div>

            {!bUseAdmin && <br className="!my-5" />}

            {!bUseAdmin && (
              <div className="font-light">
                No account?&ensp;
                <Link href="/signup" className="text-cyan-700 hover:underline">
                  Sign up
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginBox;
