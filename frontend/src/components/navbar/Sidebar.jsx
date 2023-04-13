import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { authContext } from '../../store/authContext'

export default function Sidebar({ navItems }) {
  const { logout } = useContext(authContext)

  return (
    <>
      <div className='hidden md:block w-1/5'></div>
      <aside className='hidden md:block fixed h-screen w-1/5'>
        <nav className='flex justify-end w-full h-full bg-rewind-dark-primary border-r border-rewind-dark-tertiary'>
          {/* below div is for responsive layout  */}
          <div className='w-full h-screen lg:w-4/5 flex flex-col justify-between'>
            {/* the logo div  */}
            <div className='w-full flex items-center mt-10'>
              <img src='/logo.svg' alt='Rewind Logo' width={50} height={50} />
            </div>
            {/* the nav items  */}
            <ul className='h-full py-10'>
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className='w-full h-10 flex items-center my-2 text text-xl hover:text-rewind-secondary'
                  >
                    <img src={item?.icon} />
                    <span className='ml-2 text-white'>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {/* copyright */}
            <div
              className='w-full lg:w-4/5 text-ubuntu text-red-700 text-sm  text-manrope mb-2 cursor-pointer flex items-center justify-center'
              onClick={logout}
            >
              logout..
            </div>
            <div className='w-full lg:w-4/5 text-ubuntu text-white text-sm text-poppins mb-4'>
              © 2023 Rewind.io
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
