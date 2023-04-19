import { useState, useEffect, useCallback, useContext } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { useHttpClient } from '../../hooks/httpRequest'

import { authContext } from '../../store/authContext'

import { chatSocket } from '../../socket'

function createTime() {
  let d = new Date()
  let hours = d.getUTCHours()
  let minutes = d.getUTCMinutes()
  let ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = minutes < 10 ? '0' + minutes : minutes
  let timeString = hours + ':' + minutes + ' ' + ampm
  console.log(timeString)
  return timeString
}

function Chat() {
  const show = useLocation().pathname === '/messages'

  const id = useParams().conversationId

  const { user } = useContext(authContext)
  const { sendRequest, isLoading } = useHttpClient()
  const navigate = useNavigate()

  const [conversation, setConversation] = useState(null)

  const [isTyping, setIsTyping] = useState('')

  const [participants, setParticipants] = useState([])

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const fetchMessages = useCallback(async () => {
    if (!id) return

    try {
      const response = await sendRequest(`/conversation?id=${id}`)

      let conversation = response.conversation
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
        conversation.username = participant?.username
      })

      setConversation(conversation)

      let messages = response?.conversation?.messages?.[0]?.messages

      if (messages) {
        messages.sort = (a, b) => {
          return a.timestamp - b.timestamp
        }

        messages.forEach((message) => {
          if (message?.userId === user?._id) {
            message.isMe = true
            message.name = user?.name
            message.profileUrl = user?.profileUrl
          } else {
            message.isMe = false

            response.conversation.participants.forEach((participant) => {
              if (participant._id === message.userId) {
                message.name = participant.name
                message.profileUrl = participant.profileUrl
              }
            })
          }
        })
      } else {
        messages = []
      }

      setMessages(messages)
      console.log(messages)
      setParticipants(response.conversation.participants)
    } catch (err) {
      navigate('/messages')
      console.log(err)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    fetchMessages()
    chatSocket.connect()

    chatSocket.emit('conversation', { room: id })

    return () => {
      chatSocket.disconnect()
    }
  }, [fetchMessages, id])

  const sendIsTyping = () => {
    chatSocket.emit('typing', {
      room: id,
    })
  }

  useEffect(() => {
    chatSocket.on('typing', (data) => {
      if (!participants) return

      let userId = data

      let text = ''

      participants?.forEach((participant) => {
        if (participant._id === userId) {
          text = `${participant?.username} is typing...`
        }
      })

      setIsTyping(text)

      setTimeout(() => {
        setIsTyping('')
      }, 2000)
    })

    chatSocket.on('message', (data) => {
      let message = data?.message

      message.message = data?.message?.text

      if (message?.userId === user?._id) {
        message.isMe = true
        message.name = user?.name
        message.profileUrl = user?.profileUrl
      } else {
        message.isMe = false

        participants.forEach((participant) => {
          if (participant._id === data.userId) {
            message.name = participant.name
            message.profileUrl = participant.profileUrl
          }
        })
      }

      setMessages((messages) => [...messages, message])
    })

    return () => {
      chatSocket.off('message')
      chatSocket.off('typing')
    }
  }, [participants, user])

  const sendMessage = () => {
    chatSocket.emit('message', {
      room: id,
      message: {
        text: message,
      },
    })

    setMessage('')

    const ts = createTime()

    setMessages((messages) => [
      ...messages,
      {
        message: message,
        isMe: true,
        name: user?.name,
        profileUrl: user?.profileUrl,
        timestamp: ts,
      },
    ])
  }

  return (
    <>
      <div className="w-full md:w-4/5 lg:w-2/5 "></div>
      <aside className="fixed right-0 top-0 w-full h-full md:pb-0 md:w-4/5 lg:w-2/5 bg-rewind-dark-primary flex flex-col border-l border-rewind-dark-tertiary pb-20">
        <div className="flex items-center px-4 py-2 border-b border-rewind-dark-tertiary w-full h-fit">
          <img
            src={conversation?.profileUrl}
            alt="pfp"
            className="h-12 rounded-full"
          />
          <div className="ml-4 flex flex-col items-start ">
            <div className="text-lg font-semibold">{conversation?.name}</div>
            <div className="font-manrope text-sm">{isTyping}</div>
          </div>
        </div>

        <div className="w-full h-full bg-rewind-dark-primary relative">
          <div className="py-1 w-full px-1 overflow-y-auto h-5/6">
            {messages?.map((message) => {
              if (!message?.timestamp) return ''

              return message?.isMe ? (
                <div
                  className="flex flex-col items-end w-2/3 px-4 py-2 rounded justify-center float-right"
                  key={message?._id}
                >
                  <div className="flex">
                    <div className="text-base mr-2">{message?.message}</div>
                    <img
                      src={message?.profileUrl}
                      alt="pfp"
                      className="h-8 rounded-full"
                    />
                  </div>
                  <div className="font-manrope text-xs mt-1 text-gray-400">
                    {message?.timestamp}
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-start w-2/3 px-4 py-2 rounded justify-center"
                  key={message?._id}
                >
                  <div className="flex">
                    <img
                      src={message?.profileUrl}
                      alt="pfp"
                      className="h-8 rounded-full"
                    />
                    <div className="text-base ml-2">{message?.message}</div>
                  </div>
                  <div className="font-manrope text-xs mt-1 text-gray-400">
                    {message?.timestamp}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="sticky bottom-0 w-full px-2 flex ">
            <input
              type="text"
              className="
              w-full h-12 px-4 py-2 rounded-md border border-rewind-dark-tertiary bg-transparent
            "
              placeholder="write your message here..."
              onKeyUp={sendIsTyping}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              className="ml-2
              w-fit h-12 px-4 py-2 rounded-md border border-rewind-dark-tertiary bg-rewind-dark-tertiary
              "
              onClick={sendMessage}
            >
              send
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Chat
