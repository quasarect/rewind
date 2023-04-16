import Dedicate from './Dedicate'
import CrossSVG from '../assets/cross.svg'
import VideoPlayer from '../posts/VideoPlayer'

export function Body({
  image,
  imageRef,
  setImage,
  video,
  videoRef,
  setVideo,
  setAudio,
  audio,
  audioRef,
  isDedicated,
  setIsDedicated,
  dedicate,
  setDedicate,
}) {
  return (
    <div className='flex  items-center justify-center flex-col'>
      {image?.data && (
        <div className='w-fit max-w-full max-h-80 bg-rewind-dark-primary relative '>
          <span
            className='absolute top-1 right-2 text-2xl text-white cursor-pointer bg-gray-800 rounded-full p-1'
            onClick={() => {
              setImage(null)
              imageRef.current.value = null
            }}
          >
            <img src={CrossSVG} alt='cross' />
          </span>
          <img src={image?.data} alt='post' className='max-h-80 rounded-lg' />
        </div>
      )}

      {video?.data && (
        <div className=' bg-rewind-dark-primary relative'>
          <span
            className='absolute top-1 right-2 text-2xl text-white cursor-pointer bg-gray-800 rounded-full p-1 z-50'
            onClick={() => {
              setVideo(null)
              videoRef.current.value = null
            }}
          >
            <img src={CrossSVG} alt='cross' />
          </span>
          <VideoPlayer src={video?.data} />
        </div>
      )}

      {audio?.data && (
        <div className=' bg-rewind-dark-primary relative px-16'>
          <span
            className='absolute top-1 right-2 text-2xl text-white cursor-pointer bg-gray-800 rounded-full p-1 z-50'
            onClick={() => {
              setAudio(null)
              audioRef.current.value = null
            }}
          >
            <img src={CrossSVG} alt='cross' />
          </span>
          <audio controls src={audio?.data} />
        </div>
      )}

      {isDedicated && (
        <Dedicate
          dedicate={dedicate}
          setDedicate={setDedicate}
          setIsDedicated={setIsDedicated}
        />
      )}
    </div>
  )
}
