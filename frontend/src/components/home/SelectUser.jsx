import React, { useState } from 'react'

import { useHttpClient } from '../../hooks/httpRequest'

export default function SelectUser({ setIsSelectingUser, setUser }) {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const { sendRequest, isLoading } = useHttpClient()

  const searchUsers = async e => {
    try {
      const res = await sendRequest('/search/global?text=' + e.target.value)
      setUsers(res?.users)
      setError(null)
      console.log(res)
    } catch (err) {
      setUsers([])
      setError(err.message)
      console.log(err)
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex overflow-hidden z-50`}
    >
      <div className='w-full h-full flex justify-center items-center z-[10]'>
        <div
          className={
            'bg-white w-full mx-4 md:mx-0 md:w-2/3 lg:w-3/5 h-3/5 rounded-lg flex flex-col justify-between overflow-auto z-[100]'
          }
        >
          <div className='w-full flex h-fit px-4 py-2 justify-between items-center border-b pb-3 border-gray-400'>
            <h1 className='text-lg font-semibold font-lato text-gray-700 '>
              Select a User
            </h1>
            <button
              className='text-3xl text-gray-400 h-fit hover:text-gray-500'
              onClick={() => setIsSelectingUser(false)}
            >
              &times;
            </button>
          </div>
          <div className='w-full h-full px-6 py-4 text-black'>
            <div>
              <input
                type='text'
                className='w-full h-10 px-2 border border-gray-400 rounded-lg focus:outline-none focus:border-gray-500 mt-2'
                placeholder='Search for a user'
                onInput={e => searchUsers(e)}
              />
            </div>
            {isLoading && 'loading..'}
            {error && error}
            {!isLoading &&
              users.map(user => (
                <div className='mt-6' key={user?._id}>
                  <div
                    className='
                flex items-center justify-start border-b border-gray-300 py-2 pb-4 cursor-pointer
                '
                    onClick={() => {
                      setUser(user)
                      setIsSelectingUser(false)
                    }}
                  >
                    <img
                      src={user?.profileUrl}
                      alt='song'
                      className='w-12 h-12 rounded-lg'
                    />
                    <div className='ml-4'>
                      <h1 className='text-lg font-semibold font-lato text-gray-700 '>
                        {user?.name}
                      </h1>
                      <h1 className='text-sm font-lato text-gray-400 '>
                        {user?.username}
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
