import React from 'react'

import DedicateCard from './DedicateCard'
import VideoPlayer from './VideoPlayer'
import AudioPlayer from './AudioPlayer'

function PostBody({ post }) {
  const fileType = post?.filepath ? post?.filepath.split('/')[0] : null

  return (
    <>
      <div className='mt-4'>
        <p className='text-poppins text-gray-200 text-lg'>{post?.text}</p>
        {fileType === 'images' && (
          <div className='w-full max-h-80 bg-rewind-dark-primary flex items-center justify-center'>
            <img
              src={
                import.meta.env.VITE_API_ENDPOINT + '/media/' + post?.filepath
              }
              alt='post'
              className='max-h-80 rounded w-fit'
            />
          </div>
        )}
        {fileType === 'videos' && (
          <div className='w-full h-full bg-rewind-dark-primary flex items-center justify-center video-player px-4 py-2'>
            <VideoPlayer
              src={
                import.meta.env.VITE_API_ENDPOINT + '/media/' + post?.filepath
              }
            />
          </div>
        )}
        {fileType === 'audios' && (
          <div className='w-full h-full bg-rewind-dark-primary flex items-center justify-center video-player px-4 py-2'>
            <AudioPlayer
              src={
                import.meta.env.VITE_API_ENDPOINT + '/media/' + post?.filepath
              }
              user={post?.user}
            />
          </div>
        )}
        {post?.dedicated && <DedicateCard dedicated={post?.dedicated} />}
      </div>
    </>
  )
}

export default PostBody
