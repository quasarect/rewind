import { useState, useContext, useEffect } from 'react'

import CommentSVG from './icons/comment.svg'
import ReshareSVG from './icons/reshare.svg'
import LikeSVG from './icons/like.svg'
import LikedSVG from './icons/liked.svg'

import { useHttpClient } from '../../hooks/httpRequest'

import { authContext } from '../../store/authContext'

export default function Post({ post }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likeCount)
  const { sendRequest } = useHttpClient()
  const { userId } = useContext(authContext)

  useEffect(() => {
    if (post?.likedBy?._id?.length > 0) {
      setLiked(true)
    }
  }, [userId])

  const likeHandler = async liked => {
    if (liked) {
      try {
        const response = await sendRequest('/posts/like?id=' + post?._id)
        setLiked(true)
        setLikeCount(likeCount => likeCount + 1)
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        const response = await sendRequest('/posts/unlike?id=' + post?._id)
        setLiked(false)
        setLikeCount(likeCount => likeCount - 1)
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className='p-4 border-b bg-rewind-dark-primary border-rewind-dark-tertiary'>
      <div className='flex items-center'>
        <img
          src={post?.user?.profileUrl}
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
              src={LikedSVG}
              className='h-4 hover:scale-110 cursor-pointer mr-2'
              onClick={() => likeHandler(false)}
            />
          ) : (
            <img
              src={LikeSVG}
              className='h-4 hover:scale-110 cursor-pointer mr-2'
              onClick={() => likeHandler(true)}
            />
          )}
          {likeCount}
        </div>
      </div>
    </div>
  )
}
