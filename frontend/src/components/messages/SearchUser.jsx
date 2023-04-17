import React, { useState } from 'react'

import Modal from '../utils/Modal'
import User from './User'
import { useHttpClient } from '../../hooks/httpRequest'

function SearchUser({ onClose }) {
  const { sendRequest, isLoading, error } = useHttpClient()

  const [serachInitiated, setSearchInitiated] = useState(false)

  const [users, setUsers] = useState([])

  let timerId = null

  const handleSearch = async e => {
    setSearchInitiated(true)

    const { value } = e.target

    try {
      const { users } = await sendRequest('/search/global?text=' + value)
      setUsers(users)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal onClose={onClose} title='Search User' showActions={false}>
      <input
        type='text'
        placeholder='Search User'
        className='
        w-full  bg-rewind-dark-primary text-poppins text-gray-200 text-md border border-rewind-dark-tertiary rounded-md p-2
      '
        onChange={e => {
          clearTimeout(timerId)
          timerId = setTimeout(() => {
            handleSearch(e)
          }, 500)
        }}
      />
      {isLoading && (
        <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
          Loading...
        </div>
      )}
      {!isLoading && users.length > 0 && (
        <>
          {/* <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
            Users ⇣
          </div> */}
          {users.map(user => {
            return (
              <User
                user={user}
                key={user?._id}
                select={userId => {
                  onClose(userId)
                }}
              />
            )
          })}
          {!serachInitiated && (
            <div className='p-4 text-poppins text-gray-200 text-xl  border-rewind-dark-tertiary'>
              Start typing to search..
            </div>
          )}
        </>
      )}
    </Modal>
  )
}

export default SearchUser
