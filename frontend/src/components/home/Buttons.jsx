import DedicateSVG from './icons/dedicate.svg'
import ImageSVG from './icons/image.svg'
import VideoSVG from './icons/video.svg'
import AudioSVG from './icons/audio.svg'

export function DedicateButtonUI({ setIsDedicated, isDedicated }) {
  return isDedicated ? (
    <div
      className='border w-fit h-fit border-white px-2 font-manrope rounded-full cursor-pointer'
      onClick={() => setIsDedicated(false)}
    >
      <img src={DedicateSVG} alt='dedicate' className='h-6 w-6 inline-block ' />
    </div>
  ) : (
    <div
      className='border w-fit h-fit border-rewind-dark-tertiary px-2 font-manrope rounded-full cursor-pointer'
      onClick={() => setIsDedicated(true)}
    >
      <img src={DedicateSVG} alt='dedicate' className='h-6 w-6 inline-block ' />
    </div>
  )
}

export function UploadImage({ setImage, imageRef }) {
  const fileHandler = e => {
    const name = e.target.value.split('\\').pop()
    setImage({
      file: e.target.files[0],
      data: URL.createObjectURL(e.target.files[0]),
      name,
    })
  }

  return (
    <form
      className={
        'border w-fit h-fit border-rewind-dark-tertiary px-2 font-manrope rounded-full cursor-pointer flex items-center ml-2 '
      }
    >
      <label htmlFor='image-file'>
        <img
          src={ImageSVG}
          alt='image'
          className='h-6 w-6 inline-block cursor-pointer'
        />
      </label>
      <input
        type='file'
        id='image-file'
        className='hidden'
        ref={imageRef}
        onChange={fileHandler}
        accept='image/*'
      />
    </form>
  )
}

export function UploadVideo({ setVideo, videoRef }) {
  const fileHandler = e => {
    const name = e.target.value.split('\\').pop()
    setVideo({
      file: e.target.files[0],
      data: URL.createObjectURL(e.target.files[0]),
      name,
    })
  }

  return (
    <form
      className={
        'border w-fit h-fit border-rewind-dark-tertiary px-2 font-manrope rounded-full cursor-pointer flex items-center ml-2 '
      }
    >
      <label htmlFor='video-file'>
        <img
          src={VideoSVG}
          alt='video'
          className='h-6 w-6 inline-block cursor-pointer'
        />
      </label>
      <input
        type='file'
        id='video-file'
        className='hidden'
        ref={videoRef}
        onChange={fileHandler}
        accept='video/*'
      />
    </form>
  )
}

export function UploadAudio({ setAudio, audioRef }) {
  const fileHandler = e => {
    const name = e.target.value.split('\\').pop()
    setAudio({
      file: e.target.files[0],
      data: URL.createObjectURL(e.target.files[0]),
      name,
    })
  }

  return (
    <form
      className={
        'border w-fit h-fit border-rewind-dark-tertiary px-2 font-manrope rounded-full cursor-pointer flex items-center ml-2 '
      }
    >
      <label htmlFor='audio-file'>
        <img
          src={AudioSVG}
          alt='video'
          className='h-6 w-6 inline-block cursor-pointer'
        />
      </label>
      <input
        type='file'
        id='audio-file'
        className='hidden'
        ref={audioRef}
        onChange={fileHandler}
        accept='audio/*'
      />
    </form>
  )
}
