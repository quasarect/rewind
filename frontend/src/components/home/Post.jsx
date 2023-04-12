import { useState } from 'react'

import CommentSVG from './icons/comment.svg'
import ReshareSVG from './icons/reshare.svg'
import LikeSVG from './icons/like.svg'
import LikedSVG from './icons/liked.svg'

export default function Post({ post }) {
  console.log(post)

  const [liked, setLiked] = useState(true)

  return (
    <div className='p-4 border-b bg-rewind-dark-primary border-rewind-dark-tertiary'>
      <div className='flex items-center'>
        <img
          src={null}
          alt='Profile Picture'
          className='w-10 h-10 rounded-full'
        />
        <div className='ml-4'>
          <h1 className='text-poppins text-gray-200 font-bold text-base'>
            {post?.user?.name}
          </h1>
          <p className='text-poppins text-gray-400 text-xs'>
            {post?.user?.username}
          </p>
        </div>
      </div>
      <div className='mt-4'>
        <p className='text-poppins text-gray-200 text-md'>{post?.text}</p>
      </div>
      <div className='mt-6 flex items-center justify-around px-4 text-white'>
        <div className='flex items-center justify-center'>
          <img
            src={CommentSVG}
            className='h-4 hover:scale-110 cursor-pointer mr-2'
          />
          {post?.commentCount}
        </div>
        <div className='flex items-center justify-center'>
          <img
            src={ReshareSVG}
            className='h-4 hover:scale-110 cursor-pointer mr-2'
          />
        </div>
        <div className='flex items-center justify-center'>
          {liked ? (
            <img
              src={LikeSVG}
              className='h-4 hover:scale-110 cursor-pointer mr-2'
              onClick={() => setLiked(!liked)}
            />
          ) : (
            <img
              src={LikedSVG}
              className='h-4 hover:scale-110 cursor-pointer mr-2'
              onClick={() => setLiked(!liked)}
            />
          )}
          {post?.likeCount}
        </div>
      </div>
    </div>
  )
}
