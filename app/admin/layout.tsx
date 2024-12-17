import React from 'react'
import NavBar from '@/components/home/NavBar'
import AdminNavbar from '@/components/admin/AdminNavbar'


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-co">
        <NavBar />
        <main className="flex-1 p-4 flex-row">
          <AdminNavbar />
            {children}
        </main>
    </div>
  )
}

export default AdminLayout
