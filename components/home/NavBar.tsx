"use client";

import { useEffect, useState } from "react";
import { Image } from "primereact/image";
import { InputSwitch } from "primereact/inputswitch";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [userData, setUserData] = useState<{ role: string; username: string } | null>(null);

  // Handle theme changes
  useEffect(() => {
    const theme = isDarkTheme ? 'lara-dark-cyan' : 'lara-light-cyan';
    const link = document.getElementById('theme-link') as HTMLLinkElement;
    if (link) {
      link.href = `/theme/${theme}/theme.css`;
    }
  }, [isDarkTheme]);

  // Load user data
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <nav className="flex h-24 items-center space-x-2 justify-between px-4 shadow-md">
      <div className="flex h-full items-center space-x-4">
        <div className="flex flex-col h-full justify-end">
          <Image
            src="/Leisure_and_Cultural_Services_Department.png"
            alt="logo"
            width="75"
            className="opacity-25"
          />
        </div>
        <p className="text-2xl text-gray-600">
          {userData?.role === 'admin' ? 'Cultural Programmes Admin Portal' : 'Cultural Programmes Portal'}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <i className="pi pi-sun text-xl" />
          <InputSwitch
            checked={isDarkTheme}
            onChange={(e) => setIsDarkTheme(e.value)}
          />
          <i className="pi pi-moon text-xl" />
        </div>
        <div className="flex space-x-2 items-center">
          <p>{userData?.role === 'admin' && 'Admin:'}{userData?.username}</p>
          <button onClick={handleLogout}>
            <i className="pi pi-sign-out text-xl text-red-700" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;