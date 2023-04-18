import { useState, useEffect, useCallback } from 'react'

function Body() {
  // states = "started", 'completed', 'transcribed', 'error'

  const [messages, setMessages] = useState([
    {
      state: 'init',
      message: 'Initializing...',
    },
  ])

  const updateMessages = useCallback((state, message) => {
    setMessages((messages) => {
      let flag = 0
      messages.forEach((message) => {
        if (message.state === state) {
          flag = 1
        }
      })
      if (flag === 0) {
        return [...messages, { state, message }]
      } else {
        return messages
      }
    })
  }, [])

  useEffect(() => {
    let counter = 0

    let interval = setInterval(async () => {
      if (counter === 5) {
        clearInterval(interval)
        updateMessages('error', 'Voicebot is not responding')
      }

      const response = await fetch(
        import.meta.env.VITE_AI_ENDPOINT + '/execute/status',
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )

      if (response.status === 404) {
        counter++
      }

      let data = await response.json()

      data = data.status

      if (data.status === 'completed') {
        clearInterval(interval)

        updateMessages('completed', 'Calling necessary APIs...')
      } else if (data.status === 'error') {
        clearInterval(interval)

        updateMessages('error', data.error)
      } else if (data.status === 'transcribed') {
        updateMessages('transcribed', data.prompt)
      } else if (data.status === 'started') {
        updateMessages('started', 'Sending audio to voicebot...')
      }
    }, 1000)

    console.log(messages)

    return () => {
      clearInterval(interval)
      setMessages([])
    }
  }, [])

  console.log(messages)

  return (
    <div>
      {messages.map((message, index) => {
        return (
          <div key={index}>
            {message.state === 'init' && (
              <div className="mt-2">{message.message}</div>
            )}
            {message.state === 'started' && (
              <div className="mt-2">{message.message}</div>
            )}
            {message.state === 'transcribed' && (
              <div className="mt-2">
                {' '}
                <span className="py-3 text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-800 font-semibold">
                  Your Command -
                </span>{' '}
                {message.message}
              </div>
            )}
            {message.state === 'completed' && (
              <div className="text-green-500 mt-2">{message.message}</div>
            )}
            {message.state === 'error' && (
              <div className="text-red-500 mt-2">{message.message}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Body
