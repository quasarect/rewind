export default function CreatePost() {
  return (
    <div className='py-2 px-4 border-b border-rewind-dark-tertiary'>
      <div className='flex justify-between py-4'>
        <img
          src='https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80'
          alt='profile'
          className='rounded-full h-10 w-10 object-cover'
        />
        <div className='flex-1 ml-2 w-full'>
          <textarea
            type='text'
            className='border-0 outline-none bg-transparent text-white text-lg px-2 w-full resize-none py-1 h-10'
            placeholder='What is on your mind?'
          />
        </div>
      </div>
      <div className='w-full flex justify-end items-center px-6 py-2'>
        <button className='px-4 py-1 text-lg text-white bg-rewind-dark-tertiary rounded-full text-poppins hover:bg-gray-200 hover:text-rewind-dark-primary transition-colors'>
          Post
        </button>
      </div>
    </div>
  )
}
