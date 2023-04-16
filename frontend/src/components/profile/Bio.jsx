import { useState, useEffect } from 'react'

import Edit from './Edit'

import { useHttpClient } from '../../hooks/httpRequest'

function Bio({ user, isMe, refresh }) {
  const joinedYear = new Date(user?.createdAt).getFullYear()

  const [isFollower, setIsFollower] = useState(user?.followers?._id)
  const [followerCount, setFollowerCount] = useState(user?.followerCount)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setIsFollower(user?.followers?._id)
    setFollowerCount(user?.followerCount)
  }, [user])

  const { sendRequest } = useHttpClient()

  const followHandler = async follow => {
    if (follow) {
      try {
        const res = await sendRequest('/user/follow?id=' + user._id)
        setIsFollower(true)
        setFollowerCount(f => f + 1)
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        const res = await sendRequest('/user/unfollow?id=' + user._id)
        setIsFollower(false)
        setFollowerCount(f => f - 1)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const followUnfollow = isFollower ? (
    <button
      className='ml-6 border h-fit border-rewind-dark-tertiary px-3 py-2 max-h-auto rounded font-manrope text-sm inline-block'
      onClick={() => followHandler(false)}
    >
      following
    </button>
  ) : (
    <button
      className='ml-6 border h-fit border-rewind-dark-tertiary px-3 py-2 max-h-auto rounded font-manrope text-sm inline-block'
      onClick={() => followHandler(true)}
    >
      follow
    </button>
  )

  return (
    <>
      <div className='ml-8 mt-8 md:m-0 md:mt-4 md:w-2/3 '>
        <div className='text-xl font-bold font-roboto flex flex-wrap '>
          <div>
            {user?.name}{' '}
            {/* {user?.following && (
              <span className='text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded'>
                follows you
              </span>
            )} */}
            <div className='text-sm text-gray-300 font-manrope'>
              @{user?.username}
            </div>
          </div>
          {isMe ? (
            <button
              className='ml-6 border h-fit border-rewind-dark-tertiary px-3 py-2 max-h-auto rounded font-manrope text-sm inline-block cursor-pointer'
              onClick={() => setEditing(true)}
            >
              edit
            </button>
          ) : (
            followUnfollow
          )}
        </div>
        <div className='mt-2 font-manrope text-sm flex'>
          <div className='mr-3'>
            <span className='font-bold'>{followerCount}</span> followers
          </div>
          <div>
            <span className='font-bold'>{user?.followingCount}</span> following
          </div>
        </div>
        <div className='mt-2 font-poppins text-md '>{user?.bio}</div>
        <div className='text-gray-500 italic font-manrope text-sm mt-2'>
          {user?.ai}
        </div>
        <div className='mt-2 text-sm font-manrope'>Joined {joinedYear}</div>
      </div>
      {editing && (
        <Edit user={user} setEditing={setEditing} refresh={refresh} />
      )}
    </>
  )
}

export default Bio
