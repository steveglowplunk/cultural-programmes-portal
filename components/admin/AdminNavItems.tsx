'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'


const AdminNavItems = () => {
  const items: { id: string; link: string; label: string; icon: string }[] =
    [
      { id: '1', link: '/admin', label: 'Location', icon: "pi-map-marker" },
      { id: '2', link: '/admin/users', label: 'Users', icon: "pi-users" },
      // { id: '3', link: '', label: '', icon:  },
    ]
  const [clickedItem, setClickedItem] = useState<string>('')
  const pathname = usePathname()

  console.log('clickedItem:', clickedItem)  // clickedItem: 1
  // if directly input the url, set the clicked_item to that item id
  useEffect(() => {
    if (pathname === '/admin') setClickedItem('1')
    else if (pathname === '/admin/users') setClickedItem('2')
    // else if (pathname === '') setClicked_item('3')
  }, [pathname])

  return (
    <>
      {items &&
        items.map((item) => {
          // apply several style changes if the item is clicked
          const isActive = clickedItem === item.id
          const itemDivClassName = `flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6  w-full ${
            isActive ? 'bg-gradient-to-tr from-white to-gray-200 ' : ''
          } 
          `
          const itemLinkClassName = ` flex items-center gap-3 rounded-lg px-3 py-2 ${
            isActive ? 'text-black' : 'text-stone-400 hover:bg-neutral-50 hover:text-slate-400'
          }`

          return (
            <div key={item.id} className={itemDivClassName}>
              <Link
                href={item.link}
                className={itemLinkClassName}
                onClick={() => setClickedItem(item.id)}
              >
               <i className={` pi ${item.icon}`}></i>
               {item.label}
              </Link>
            </div>
          )
        })}
    </>
  )
}

export default AdminNavItems
