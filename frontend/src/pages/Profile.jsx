import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Picture from '../components/profile/Picture'
import Bio from '../components/profile/Bio'
import Post from '../components/posts/Post'

import { useGetUserPosts } from '../hooks/posts'
import { useHttpClient } from '../hooks/httpRequest'

function Profile() {
  const { username } = useParams()
  const { sendRequest } = useHttpClient()

  const [user, setUser] = useState(null)
  const [isMe, setIsMe] = useState(false)

  const { posts, fetchPosts } = useGetUserPosts(username)

  useEffect(() => {
    fetchPosts(username)
  }, [username])

  const fetchUser = useCallback(async () => {
    try {
      const response = await sendRequest(`/user?username=${username}`)
      if (response.user) {
        console.log(response)
        setUser(response.user)
        setIsMe(response.isMe)
      }
    } catch (error) {
      console.log(error)
    }
  }, [username])

  useEffect(() => {
    fetchUser()
  }, [username])

  return (
    <div className='w-full md:w-4/5 h-fit bg-rewind-dark-primary '>
      <div className=' flex flex-col md:flex-row md:justify-evenly p-4 pb-6 border-b border-rewind-dark-tertiary'>
        <Picture user={user} />
        <Bio user={user} isMe={isMe} />
      </div>
      <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
        Posts ⇣
      </div>
      {posts.map((post, index) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Profile
