import { useContext } from 'react'

import Title from '../components/home/Title'
import CreatePost from '../components/home/CreatePost'
import Post from '../components/posts/Post'

import { useGetPosts } from '../hooks/posts'

import { useRedirectNotAuthenticated } from '../hooks/redirectNotAuthenticated'

import { authContext } from '../store/authContext'

export default function Home() {
  useRedirectNotAuthenticated()

  const { user } = useContext(authContext)

  const { posts, fetchPosts } = useGetPosts()

  return (
    <main className='w-full md:w-4/5 lg:w-2/5 bg-rewind-dark-primary'>
      <Title />
      <CreatePost fetchPosts={fetchPosts} profileUrl={user?.profileUrl} />
      {posts.map((post, index) => (
        <Post key={post._id} post={post} />
      ))}
    </main>
  )
}
