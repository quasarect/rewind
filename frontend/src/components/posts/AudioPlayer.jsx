import { useRef, useState, useEffect } from 'react'
import PlaySVG from './icons/play.svg'
import PauseSVG from './icons/pause.svg'
// import CCSVG from './icons/cc.svg'
import { useAudioPlayer } from '../../hooks/media'

function CCSVG({ className }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={
        'r-jwli3a r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr ' +
        className
      }
      style={{
        height: '40px',
      }}
    >
      <g>
        <path d='M16.043 6.54l4.75-4.75 1.414 1.42-4.75 4.75-1.414-1.42zM3.207 22.21l4.75-4.75-1.414-1.42-4.75 4.75 1.414 1.42zm5.727-7h.002c1.369 0 2.154-.59 2.737-1.39l-1.22-.87c-.303.44-.812.73-1.39.73-.93 0-1.685-.75-1.685-1.68s.754-1.69 1.684-1.69c.559 0 1.051.28 1.357.7l1.207-.94c-.545-.76-1.36-1.29-2.62-1.29-1.872 0-3.26 1.42-3.26 3.22v.02c0 1.84 1.421 3.19 3.187 3.19zm9.319-1.39l-1.22-.87c-.304.44-.813.73-1.39.73-.93 0-1.684-.75-1.684-1.68s.755-1.68 1.685-1.68c.559 0 1.051.27 1.356.69l1.21-.94c-.547-.76-1.36-1.29-2.622-1.29-1.872 0-3.258 1.42-3.258 3.22v.02c0 1.84 1.421 3.19 3.185 3.19 1.368 0 2.154-.59 2.738-1.39zM3 5.74V15h2V5.74c0-.27.224-.5.5-.5h9.258l2-2H5.5C4.119 3.24 3 4.36 3 5.74zM18.5 19H9.243l-2 2H18.5c1.381 0 2.5-1.12 2.5-2.5V9h-2v9.5c0 .28-.224.5-.5.5z'></path>
      </g>
    </svg>
  )
}

export default function AudioPlayer({ src, user }) {
  const audioElement = useRef(null)
  const { playerState, togglePlay } = useAudioPlayer(audioElement)

  const [color, setColor] = useState('bg-purple-500')

  useEffect(() => {
    function getRandomColor() {
      const colors = [
        '#34d399',
        '#10b981',
        '#059669',
        '#047857',
        '#065f46',
        '#4a5568',
        '#64748b',
        '#718096',
        '#2d3748',
        '#2e4053',
        '#475569',
        '#576574',
        '#6c757d',
        '#343a40',
        '#8B5CF6',
        '#6D28D9',
        '#5B21B6',
        '#A855F7',
        '#9333EA',
        '#7E22CE',
      ]

      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      return randomColor
    }

    setColor(getRandomColor())
  }, [])

  const animateClass = playerState.isPlaying ? 'animate-pulse' : ''

  return (
    <div className='relative flex items-center justify-center w-full'>
      <audio src={src} ref={audioElement} />

      <div
        className={`h-48 w-full md:w-1/2 rounded-2xl px-8 py-4 flex items-center justify-center relative`}
        style={{
          backgroundColor: color,
        }}
      >
        <div
          className={`bg-gray-100 h-24 w-24 rounded-full transition-all ${animateClass}`}
        ></div>
        <img
          src={user?.profileUrl}
          alt='profile picture'
          className='h-24 w-24 rounded-full z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '
        />
        <img
          src='/logo.svg'
          className='absolute h-8 w-8 bottom-4 left-4 bg-transparent opacity-70'
          alt='logo'
        />

        <CCSVG className='absolute h-8 w-8 right-3 top-2 opacity-70' />

        <span className='absolute bottom-4 right-4 font-manrope text-sm opacity-80'>
          @{user?.username}
        </span>

        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40'>
          {playerState.isPlaying ? (
            <img
              src={PauseSVG}
              className='w-8 h-8 text-white cursor-pointer z-40 '
              onClick={togglePlay}
            />
          ) : (
            <img
              src={PlaySVG}
              className='w-6 h-6 text-white cursor-pointer z-40'
              onClick={togglePlay}
            />
          )}
        </div>
      </div>
    </div>
  )
}
