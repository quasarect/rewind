import { useLocation } from 'react-router-dom'

function Chat() {
  const show = useLocation().pathname === '/messages'

  return (
    <aside className='flex w-full lg:w-2/5 h-full bg-rewind-dark-primary flex-col items-end border-l border-rewind-dark-tertiary'>
      chat
    </aside>
  )
}

export default Chat
