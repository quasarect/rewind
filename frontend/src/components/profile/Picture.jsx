function Picture({ user, topTrack }) {
  return (
    <div className=':w-auto flex flex-col items-center'>
      <img
        src={user?.profileUrl}
        alt='profile'
        className='rounded-full h-40 w-40 object-cover'
      />
      <a
        href={topTrack?.external_url}
        target='_blank'
        className='cursor-pointer'
      >
        <div className='mt-4 py-2 px-6 font-manrope w-full flex items-center justify-between border border-rewind-dark-secondary bg-rewind-dark-secondary rounded'>
          <img
            src={topTrack?.image_url}
            alt='track'
            className='rounded-full h-10 w-10 object-cover block'
          />
          <div className='ml-3 text-gray-400 text-sm'>
            <div>{topTrack?.name}</div>
            <div className='text-xs text-green-400'>spotify ⇢</div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Picture