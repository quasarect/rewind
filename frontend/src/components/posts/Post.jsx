import { useState, useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceStrict } from 'date-fns'

import CommentSVG from './icons/comment.svg'
import ReshareSVG from './icons/reshare.svg'
import LikeSVG from './icons/like.svg'
import LikedSVG from './icons/liked.svg'
import MenuSVG from './icons/menu.svg'

import { useHttpClient } from '../../hooks/httpRequest'

import { authContext } from '../../store/authContext'

import PostBody from './PostBody'
import CreatePost from '../home/CreatePost'

export default function Post({
  post,
  refreshPosts = () => {},
  redirect = true,
  onComment = () => {},
}) {
  if (post === null) return ''

  const { user } = useContext(authContext)

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likeCount)
  const [isMe, setIsMe] = useState(post?.user?._id === user?._id)

  const [isCommenting, setIsCommenting] = useState(false)

  let time = ''

  try {
    const timestamp = post?.createdAt
      ? new Date(post?.createdAt)
      : new Date(post?.updatedAt)

    time = formatDistanceStrict(timestamp, new Date(), {})

    time =
      time.replace(' ' + time.split(' ')[1], time.split(' ')[1].charAt(0)) +
      ' ago'
  } catch (err) {}

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { sendRequest } = useHttpClient()

  useEffect(() => {
    if (post?.likedBy?._id?.length > 0) {
      setLiked(true)
    }
  }, [user])

  const likeHandler = async (liked) => {
    if (liked) {
      try {
        const response = await sendRequest('/posts/like?id=' + post?._id)
        setLiked(true)
        setLikeCount((likeCount) => likeCount + 1)
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        const response = await sendRequest('/posts/unlike?id=' + post?._id)
        setLiked(false)
        setLikeCount((likeCount) => likeCount - 1)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const menuRef = useRef(null)

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const response = await sendRequest('/posts/' + post?._id, 'DELETE')
      refreshPosts(post?.user?.username)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="p-4 border-b bg-rewind-dark-primary border-rewind-dark-tertiary">
      <div className="flex items-center cursor-pointer justify-between">
        <Link to={'/' + post?.user?.username} className="flex">
          <img
            src={post?.user?.profileUrl}
            alt="Profile Picture"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-poppins text-gray-200 font-bold text-base flex items-baseline">
              {post?.user?.name}
              <span
                className="
              text-poppins font-normal inline-block text-gray-400 text-xs ml-2
              "
              >
                • {time}
              </span>
            </h1>
            <p className="text-poppins text-gray-400 text-xs">
              {post?.user?.username}
            </p>
          </div>
        </Link>
        <div className="relative">
          <img
            src={MenuSVG}
            alt="menu"
            className="h-4 hover:scale-110 cursor-pointer text-white"
            onClick={handleMenuClick}
          />
          {isMenuOpen && (
            <div
              className="absolute right-0 top-0 mt-4 mr-4 bg-rewind-dark-primary border border-rewind-dark-tertiary rounded-md"
              ref={menuRef}
            >
              {!isMe && (
                <div className="p-2 px-4 border-b border-rewind-dark-tertiary">
                  Report{' '}
                </div>
              )}
              {isMe && (
                <div className="p-2 px-4 ">
                  <p
                    className="text-poppins text-red-500 text-sm"
                    onClick={handleDelete}
                  >
                    Delete
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <PostBody post={post} redirect={redirect} />
      <div className="mt-6 flex items-center justify-around px-4 text-white">
        <div className="flex items-center justify-center">
          <img
            src={CommentSVG}
            className="h-4 hover:scale-110 cursor-pointer mr-2"
            onClick={() => {
              setIsCommenting(!isCommenting)
            }}
          />
          {post?.commentCount}
        </div>
        <div className="flex items-center justify-center">
          <img
            src={ReshareSVG}
            className="h-4 hover:scale-110 cursor-pointer mr-2"
          />
        </div>
        <div className="flex items-center justify-center">
          {liked ? (
            <img
              src={LikedSVG}
              className="h-4 hover:scale-110 cursor-pointer mr-2"
              onClick={() => likeHandler(false)}
            />
          ) : (
            <img
              src={LikeSVG}
              className="h-4 hover:scale-110 cursor-pointer mr-2"
              onClick={() => likeHandler(true)}
            />
          )}

          {likeCount}
        </div>
      </div>
      {isCommenting && (
        <div className="mt-4">
          <CreatePost
            fetchPosts={onComment}
            profileUrl={user?.profileUrl}
            replyTo={post?._id}
          />
        </div>
      )}
    </div>
  )
}
