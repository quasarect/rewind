import Title from './Title'
import CreatePost from './CreatePost'
import Post from './Post'

import posts from './posts'

export default function Home() {
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
