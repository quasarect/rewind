import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import SearchUser from '../components/messages/SearchUser'

import { useHttpClient } from '../hooks/httpRequest'

function Messages() {
  const show = useLocation().pathname === '/messages'

  const [searchUser, setSearchUser] = useState(false)

  const { sendRequest } = useHttpClient()

  const navigate = useNavigate()

  const redirectConversation = async userId => {
    try {
      const response = await sendRequest(
        `/conversation/create?userId=${userId}`
      )

      if (response.conversationId) {
        navigate(`/messages/${response.conversationId}`)
      }
    } catch (err) {
      console.log(err)
    }
  }

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
          onClose={userId => {
            redirectConversation(userId)
            setSearchUser(false)
          }}
        />
      )}
      <Outlet />
    </>
  )
}

export default Messages
