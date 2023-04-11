import React, { useEffect, useState } from 'react'

export default function Modal({ children, open, onClose, className }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 ${
        isOpen ? 'flex' : 'hidden'
      }`}
    >
      <div className='w-full h-full flex justify-center items-center'>
        <div
          className={
            'bg-white w-11/12 md:w-1/3 h-3/5 rounded-lg flex flex-col justify-between ' +
            className
          }
        >
          <div className='w-full flex justify-end pr-2'>
            <button
              className='text-3xl text-gray-400 hover:text-gray-500'
              onClick={handleClose}
            >
              &times;
            </button>
          </div>
          <div className='w-full h-full'>{children}</div>
        </div>
      </div>
    </div>
  )
}
