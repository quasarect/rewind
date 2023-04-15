import React from 'react'

import DedicateCard from './DedicateCard'

function PostBody({ post }) {
  return (
    <>
      <div className='mt-4'>
        <p className='text-poppins text-gray-200 text-lg'>{post?.text}</p>
        {post?.dedicated && <DedicateCard dedicated={post?.dedicated} />}
      </div>
    </>
  )
}

export default PostBody
