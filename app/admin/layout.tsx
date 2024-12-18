import React from 'react'
import NavBar from '@/components/home/NavBar'
import AdminNavbar from '@/components/admin/AdminNavbar'


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex-row flex h-[calc(100vh-6rem)]">
        <AdminNavbar />
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
