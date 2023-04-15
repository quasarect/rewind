import { Link } from 'react-router-dom'

function dedicatedCard({ dedicated }) {
  if (!dedicated?.songName) {
    return null
  }

  return (
    <div className='mt-2'>
      <div className='w-full flex items-center justify-center'>
        <div className='mt-4 py-4 px-10 w-fit max-w-full font-manrope flex flex-col items-center justify-center border border-rewind-dark-secondary bg-rewind-dark-secondary rounded'>
          <div className='flex items-center justify-center cursor-pointer'>
            <img
              src={dedicated?.songPhoto}
              alt='track'
              className='rounded-full h-16 w-16 object-cover block'
            />
            <div className='ml-3 text-gray-400 text-md'>
              <div>{dedicated?.songName}</div>
              <a
                target='_blank'
                href={dedicated?.songUrl}
                className='text-sm text-green-400'
              >
                spotify ⇢
              </a>
            </div>
          </div>

          <div className='text-gray-400 text-md font-manrope mt-2'>
            dedicated to {dedicated?.to.name}(@
            <Link
              to={'/' + dedicated?.to.username}
              className='underline cursor-pointer'
            >
              {dedicated?.to.username}
            </Link>
            )
          </div>
        </div>
      </div>
    </div>
  )
}

export default dedicatedCard
