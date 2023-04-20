import { useState, useContext, useRef, useEffect, useCallback } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

import { authContext } from '../../store/authContext'

import { useHttpClient } from '../../hooks/httpRequest'

import { Link } from 'react-router-dom'

export default function Sidebar() {
  const { user, songs } = useContext(authContext)

  const [users, setUsers] = useState([])
  const { sendRequest } = useHttpClient()

  const searchUsers = useCallback(async () => {
    try {
      const response = await sendRequest('/search/global?text=')

      setUsers(response.users.reverse().slice(0, 6))
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    searchUsers()
  }, [searchUsers])

  const playerRef = useRef()

  return (
    <>
      <div className="hidden lg:block lg:w-2/5 "></div>

      <div className="w-2/5 h-screen hidden lg:block fixed right-0 top-0">
        <aside className="flex w-full h-full bg-rewind-dark-primary flex-col items-end border-l border-rewind-dark-tertiary">
          <div className="w-full  flex items-center justify-center p-4 ">
            {user?.spotifyData?.accessToken && (
              <SpotifyPlayer
                ref={playerRef}
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
          <div className="w-full mt-4">
            <div>
              {users.length > 0 && (
                <>
                  <div className="p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary">
                    People you might like ⇣
                  </div>
                  {users.map((user) => {
                    return (
                      <Link
                        to={`/${user?.username}`}
                        className="
                              flex items-center justify-start border-gray-600 100 py-4 pb-4 cursor-pointer px-6
                              "
                      >
                        <img
                          src={user?.profileUrl}
                          alt="song"
                          className="w-12 h-12 rounded-lg"
                        />
                        <div className="ml-4">
                          <h1 className="text-lg font-semibold font-lato text-white ">
                            {user?.name}
                          </h1>
                          <h1 className="text-sm font-lato text-gray-400 ">
                            {user?.username}
                          </h1>
                        </div>
                      </Link>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
