function User({ user, select }) {
  return (
    <div
      to={`/${user?.username}`}
      className='
                flex items-center justify-start border-b border-gray-600 100 py-4 pb-4 cursor-pointer px-6
                '
      onClick={() => {
        select(user?._id)
      }}
    >
      <img src={user?.profileUrl} alt='song' className='w-12 h-12 rounded-lg' />
      <div className='ml-4'>
        <h1 className='text-lg font-semibold font-lato text-white '>
          {user?.name}
        </h1>
        <h1 className='text-sm font-lato text-gray-400 '>{user?.username}</h1>
      </div>
    </div>
  )
}

export default User
