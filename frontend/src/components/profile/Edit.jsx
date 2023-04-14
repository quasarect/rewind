import React from 'react'

function Edit({ user, setEditing }) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex`}
    >
      <div className='w-full h-full flex justify-center items-center z-10'>
        <div
          className={
            'bg-white w-full mx-4 md:mx-0 md:w-2/3 lg:w-3/5 h-3/5 rounded-lg flex flex-col justify-between '
          }
        >
          <div className='w-full flex justify-end pr-2'>
            <button
              className='text-3xl text-gray-400 hover:text-gray-500'
              onClick={() => setEditing(false)}
            >
              &times;
            </button>
          </div>
          <div className='w-full h-full'>lmao</div>
        </div>
      </div>
    </div>
  )
}

export default Edit
