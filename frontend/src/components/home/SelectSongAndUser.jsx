import React, { useState } from 'react'

import { useHttpClient } from '../../hooks/httpRequest'

function SelectSongAndUser({ song, setSong, user, setUser }) {
  const [songs, setSongs] = useState([])
  const { sendRequest: fetchSongs, isLoading: isSongsLoadings } =
    useHttpClient()

  const searchSongs = async e => {
    try {
      const res = await fetchSongs('/search/song?text=' + e.target.value)
      setSongs(res.tracks)
      console.log(res.tracks)
    } catch (err) {
      console.log(err)
    }
  }

  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const { sendRequest: fetchUsers, isLoading: isUsersLoading } = useHttpClient()

  const searchUsers = async e => {
    try {
      const res = await fetchUsers('/search/global?text=' + e.target.value)
      setUsers(res?.users)
      setError(null)
      console.log(res)
    } catch (err) {
      setUsers([])
      setError(err.message)
      console.log(err)
    }
  }

  return (
    <div>
      <div className='w-full h-full px-6 py-4 text-black'>
        <div>
          <input
            type='text'
            className='w-full h-10 px-2 border text-white rounded-lg focus:outline-none focus:border-gray-500 mt-2 bg-transparent '
            placeholder='Search for a song'
            onInput={e => {
              searchSongs(e)
            }}
            value={song?.trackName}
            readOnly={song?.trackName ? true : false}
          />
        </div>
        {isSongsLoadings && <span className='text-white'>Loading..</span>}
        {!isSongsLoadings &&
          songs.map(song => (
            <div className='mt-6' key={song?.imageUrl}>
              <div
                className='
                flex items-center justify-start border-b border-rewind-dark-secondary py-2 pb-4 cursor-pointer
                '
                onClick={() => {
                  console.log(song)
                  setSong(song)
                  setSongs([])
                }}
              >
                <img
                  src={song?.imageUrl}
                  alt='song'
                  className='w-12 h-12 rounded-lg'
                />
                <div className='ml-4'>
                  <h1 className='text-lg font-semibold font-lato text-white '>
                    {song?.trackName}
                  </h1>
                  <h1 className='text-sm font-lato text-gray-400 '>
                    {song?.artist}
                  </h1>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className='w-full h-full px-6 py-4 text-black'>
        <div>
          <input
            type='text'
            className='w-full h-10 px-2 border text-white rounded-lg focus:outline-none focus:border-gray-500 mt-2 bg-transparent '
            placeholder='Search for a user'
            onInput={e => searchUsers(e)}
            value={user?.name}
            readOnly={user?._id ? true : false}
          />
        </div>
        {isUsersLoading && 'loading..'}
        {error && error}
        {!isUsersLoading &&
          users.map(user => (
            <div className='mt-6' key={user?._id}>
              <div
                className='
                flex items-center justify-start border-b border-gray-600 100 py-2 pb-4 cursor-pointer
                '
                onClick={() => {
                  setUser(user)
                  setUsers([])
                }}
              >
                <img
                  src={user?.profileUrl}
                  alt='song'
                  className='w-12 h-12 rounded-lg'
                />
                <div className='ml-4'>
                  <h1 className='text-lg font-semibold font-lato text-white '>
                    {user?.name}
                  </h1>
                  <h1 className='text-sm font-lato text-gray-400 '>
                    {user?.username}
                  </h1>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default SelectSongAndUser
