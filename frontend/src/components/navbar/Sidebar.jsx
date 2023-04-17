import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { authContext } from '../../store/authContext'

import home from './icons/home.svg'
import explore from './icons/explore.svg'
import messages from './icons/messages.svg'
import profile from './icons/profile.svg'
import voice from './icons/voice.svg'
import notif from './icons/notif.svg'

export default function Sidebar({ user, setShowBot }) {
  const { logout } = useContext(authContext)

  return (
    <>
      <div className='hidden md:block w-1/5'></div>
      <aside className='hidden md:block fixed h-screen w-1/5'>
        <nav className='flex justify-end w-full h-full bg-rewind-dark-primary border-r border-rewind-dark-tertiary'>
          {/* below div is for responsive layout  */}
          <div className='w-full h-screen lg:w-4/5 flex flex-col justify-between'>
            {/* the logo div  */}
            <Link to={'/'} className='w-full flex items-center mt-10'>
              <img src='/logo.svg' alt='Rewind Logo' width={50} height={50} />
            </Link>
            {/* the nav items  */}
            <ul className='h-full py-10'>
              <li>
                <Link
                  to='/'
                  className='w-full h-10 flex items-center my-2 text text-xl hover:text-rewind-secondary'
                >
                  <img src={home} className='h-6' />
                  <span className='ml-2 text-white'>Home</span>
                </Link>
              </li>

              <li>
                <Link
                  to='/explore'
                  className='w-full h-10 flex items-center my-2 text text-xl hover:text-rewind-secondary'
                >
                  <img src={explore} className='h-6' />
                  <span className='ml-2 text-white'>Explore</span>
                </Link>
              </li>

              <li>
                <Link
                  to=''
                  className='w-full h-10 flex items-center my-2 text text-xl '
                  onClick={() => setShowBot(true)}
                >
                  <img src={voice} className='max-h-7 mx-1' />
                  <span className='ml-2 text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-800 font-semibold'>
                    Rebot
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to='/notifications'
                  className='w-full h-10 flex items-center my-2 text text-xl hover:text-rewind-secondary'
                >
                  <div className='relative'>
                    <img src={notif} className='h-6' />
                    {user?.notifCount > 0 && (
                      <div class='absolute inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rewind-secondary border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900'>
                        {user?.notifCount}
                      </div>
                    )}
                  </div>
                  <span className='ml-2 text-white'>Notifications</span>
                </Link>
              </li>

              <li>
                <Link
                  to='/messages'
                  className='w-full h-10 flex items-center my-2 text text-xl hover:text-rewind-secondary'
                >
                  <img src={messages} className='h-6' />
                  <span className='ml-2 text-white'>Messages</span>
                </Link>
              </li>

              <li>
                <Link
                  to={'/' + user?.username}
                  className='w-full h-10 flex items-center my-2 text text-xl hover:text-rewind-secondary'
                >
                  <img src={profile} className='h-6' />
                  <span className='ml-2 text-white'>Profile</span>
                </Link>
              </li>
            </ul>
            {/* copyright */}
            <div
              className='w-full lg:w-4/5 text-ubuntu text-red-700 text-sm  text-manrope mb-2 cursor-pointer flex items-center justify-center'
              onClick={() => {
                logout()
                window.location.reload()
              }}
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
