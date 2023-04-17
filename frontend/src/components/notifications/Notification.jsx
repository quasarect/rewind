import React, { useEffect } from 'react'

import { Link } from 'react-router-dom'

function Notification({ notification, newNotification = false }) {
  // ["like", "comment", "follow", "dedicate", "mention", "reshare"]

  let text = ''
  let subtext = ''
  let link = ''

  const name = notification?.sender?.name
  const postText = notification?.post?.text
    ? notification?.post?.text?.slice(0, 30) + '...'
    : ''
  const postLink = `/post/${notification?.post?._id}`

  switch (notification?.type) {
    case 'like':
      text = `liked your post`
      link = postLink
      break
    case 'comment':
      text = `commented on your post`
      link = postLink
      subtext = postText
      break
    case 'follow':
      text = `followed you`
      link = `/${notification?.sender?.username}`
      break
    case 'dedicate':
      text = `dedicated a song to you`
      link = postLink
      break
    case 'mention':
      text = `mentioned you in a post`
      subtext = postText
      link = postLink
      break
    case 'reshare':
      text = `reshared your post`
      link = postLink
      subtext = postText
      break
  }

  return (
    <Link
      to={link}
      className={`
                flex items-center justify-start border-b border-gray-700 100 py-4 pb-4 cursor-pointer px-6 ${
                  newNotification && 'bg-rewind-dark-black'
                }`}
    >
      <img
        src={notification?.sender?.profileUrl}
        alt="pfp"
        className="w-12 h-12 rounded-full"
      />
      <div className={'ml-4 '}>
        <h1 className={`text-base font-semibold font-lato text-gray-400 `}>
          <span className="font-bold text-rewind-primay">{name}</span> {text}
        </h1>
        <h1 className="text-sm font-lato text-gray-400 ">{subtext}</h1>
      </div>
    </Link>
  )
}

export default Notification
