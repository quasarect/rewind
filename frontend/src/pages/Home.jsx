import { useState, useEffect, useCallback } from 'react'
import Title from '../components/home/Title'
import CreatePost from '../components/home/CreatePost'
import Post from '../components/home/Post'

import { useHttpClient } from '../hooks/httpRequest'

import { useRedirectNotAuthenticated } from '../hooks/redirectNotAuthenticated'

export default function Home() {
  useRedirectNotAuthenticated()

  const [posts, setPosts] = useState([])

  const { sendRequest, isLoading, error } = useHttpClient()

  const fetchPosts = useCallback(async () => {
    try {
      const responseData = await sendRequest('/posts/all')
      if (responseData.posts) {
        const sortedPosts = responseData.posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setPosts(sortedPosts)
        console.log(sortedPosts)
      }
    } catch (err) {
      console.log(err)
      // alert(err.message)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <main className='w-full md:w-4/5 lg:w-2/5 bg-rewind-dark-primary'>
      <Title />
      <CreatePost fetchPosts={fetchPosts} />
      {posts.map((post, index) => (
        <Post key={post._id} post={post} />
      ))}
    </main>
  )
}
