import { useState, useRef } from 'react'

import { useHttpClient } from '../../hooks/httpRequest'

import { Body } from './Body'

import {
  DedicateButtonUI,
  UploadImage,
  UploadVideo,
  UploadAudio,
} from './Buttons'

export default function CreatePost({ fetchPosts, profileUrl }) {
  const postRef = useRef(null)

  const [post, setPost] = useState('')

  const imageRef = useRef(null)
  const [image, setImage] = useState(null)

  const videoRef = useRef(null)
  const [video, setVideo] = useState(null)

  const audioRef = useRef(null)
  const [audio, setAudio] = useState(null)

  const [isDedicated, setIsDedicated] = useState(false)
  const [dedicate, setDedicate] = useState(null)

  const { isLoading, error, sendRequest } = useHttpClient()

  const resize = () => {
    postRef.current.style.height = 'auto'
    postRef.current.style.height = `${postRef.current.scrollHeight}px`
  }

  const reset = () => {
    setPost('')

    setImage(null)
    if (imageRef.current) {
      imageRef.current.value = null
    }

    setVideo(null)
    if (videoRef.current) {
      videoRef.current.value = null
    }

    setAudio(null)
    if (audioRef.current) {
      audioRef.current.value = null
    }

    setIsDedicated(false)
    setDedicate(null)
  }

  const postHandler = async () => {
    if (post.length === 0 && !isDedicated && !image && !video && !audio) return
    var body = new FormData()
    body.append('text', post)
    body.append('dedicated', JSON.stringify(dedicate))
    if (image) body.append('file', image.file, image.name)
    else if (video) body.append('file', video.file, video.name)
    else if (audio) body.append('file', audio.file, audio.name)

    try {
      const response = await sendRequest('/posts/create', 'POST', body, {})

      console.log(response)
      fetchPosts()
      reset()
    } catch (err) {
      alert(err.message || 'Something went wrong, please try again later.')
      console.log(err)
    }
  }

  return (
    <div className='py-2 px-4 border-b border-rewind-dark-tertiary w-full'>
      <div className='flex justify-between py-4'>
        <img
          src={profileUrl}
          alt='profile'
          className='rounded-full h-10 w-10 object-cover'
        />
        <div className='flex-1 ml-2 w-full'>
          <textarea
            type='text'
            className='border-0 outline-none bg-transparent text-white text-lg px-2 w-full resize-none py-1 min-h-10  overflow-hidden'
            placeholder='What is on your mind?'
            value={post}
            ref={postRef}
            onChange={e => {
              setPost(e.target.value.substring(0, 250))
              resize()
            }}
          />
        </div>
      </div>
      <Body
        image={image}
        imageRef={imageRef}
        setImage={setImage}
        video={video}
        videoRef={videoRef}
        setVideo={setVideo}
        audio={audio}
        audioRef={audioRef}
        setAudio={setAudio}
        isDedicated={isDedicated}
        setDedicate={setDedicate}
      />
      <div className='w-full flex justify-between items-center px-6 py-2 mt-3 '>
        <div className='flex'>
          <DedicateButtonUI
            setIsDedicated={setIsDedicated}
            isDedicated={isDedicated}
          />
          {!image?.data && !video?.data && !audio?.data && (
            <>
              <UploadAudio setAudio={setAudio} audioRef={audioRef} />
              <UploadVideo setVideo={setVideo} videoRef={videoRef} />
              <UploadImage setImage={setImage} imageRef={imageRef} />
            </>
          )}
        </div>
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
