import { io } from 'socket.io-client'

export const chatSocket = io(import.meta.env.VITE_SOCKET_ENDPOINT + '/chat', {
  autoConnect: false,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const musicSocket = io(import.meta.env.VITE_SOCKET_ENDPOINT + '/music', {
  autoConnect: false,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
