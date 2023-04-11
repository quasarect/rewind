import Title from '../components/home/Title'
import CreatePost from '../components/home/CreatePost'
import Post from '../components/home/Post'

import posts from '../components/home/posts'

import { useRedirectNotAuthenticated } from '../hooks/redirectNotAuthenticated'

export default function Home() {
  useRedirectNotAuthenticated()

  return (
    <main className='w-full md:w-2/5 bg-rewind-dark-primary'>
      <Title />
      <CreatePost />
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </main>
  )
}
