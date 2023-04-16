import { Link } from 'react-router-dom'

function User({ user }) {
  return (
    <Link
      to={`/${user?.username}`}
      className='
                flex items-center justify-start border-b border-gray-600 100 py-4 pb-4 cursor-pointer px-6
                '
    >
      <img src={user?.profileUrl} alt='song' className='w-12 h-12 rounded-lg' />
      <div className='ml-4'>
        <h1 className='text-lg font-semibold font-lato text-white '>
          {user?.name}
        </h1>
        <h1 className='text-sm font-lato text-gray-400 '>{user?.username}</h1>
      </div>
    </Link>
  )
}

export default User
