import { useState, useEffect, useCallback } from 'react'

import { useHttpClient } from '../../hooks/httpRequest'

function Body({ setLoading }) {
  // states = "started", 'completed', 'transcribed', 'error'

  const { isLoading, error, sendRequest } = useHttpClient()

  const [messages, setMessages] = useState([
    {
      state: 'init',
      message: 'Initializing...',
    },
  ])

  const [API, setAPI] = useState(null)

  const [users, setUsers] = useState([])

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
        return [...messages]
      }
    })
  }, [])

  const functions = {
    post: (text, cb) => {
      sendRequest(
        '/posts/create',
        'POST',
        JSON.stringify({
          text,
        })
      )
        .then((data) => {
          cb(data)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    },

    searchUser: (text, cb) => {
      sendRequest('/search/global?text=' + text)
        .then((data) => {
          cb(data)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    },
  }

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
        setAPI(data?.success)
        updateMessages('started', 'Extracting necessary APIs...')

        switch (data?.success?.type) {
          case 'post':
            updateMessages('started', 'Post Body: ' + data?.success?.text)
            updateMessages('started', 'Creating post...')
            functions.post(data?.success?.text, (data) => {
              if (data) {
                updateMessages('completed', 'Post created successfully')
              } else {
                updateMessages('error', data.error)
              }
            })
            break
          case 'search-user':
            updateMessages('started', 'Search Query: ' + data?.success?.query)
            functions.searchUser(data?.success?.query, (data) => {
              if (data) {
                updateMessages('completed', 'Fetching Users..')
                setUsers(data.users)
                if (data.users.length === 0) {
                  updateMessages('error', 'No users found')
                } else {
                  updateMessages(
                    'completed',
                    'Users fetched successfully. Found ' +
                      data.users.length +
                      ' users'
                  )
                }
              } else {
                updateMessages('error', data.error)
              }
            })
            break
          default:
            updateMessages('error', 'No available API')
            setLoading(false)
            break
        }
      } else if (data.status === 'error') {
        clearInterval(interval)
        updateMessages('error', data.error)
        setLoading(false)
      } else if (data.status === 'transcribed') {
        updateMessages('transcribed', data.prompt)
      } else if (data.status === 'started') {
        updateMessages('started', 'Sending audio to voicebot...')
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      setMessages([])
    }
  }, [])

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

      <div className="mt-4 w-full">
        {users?.length > 0 &&
          users.map((user, index) => {
            return (
              <div
                className="
            flex items-center justify-start border-b border-gray-600 100 py-2 pb-4 cursor-pointer
            "
                key={index}
              >
                <img
                  src={user?.profileUrl}
                  alt="song"
                  className="w-12 h-12 rounded-lg"
                />
                <div className="ml-4">
                  <h1 className="text-lg font-semibold font-lato text-white ">
                    {user?.name}
                  </h1>
                  <h1 className="text-sm font-lato text-gray-400 ">
                    {user?.username}
                  </h1>
                </div>
              </div>
            )
          })}
      </div>

      {error && (
        <div className="mt-2">
          Error Occured while calling the API:{' '}
          <span className="text-red-500">{error}</span>
        </div>
      )}
    </div>
  )
}

export default Body
