import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import SelectSong from './SelectSong'
import SelectUser from './SelectUser'

export default function DedicateUI({ setDedicate }) {
  const submitHandler = e => {
    e.preventDefault()
  }

  const modal = document.getElementById('modal')

  const [isSelectingSong, setIsSelectingSong] = useState(false)
  const [song, setSong] = useState(null)

  const [isSelectingUser, setIsSelectingUser] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setDedicate({
      to: user?._id,
      name: user?.name,
      username: user?.username,
      songName: song?.trackName,
      songPhoto: song?.imageUrl,
      songUrl: song?.external_url,
    })
  }, [user, song])

  return (
    <form
      onSubmit={e => submitHandler(e)}
      className='flex flex-col md:flex-row items-start md:items-center justify-evenly pr-16 flex-wrap'
    >
      <div className='flex items-center justify-start'>
        <label>To</label>
        <button
          className='
        border-b ml-4 outline-none bg-transparent text-white px-2 resize-none py-1'
          onClick={() => setIsSelectingUser(!isSelectingUser)}
        >
          {user ? user?.username : 'Select User'}
        </button>
      </div>
      <div className='flex items-center justify-start mt-4 md:mt-0'>
        <label>Song</label>
        <button
          className='
        border-b ml-4 outline-none bg-transparent text-white px-2 resize-none py-1'
          onClick={() => setIsSelectingSong(!isSelectingSong)}
        >
          {song !== null ? song?.trackName : 'Select a song'}
        </button>
      </div>
      {isSelectingSong &&
        createPortal(
          <SelectSong
            setIsSelectingSong={setIsSelectingSong}
            setSong={setSong}
          />,
          modal
        )}
      {isSelectingUser &&
        createPortal(
          <SelectUser
            setIsSelectingUser={setIsSelectingUser}
            setUser={setUser}
          />,
          modal
        )}
    </form>
  )
}
