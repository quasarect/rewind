import { useState } from 'react'

import { useHttpClient } from '../../hooks/httpRequest'

export default function CreatePost({ fetchPosts, profileUrl }) {
  const [post, setPost] = useState('')

  const { isLoading, error, sendRequest } = useHttpClient()

  const postHandler = async () => {
    if (post.length === 0) return

    try {
      const response = await sendRequest(
        '/posts/create',
        'POST',
        JSON.stringify({
          text: post,
        }),
        {
          'Content-Type': 'application/json',
        }
      )

      console.log(response)
      fetchPosts()
      setPost('')
    } catch (err) {
      alert(err.message || 'Something went wrong, please try again later.')
    }
  }

  return (
    <div className='py-2 px-4 border-b border-rewind-dark-tertiary'>
      <div className='flex justify-between py-4'>
        <img
          src={profileUrl}
          alt='profile'
          className='rounded-full h-10 w-10 object-cover'
        />
        <div className='flex-1 ml-2 w-full'>
          <textarea
            type='text'
            className='border-0 outline-none bg-transparent text-white text-lg px-2 w-full resize-none py-1 h-10'
            placeholder='What is on your mind?'
            value={post}
            onChange={e => setPost(e.target.value)}
          />
        </div>
      </div>
      <div className='w-full flex justify-end items-center px-6 py-2'>
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
