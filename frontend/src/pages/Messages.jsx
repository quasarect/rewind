import { useState, useCallback, useEffect, useContext } from 'react'
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'

import Sidebar from '../components/sidebar/index'

import SearchUser from '../components/messages/SearchUser'

import { useHttpClient } from '../hooks/httpRequest'
import { authContext } from '../store/authContext'

function Messages() {
  const show = useLocation().pathname === '/messages'

  const [searchUser, setSearchUser] = useState(false)
  const [conversations, setConversations] = useState([])

  const { sendRequest, isLoading } = useHttpClient()
  const { user } = useContext(authContext)

  const navigate = useNavigate()

  const redirectConversation = async (userId) => {
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

  const getConversations = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const response = await sendRequest(`/conversation/user`)

      response.conversations.forEach((conversation) => {
        if (conversation?.name) {
          return
        }

        conversation?.participants?.forEach((participant) => {
          if (
            participant._id === user._id ||
            participant._id === null ||
            user?._id === null
          ) {
            return
          }
          conversation.name = participant.name
          conversation.profileUrl = participant?.profileUrl
        })
      })

      console.log(response.conversations)

      setConversations(response.conversations)
    } catch (err) {
      console.log(err)
    }
  }, [user?._id])

  useEffect(() => {
    getConversations()
  }, [user?._id])

  return (
    <>
      <div
        className={`w-full h-fit pb-16 md:pb-0 md:w-4/5 lg:w-2/5 bg-rewind-dark-primary ${
          !show && 'hidden lg:block lg:w-2/5'
        }`}
      >
        <div className="p-4 text-poppins text-gray-200 text-xl border-b border-rewind-dark-tertiary w-full flex justify-between items-center ">
          <div>Messages</div>
          <div>
            <button
              className="bg-rewind-dark-tertiary text-gray-200 text-base font-manrope px-4 py-1 rounded-md"
              onClick={() => {
                setSearchUser(true)
              }}
            >
              New
            </button>
          </div>
        </div>
        <div className="bg-rewind-dark-primary">
          {isLoading && <div className="p-4">Loading...</div>}
          {conversations.map((conversation) => (
            <Link
              to={conversation?._id}
              key={conversation._id}
              className="p-4 text-poppins text-gray-200 text-xl border-b border-rewind-dark-tertiary w-full flex justify-between items-center"
            >
              <div className="flex items-center justify-center">
                <img
                  src={conversation?.profileUrl}
                  alt="pfp"
                  className="h-12 rounded-full"
                />
                <div className="ml-4 flex flex-col items-start ">
                  <div className="text-lg font-semibold">
                    {conversation?.name}
                  </div>
                  <div className="font-manrope text-base">
                    {conversation?.lastMessage}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {searchUser && (
        <SearchUser
          onClose={(userId) => {
            redirectConversation(userId)
            setSearchUser(false)
          }}
        />
      )}
      {show ? <Sidebar /> : <Outlet />}
    </>
  )
}

export default Messages
