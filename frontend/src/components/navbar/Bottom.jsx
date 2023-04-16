import { Link } from 'react-router-dom'

import home from './icons/home.svg'
import explore from './icons/explore.svg'
import messages from './icons/messages.svg'
import voice from './icons/voice.svg'
import profile from './icons/profile.svg'

export default function Bottom({ user, setShowBot }) {
  return (
    <div>
      <nav className='fixed bottom-0 py-4 pb-6 max-h-16 w-screen bg-rewind-dark-primary md:hidden z-50'>
        <ul className='flex justify-evenly items-center'>
          <li>
            <Link to='/' className='hover:text-rewind-secondary'>
              <img src={home} />
            </Link>
          </li>

          <li>
            <Link to='/explore' className='hover:text-rewind-secondary'>
              <img src={explore} />
            </Link>
          </li>

          <li>
            <Link
              to='/'
              className='hover:text-rewind-secondary'
              onClick={() => setShowBot(true)}
            >
              <img
                src={voice}
                className='max-h-10 mr-1 rounded-full border border-rewind-secondary px-4 py-2'
              />
            </Link>
          </li>

          <li>
            <Link to='/messages' className='hover:text-rewind-secondary'>
              <img src={messages} />
            </Link>
          </li>

          <li>
            <Link
              to={'/' + user?.username}
              className='hover:text-rewind-secondary'
            >
              <img src={profile} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
