import { useRouter } from "next/navigation"; // 使用 next/navigation 的 useRouter
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const withAuth = (
  WrappedComponent: React.ComponentType,
  allowedRoles: string[]
) => {
  return (props: any) => {
    const [isClient, setIsClient] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter(); // 確保 useRouter 在組件的頂層調用

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (isClient) {
        console.log("Checking for token and role");
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login page");
          router.push("/");
          return;
        }

        const decodedToken = jwt.decode(token) as {
          role: string;
          exp: number;
        } | null;
        if (!decodedToken || !allowedRoles.includes(decodedToken.role)) {
          console.log("Invalid token or role, redirecting to login page");
          router.push("/");
          return;
        }

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log("Token expired, redirecting to login page");
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      }
    }, [isClient, router]);

    if (!isClient || !isAuthorized) {
      return null; // 或者返回一個加載中的指示器
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
