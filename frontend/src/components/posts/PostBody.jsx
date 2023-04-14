import React from 'react'

import DedicateCard from './DedicateCard'

function PostBody({ post }) {
  return (
    <>
      <div className='mt-4'>
        <p className='text-poppins text-gray-200 text-lg'>{post?.text}</p>
        {post?.dedicate && <DedicateCard dedicate={post?.dedicate} />}
      </div>
    </>
  )
}

export default PostBody
