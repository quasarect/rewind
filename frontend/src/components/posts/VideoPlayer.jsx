import { useRef, useEffect, useState } from 'react'
import PlaySVG from './icons/play.svg'
import PauseSVG from './icons/pause.svg'
import MutedSVG from './icons/muted.svg'
import UnmutedSVG from './icons/unmuted.svg'
import { useVideoPlayer } from '../../hooks/media'

export default function VideoPlayer({ src }) {
  const videoElement = useRef(null)
  const {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
  } = useVideoPlayer(videoElement)

  const [showControls, setShowControls] = useState(true)

  return (
    <div className='relative flex items-center justify-center w-full '>
      <video
        src={src}
        ref={videoElement}
        onTimeUpdate={handleOnTimeUpdate}
        className='w-full h-full rounded-xl'
      />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
        {playerState.isPlaying ? (
          <img
            src={PauseSVG}
            className='w-12 h-12 text-white cursor-pointer z-50'
            onClick={togglePlay}
          />
        ) : (
          <img
            src={PlaySVG}
            className='w-12 h-12 text-white cursor-pointer z-50'
            onClick={togglePlay}
          />
        )}
      </div>
      <div className='absolute bottom-4 left-4 rounded-full shadow-2xl'>
        {playerState.isMuted ? (
          <img
            src={MutedSVG}
            className='w-6 h-6 text-white cursor-pointer z-50'
            onClick={toggleMute}
          />
        ) : (
          <img
            src={UnmutedSVG}
            className='w-6 h-6 text-white cursor-pointer z-50'
            onClick={toggleMute}
          />
        )}
      </div>
    </div>
  )
}
