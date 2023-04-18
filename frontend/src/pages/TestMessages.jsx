import React, { useState, useEffect } from 'react'
import { socket } from '../socket'

function Messages() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message])
    })
  }, [])

  const connect = () => {
    socket.connect()
  }

  const disconnect = () => {
    socket.disconnect()
  }

  const sayTyping = () => {
    socket.emit('typing', 'hello')
  }

  const sendMessage = () => {
    socket.emit('sendMessage', 'hello')
  }

  return (
    <div>
      <div>
        <button
          onClick={connect}
          className="
        px-4 py-2 border border-white  
      "
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          className="
        px-4 py-2 border border-white  
      "
        >
          Disconnect
        </button>
      </div>
      <div>
        <button
          onClick={sayTyping}
          className="
        px-4 py-2 border border-white
      "
        >
          Say Typing
        </button>
        <button
          onClick={sendMessage}
          className="
        px-4 py-2 border border-white
      "
        >
          Send Message
        </button>
      </div>
    </div>
  )
}

export default Messages
