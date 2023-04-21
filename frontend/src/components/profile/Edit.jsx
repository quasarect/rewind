import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { useHttpClient } from '../../hooks/httpRequest'

import { authContext } from '../../store/authContext'

function Edit({ user, setEditing, refresh }) {
  const [name, setName] = useState(user?.name)
  const [username, setUsername] = useState(user?.username)
  const [usernameValid, setUsernameValid] = useState(true)
  const [bio, setBio] = useState(user?.bio)

  const { sendRequest: sendUsernameValidityReq } = useHttpClient()
  const { sendRequest: sendEditReq, error } = useHttpClient()

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const { fetchMe } = useContext(authContext)

  const usernameChangeHandler = async (e) => {
    if (e.target.value.length < 5) {
      setUsernameValid(false)
      return
    }

    try {
      await sendUsernameValidityReq(`/user/username?username=${e.target.value}`)
      setUsernameValid(true)
    } catch (err) {
      console.log(err)
      setUsernameValid(false)
    }
  }

  const editHandler = async () => {
    setIsLoading(true)

    try {
      let tagline = await fetch(import.meta.env.VITE_AI_ENDPOINT + '/tagline', {
        headers: {
          Authorization: 'Bearer ' + user?._id,
        },
      })

      tagline = await tagline.json()
      await sendEditReq(
        `/user/update`,
        'POST',
        JSON.stringify({
          name,
          username,
          bio,
          tagline: tagline.tagline,
        }),
        {
          'Content-Type': 'application/json',
        }
      )
      setEditing(false)
      if (user?.username !== username) {
        navigate(`/${username}`)
      } else {
        refresh(username)
      }
      setIsLoading(false)
      fetchMe()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex`}
    >
      <div className="w-full h-full flex justify-center items-center z-10 ">
        <div
          className={
            'bg-white w-full mx-4 md:mx-0 md:w-2/3 lg:w-3/5 h-3/5 rounded-lg flex flex-col justify-between overflow-auto'
          }
        >
          <div className="w-full flex h-fit px-4 py-2 justify-between items-center border-b pb-3 border-gray-400">
            <h1 className="text-lg font-semibold font-lato text-gray-700 ">
              Edit Profile
            </h1>
            <button
              className="text-3xl text-gray-400 h-fit hover:text-gray-500"
              onClick={() => setEditing(false)}
            >
              &times;
            </button>
          </div>
          <div className="w-full h-full px-6 py-4 text-black">
            <div>
              <label className="text-md font-ubuntu font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-full h-10 px-2 border border-gray-400 rounded-lg focus:outline-none focus:border-gray-500 mt-2"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <label className="text-md font-ubuntu font-semibold text-gray-700">
                Username
              </label>
              <input
                type="text"
                className={`w-full h-10 px-2 border-2 border-gray-400 rounded-lg focus:outline-none  mt-2 ${
                  usernameValid ? 'border-green-500' : 'border-red-500'
                }`}
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.trim())
                }}
                onInput={(e) => usernameChangeHandler(e)}
              />
            </div>
            <div className="mt-6">
              <label className="text-md font-ubuntu font-semibold text-gray-700">
                Bio
              </label>
              <input
                type="text"
                className="w-full h-10 px-2 border border-gray-400 rounded-lg focus:outline-none focus:border-gray-500 mt-2"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <button
                className="px-4 py-2 h-10 bg-rewind-dark-tertiary text-white rounded-lg font-manrope text-md hover:bg-white hover:text-black border border-rewind-dark-tertiary transition-colors"
                onClick={editHandler}
              >
                {isLoading ? '...' : 'Save'}
              </button>
            </div>
            {error && <div className="mt-3 text-red-500">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Edit
