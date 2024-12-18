"use client";

import { useAuthContext } from "@/providers/auth-provider";
import { Image } from "primereact/image";
import { useRouter } from "next/navigation"; // 使用 next/navigation 的 useRouter
import { useEffect, useState } from "react";

const NavBar = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/");
  };
  const [userData, setUserData] = useState<{ role: string; username: string } | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  return (
    <nav className="flex h-24 items-center space-x-2 justify-between px-4 shadow-md">
      <div className="flex h-full items-center space-x-4">
        <div className="flex flex-col h-full justify-end ">
          <Image
            src="/Leisure_and_Cultural_Services_Department.png"
            alt="logo"
            width="75"
            className="opacity-25"
          />
        </div>
        <p className="text-2xl text-gray-600">
        { userData?.role=== 'admin'? ' LCSD Cultural Programmes Admin Portal':'LCSD Cultural Programmes Portal'}
        </p>
      </div>
      <div className="flex space-x-2 items-center">
        <p> {userData?.role === 'admin'&& 'Admin:'}{userData?.username}</p>
        <button onClick={handleLogout}>
          <i className="pi pi-sign-out text-xl text-red-700" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
