import { io } from 'socket.io-client'

export const chatSocket = io(import.meta.env.VITE_API_ENDPOINT + '/chat', {
  autoConnect: false,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const musicSocket = io(import.meta.env.VITE_API_ENDPOINT + '/music', {
  autoConnect: false,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
