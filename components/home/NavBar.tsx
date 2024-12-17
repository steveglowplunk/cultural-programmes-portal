"use client";

import { useAuthContext } from "@/providers/auth-provider";
import { Image } from "primereact/image";
import { useRouter } from "next/navigation"; // 使用 next/navigation 的 useRouter

const NavBar = () => {
  const { user, userInfo, logout, refreshUserInfo } = useAuthContext();
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

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
          LCSD Cultural Programmes Portal
        </p>
      </div>
      <div className="flex space-x-2 items-center">
        <p>{userInfo?.username}</p>
        <button onClick={handleLogout}>
          <i className="pi pi-sign-out text-xl text-red-700" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
