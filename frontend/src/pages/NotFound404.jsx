import { Link } from 'react-router-dom'

function NotFound404() {
  return (
    <div className='bg-rewind-dark-primary h-screen w-screen flex flex-col items-center justify-center'>
      <div>404 | Page Not Found</div>
      <Link to='/' className='mt-2 hover:underline'>
        ← back to home
      </Link>
    </div>
  )
}

export default NotFound404
