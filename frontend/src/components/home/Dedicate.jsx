import { useState, useEffect } from 'react'

import Modal from '../utils/Modal'

import CrossSVG from '../assets/cross.svg'
import SelectSongAndUser from './SelectSongAndUser'
import DedicateCard from '../posts/DedicateCard'

function Dedicate({ setDedicate, dedicate, setIsDedicated }) {
  const [song, setSong] = useState(null)
  const [user, setUser] = useState(null)

  const [showActions, setShowActions] = useState(false)

  useEffect(() => {
    if (song?.trackName && user?._id) setShowActions(true)
    else setShowActions(false)
  }, [song, user])

  const submitHandler = () => {
    setDedicate({
      to: user,
      songName: song?.trackName,
      songPhoto: song?.imageUrl,
      songUrl: song?.external_url,
    })
  }

  if (dedicate?.to && dedicate?.songName)
    return (
      <div className='w-fit max-w-full relative '>
        <span
          className='absolute top-0 right-0 text-2xl text-white cursor-pointer bg-gray-800 rounded-full p-1 translate-x-1/2 translate-y-1/2'
          onClick={() => {
            setDedicate(null)
            setIsDedicated(false)
          }}
        >
          <img src={CrossSVG} alt='cross' />
        </span>
        <DedicateCard dedicated={dedicate} />
      </div>
    )

  return (
    <Modal
      title='Dedicate a Song'
      onClose={() => {
        setDedicate(null)
        setIsDedicated(false)
      }}
      onOk={submitHandler}
      showActions={showActions}
    >
      <SelectSongAndUser
        user={user}
        setSong={setSong}
        setUser={setUser}
        song={song}
      />
    </Modal>
  )
}

export default Dedicate
