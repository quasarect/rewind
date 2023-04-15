import React, { useState } from 'react'

import { useHttpClient } from '../../hooks/httpRequest'

export default function SelectSong({ setIsSelectingSong, setSong }) {
  const [songs, setSongs] = useState([])
  const { sendRequest, isLoading, error } = useHttpClient()

  const searchSongs = async e => {
    try {
      const res = await sendRequest('/search/song?text=' + e.target.value)
      setSongs(res.tracks)
      console.log(res.tracks)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex overflow-hidden z-50`}
    >
      <div className='w-full h-full flex justify-center items-center z-[10]'>
        <div
          className={
            'bg-rewind-dark-tertiary w-full mx-4 md:mx-0 md:w-2/3 lg:w-3/5 h-3/5 rounded-lg flex flex-col justify-between overflow-auto z-[100]'
          }
        >
          <div className='w-full flex h-fit px-4 py-2 justify-between items-center border-b pb-3 border-gray-400'>
            <h1 className='text-lg font-semibold font-lato text-white '>
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
                className='w-full h-10 px-2 border text-white rounded-lg focus:outline-none focus:border-gray-500 mt-2 bg-transparent '
                placeholder='Search for a song'
                onInput={e => searchSongs(e)}
              />
            </div>
            {isLoading && <span className='text-white'>Loading..</span>}
            {!isLoading &&
              songs.map(song => (
                <div className='mt-6' key={song?.imageUrl}>
                  <div
                    className='
                flex items-center justify-start border-b border-rewind-dark-secondary py-2 pb-4 cursor-pointer
                '
                    onClick={() => {
                      setSong(song)
                      setIsSelectingSong(false)
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
        </div>
      </div>
    </div>
  )
}
