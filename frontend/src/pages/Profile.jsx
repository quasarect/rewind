import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Picture from '../components/profile/Picture'
import Bio from '../components/profile/Bio'
import Post from '../components/posts/Post'

import { useGetUserPosts } from '../hooks/posts'
import { useHttpClient } from '../hooks/httpRequest'

function Profile() {
  const { username } = useParams()
  const { sendRequest, isLoading } = useHttpClient()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [topTrack, setTopTrack] = useState(null)
  const [isMe, setIsMe] = useState(false)

  const { posts, fetchPosts } = useGetUserPosts(username)

  const fetchUser = useCallback(
    async (username) => {
      try {
        const response = await sendRequest(`/user?username=${username}`)
        if (response.user) {
          setUser(response.user)
          setTopTrack(response.topTrack)
          setIsMe(response.isMe)
        } else {
          navigate('/404')
        }
      } catch (error) {
        console.log(error)
        navigate('/404')
      }
    },
    [username]
  )

  useEffect(() => {
    fetchUser(username)
    fetchPosts(username)
  }, [username])

  function refresh(username) {
    fetchUser(username)
    fetchPosts(username)
  }

  return (
    <div className="w-full md:w-4/5 h-fit bg-rewind-dark-primary ">
      <div className=" flex flex-col md:flex-row md:justify-evenly p-4 pb-6 border-b border-rewind-dark-tertiary">
        {isLoading ? (
          'loading..'
        ) : (
          <>
            <Picture user={user} topTrack={topTrack} />
            <Bio user={user} isMe={isMe} refresh={refresh} />
          </>
        )}
      </div>
      <div className="p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary">
        Posts ⇣
      </div>
      {posts.map((post, index) => (
        <Post key={post._id} post={post} refreshPosts={fetchPosts} />
      ))}
    </div>
  )
}

export default Profile
