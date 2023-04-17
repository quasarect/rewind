import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import SearchUser from '../components/messages/SearchUser'

function Messages() {
  const show = useLocation().pathname === '/messages'

  const [searchUser, setSearchUser] = useState(false)

  return (
    <>
      <div
        className={`w-full h-fit pb-16 md:pb-0 md:w-4/5 bg-rewind-dark-primary ${
          !show && 'hidden lg:block lg:w-2/5'
        }`}
      >
        <div className='p-4 text-poppins text-gray-200 text-xl border-b border-rewind-dark-tertiary w-full flex justify-between items-center'>
          <div>Messages</div>
          <div>
            <button
              className='bg-rewind-dark-tertiary text-gray-200 text-base font-manrope px-4 py-1 rounded-md'
              onClick={() => {
                setSearchUser(true)
              }}
            >
              New
            </button>
          </div>
        </div>
      </div>
      {searchUser && (
        <SearchUser
          onClose={() => {
            setSearchUser(false)
          }}
        />
      )}
      <Outlet />
    </>
  )
}

export default Messages
