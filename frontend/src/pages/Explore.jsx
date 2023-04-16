import { useState } from 'react'

import { useRedirectNotAuthenticated } from '../hooks/redirectNotAuthenticated'
import { useHttpClient } from '../hooks/httpRequest'

import Post from '../components/posts/Post'
import User from '../components/explore/User'

export default function Home() {
  useRedirectNotAuthenticated()

  const { sendRequest, isLoading, error } = useHttpClient()

  const [serachInitiated, setSearchInitiated] = useState(false)

  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])

  let timerId = null

  const handleSearch = async e => {
    setSearchInitiated(true)

    const { value } = e.target

    try {
      const { users, posts } = await sendRequest('/search/global?text=' + value)
      setUsers(users)
      setPosts(posts)
    } catch (err) {
      console.log(err)
    }
  }

  console.log(posts, users)

  return (
    <main className='w-full md:w-4/5 lg:w-2/5 bg-rewind-dark-primary'>
      <div className='p-4 text-poppins text-gray-200 text-xl border-b border-rewind-dark-tertiary'>
        Explore Rewind
      </div>
      <div>
        <div className='p-4'>
          <input
            type='text'
            className='
            w-full  bg-rewind-dark-primary text-poppins text-gray-200 text-md border border-rewind-dark-tertiary rounded-md p-2
          '
            placeholder='Search for people, posts and more'
            onChange={e => {
              clearTimeout(timerId)
              timerId = setTimeout(() => {
                handleSearch(e)
              }, 500)
            }}
          />
        </div>
      </div>
      {isLoading && (
        <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
          Loading...
        </div>
      )}
      {!isLoading && users.length > 0 && (
        <>
          <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
            Users ⇣
          </div>
          {users.map(user => {
            return <User user={user} key={user?._id} />
          })}
        </>
      )}

      {!isLoading && posts.length > 0 && (
        <>
          <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
            Posts ⇣
          </div>
          {posts.map(post => {
            return <Post post={post} key={post?._id} />
          })}
        </>
      )}
      {posts.length === 0 &&
        users.length === 0 &&
        !isLoading &&
        serachInitiated && (
          <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
            No results found
          </div>
        )}
      {!serachInitiated && (
        <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
          Search for people, posts and more
        </div>
      )}
    </main>
  )
}
