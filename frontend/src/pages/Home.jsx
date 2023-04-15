import { useContext } from 'react'

import CreatePost from '../components/home/CreatePost'
import Post from '../components/posts/Post'

import { useGetPosts } from '../hooks/posts'

import { useRedirectNotAuthenticated } from '../hooks/redirectNotAuthenticated'

import { authContext } from '../store/authContext'

export default function Home() {
  useRedirectNotAuthenticated()

  const { user } = useContext(authContext)

  const { posts, fetchPosts, isLoading } = useGetPosts()

  return (
    <main className='w-full md:w-4/5 lg:w-3/5 bg-rewind-dark-primary'>
      <div className='p-4 text-poppins text-gray-200 text-xl border-b border-rewind-dark-tertiary'>
        For you
      </div>
      <CreatePost fetchPosts={fetchPosts} profileUrl={user?.profileUrl} />
      {isLoading ? (
        <div className='w-full flex items-center justify-center mt-6'>
          Loading..
        </div>
      ) : (
        posts.map((post, index) => (
          <Post key={post._id} post={post} refreshPosts={fetchPosts} />
        ))
      )}
    </main>
  )
}
