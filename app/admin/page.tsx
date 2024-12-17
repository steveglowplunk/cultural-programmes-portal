"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation"; // 使用 next/navigation 的 useRouter
import axios from "axios";
import withAuth from "../withAuth";

const AdminPage = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>
      <p>This is the admin page.</p>
      {/* 其他頁面內容 */}
    </div>
  );
};

export default withAuth(AdminPage, ["admin"]);
