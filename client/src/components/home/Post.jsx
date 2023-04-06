import { useState } from 'react'

import CommentSVG from './icons/comment.svg'
import ReshareSVG from './icons/reshare.svg'
import LikeSVG from './icons/like.svg'
import LikedSVG from './icons/liked.svg'

export default function Post({ post }) {
  const [liked, setLiked] = useState(true)

  return (
    <div className='p-4 border-b border-rewind-dark-tertiary'>
      <div className='flex items-center'>
        <img
          src={post.user.profilePicture}
          alt='Profile Picture'
          className='w-10 h-10 rounded-full'
        />
        <div className='ml-4'>
          <h1 className='text-poppins text-gray-200 font-bold text-base'>
            {post.user.name}
          </h1>
          <p className='text-poppins text-gray-400 text-xs'>
            {post.user.username}
          </p>
        </div>
      </div>
      <div className='mt-4'>
        <p className='text-poppins text-gray-200 text-md'>{post.text}</p>
      </div>
      <div className='mt-6 flex items-center justify-between px-4'>
        <CommentSVG className='h-4 hover:scale-110 cursor-pointer' />
        <ReshareSVG className='h-4 hover:scale-110 cursor-pointer' />
        {liked ? (
          <LikeSVG
            className='h-4 hover:scale-110 cursor-pointer '
            onClick={() => setLiked(!liked)}
          />
        ) : (
          <LikedSVG
            className='h-4 hover:scale-110 cursor-pointer'
            onClick={() => setLiked(!liked)}
          />
        )}
      </div>
    </div>
  )
}
