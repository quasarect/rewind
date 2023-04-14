import { Link } from 'react-router-dom'

function DedicateCard({ dedicate }) {
  return (
    <div className='mt-2'>
      <div className='w-full flex items-center justify-center'>
        <div className='mt-4 py-4 px-10 w-fit font-manrope flex flex-col items-center justify-center border border-rewind-dark-secondary bg-rewind-dark-secondary rounded'>
          <div className='flex items-center justify-center cursor-pointer'>
            <img
              src='https://i.scdn.co/image/ab67616d0000b273eb0b18cce8b7f5c9fc1579e7'
              alt='track'
              className='rounded-full h-16 w-16 object-cover block'
            />
            <div className='ml-3 text-gray-400 text-md'>
              <div>Let Her Go</div>
              <div className='text-sm text-green-400'>spotify ⇢</div>
            </div>
          </div>

          <div className='text-gray-400 text-md font-manrope mt-2'>
            Dedicated to {dedicate?.name}(@
            <Link
              to={'/' + dedicate?.username}
              className='underline cursor-pointer'
            >
              {dedicate?.username}
            </Link>
            )
          </div>
        </div>
      </div>
    </div>
  )
}

export default DedicateCard
