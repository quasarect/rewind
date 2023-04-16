import React from 'react'
import { createPortal } from 'react-dom'

function Modal({
  title = '',
  onClose = () => {},
  children,
  onOk = () => {},
  showActions = true,
}) {
  const modal = document.getElementById('modal')

  return createPortal(
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-70 flex overflow-hidden z-50`}
    >
      <div className='w-full h-full flex justify-center items-center z-[10]'>
        <div
          className={
            'bg-rewind-dark-primary w-full  md:w-2/3 lg:w-3/5 h-3/5 rounded-lg flex flex-col justify-between overflow-auto z-[100] '
          }
        >
          <div className='w-full flex h-fit px-4 py-3 justify-between items-center '>
            <h1 className='text-lg font-semibold font-lato text-gray-300 '>
              {title}
            </h1>
            <button
              className='text-3xl text-gray-400 h-fit hover:text-gray-500'
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <div className='w-full h-full px-6 text-white'>{children}</div>
          {showActions && (
            <div className='w-full flex h-fit sticky bottom-0 px-4 py-2 justify-end items-center '>
              <button
                className='text-md font-semibold font-manrope text-rewind-dark-primary mr-4 border bg-gray-300 rounded-md px-4 py-2 mb-4
              hover:bg-rewind-dark-tertiary hover:text-gray-300 hover:border-rewind-dark-secondary transition-all
              '
                onClick={onOk}
              >
                Got it!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    modal
  )
}

export default Modal
