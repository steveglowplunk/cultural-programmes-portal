import React from 'react'
import AdminNavItems from './AdminNavItems'

const AdminNavbar = () => {
    
  return (
    <>
    <aside
      className={"bottom-0 hidden  py-6 z-20 w-96 select-none bg-gradient-to-b from-white to-gray-100 transition-all duration-300  border-r-content-8 border-r shadow-md"}
    >
      <div className="flex h-full flex-col overflow-y-scroll">
        {/* items of the sidebar */}
        <AdminNavItems />
        {/* end of items of the sidebar */}
      </div>
    </aside>
  </>
  )
}

export default AdminNavbar
