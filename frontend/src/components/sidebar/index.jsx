import { useContext } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

import { authContext } from '../../store/authContext'

export default function Sidebar() {
  const { user } = useContext(authContext)

  console.log(user?.spotifyData?.accessToken)

  return (
    <>
      <div className='hidden lg:block lg:w-2/5 '></div>

      <div className='w-2/5 h-screen hidden lg:block fixed right-0 top-0'>
        <aside className='flex w-full h-full bg-rewind-dark-primary flex-col items-end border-l border-rewind-dark-tertiary'>
          <div className='w-full  flex items-center justify-center p-4 '>
            {user?.spotifyData?.accessToken && (
              <SpotifyPlayer
                styles={{
                  bgColor: '#333',
                  color: '#fff',
                  trackNameColor: '#fff',
                }}
                token={user?.spotifyData?.accessToken}
                uris={['spotify:track:2pUpNOgJBIBCcjyQZQ00qU']}
              />
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
