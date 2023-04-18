import { useState, useEffect, useCallback } from 'react'

function Body() {
  // states = "started", 'completed', 'transcribed', 'error'

  const [state, setState] = useState('init')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let counter = 0

    let interval = setInterval(async () => {
      if (counter === 5) {
        clearInterval(interval)
        setState('error')
        setMessage('Voicebot is not responding')
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

      console.log(data)

      if (data.status === 'completed') {
        clearInterval(interval)
        setState('completed')
        setMessage('Calling necessary APIs...')
      } else if (data.status === 'error') {
        clearInterval(interval)
        setState('error')
        setMessage(data.error)
      } else if (data.status === 'transcribed') {
        setState('transcribed')
        setMessage(data?.prompt)
      } else if (data.status === 'started') {
        setState('started')
        setMessage('Sending audio to voicebot...')
      }
    }, 500)

    return () => {
      clearInterval(interval)
      setMessage('')
      setState('')
    }
  }, [])

  return (
    <div>
      {state === 'init' && <div>Initializing...</div>}
      {state === 'started' && <div>{message}</div>}
      {state === 'transcribed' && <div>Your Prompt: {message}</div>}
      {state === 'completed' && <div className="text-green-500">{message}</div>}
      {state === 'error' && <div className="text-red-500">{message}</div>}
    </div>
  )
}

export default Body
