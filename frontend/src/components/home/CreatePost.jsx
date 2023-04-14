import { useState } from 'react'
import { createPortal } from 'react-dom'

import { useHttpClient } from '../../hooks/httpRequest'

function SelectSong({ setIsSelectingSong }) {
  const song = {
    artist: 'The Weeknd',
    title: 'Blinding Lights',
    photo: 'https://i.scdn.co/image/ab67616d000048517359994525d219f64872d3b1',
  }

  return (
    <div
      className={`absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex overflow-hidden z-50`}
    >
      <div className='w-full h-full flex justify-center items-center z-[10]'>
        <div
          className={
            'bg-white w-full mx-4 md:mx-0 md:w-2/3 lg:w-3/5 h-3/5 rounded-lg flex flex-col justify-between overflow-auto z-[100]'
          }
        >
          <div className='w-full flex h-fit px-4 py-2 justify-between items-center border-b pb-3 border-gray-400'>
            <h1 className='text-lg font-semibold font-lato text-gray-700 '>
              Select a Song
            </h1>
            <button
              className='text-3xl text-gray-400 h-fit hover:text-gray-500'
              onClick={() => setIsSelectingSong(false)}
            >
              &times;
            </button>
          </div>
          <div className='w-full h-full px-6 py-4 text-black'>
            <div>
              <input
                type='text'
                className='w-full h-10 px-2 border border-gray-400 rounded-lg focus:outline-none focus:border-gray-500 mt-2'
                placeholder='Search for a song'
              />
            </div>
            <div className='mt-6'>
              <div
                className='
                flex items-center justify-start border-b border-gray-300 py-2 pb-4 cursor-pointer
                '
              >
                <img
                  src={song.photo}
                  alt='song'
                  className='w-12 h-12 rounded-lg'
                />
                <div className='ml-4'>
                  <h1 className='text-lg font-semibold font-lato text-gray-700 '>
                    {song.title}
                  </h1>
                  <h1 className='text-sm font-lato text-gray-400 '>
                    {song.artist}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DedicateUI() {
  const submitHandler = e => {
    e.preventDefault()
  }

  const modal = document.getElementById('modal')

  const [isSelectingSong, setIsSelectingSong] = useState(false)

  return (
    <form
      onSubmit={e => submitHandler(e)}
      className='flex flex-col md:flex-row items-start md:items-center justify-evenly pr-16 flex-wrap'
    >
      <div className='flex items-center justify-start'>
        <label>To</label>
        <input
          type='text'
          className='
        border-b ml-4 outline-none bg-transparent text-white px-2 resize-none py-1 w-28
        '
          placeholder='username'
        />
      </div>
      <div className='flex items-center justify-start mt-4 md:mt-0'>
        <label>Song</label>
        <button
          className='
        border-b ml-4 outline-none bg-transparent text-white px-2 resize-none py-1'
          onClick={() => setIsSelectingSong(!isSelectingSong)}
        >
          select song
        </button>
      </div>
      {isSelectingSong &&
        createPortal(
          <SelectSong setIsSelectingSong={setIsSelectingSong} />,
          modal
        )}
    </form>
  )
}

function DedicateButtonUI({ setIsDedicated, isDedicated }) {
  return isDedicated ? (
    <div
      className='border w-fit h-fit border-rewind-dark-tertiary px-2 font-manrope rounded-full cursor-pointer'
      onClick={() => setIsDedicated(false)}
    >
      -Dedicate
    </div>
  ) : (
    <div
      className='border w-fit h-fit border-rewind-dark-tertiary px-2 font-manrope rounded-full cursor-pointer'
      onClick={() => setIsDedicated(true)}
    >
      +Dedicate
    </div>
  )
}

export default function CreatePost({ fetchPosts, profileUrl }) {
  const [post, setPost] = useState('')

  const [isDedicated, setIsDedicated] = useState(false)

  const { isLoading, error, sendRequest } = useHttpClient()

  const postHandler = async () => {
    if (post.length === 0) return

    try {
      const response = await sendRequest(
        '/posts/create',
        'POST',
        JSON.stringify({
          text: post,
        }),
        {
          'Content-Type': 'application/json',
        }
      )

      console.log(response)
      fetchPosts()
      setPost('')
    } catch (err) {
      alert(err.message || 'Something went wrong, please try again later.')
    }
  }

  return (
    <div className='py-2 px-4 border-b border-rewind-dark-tertiary'>
      <div className='flex justify-between py-4'>
        <img
          src={profileUrl}
          alt='profile'
          className='rounded-full h-10 w-10 object-cover'
        />
        <div className='flex-1 ml-2 w-full'>
          <textarea
            type='text'
            className='border-0 outline-none bg-transparent text-white text-lg px-2 w-full resize-none py-1 h-10'
            placeholder='What is on your mind?'
            value={post}
            onChange={e => setPost(e.target.value)}
          />
        </div>
      </div>

      {isDedicated && <DedicateUI />}

      <div className='w-full flex justify-between items-center px-6 py-2'>
        <DedicateButtonUI
          setIsDedicated={setIsDedicated}
          isDedicated={isDedicated}
        />
        <button
          className='px-4 py-1 text-lg text-white bg-rewind-dark-tertiary rounded-full text-poppins hover:bg-gray-200 hover:text-rewind-dark-primary transition-colors'
          onClick={postHandler}
        >
          Post
        </button>
      </div>
    </div>
  )
}
