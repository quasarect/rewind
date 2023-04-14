import { useContext } from 'react'

import Sidebar from './Sidebar'
import Bottom from './Bottom'

import home from './icons/home.svg'
import explore from './icons/explore.svg'
import messages from './icons/messages.svg'
import profile from './icons/profile.svg'

import { authContext } from '../../store/authContext'

export default function Navbar() {
  const { user } = useContext(authContext)

  const navItems = [
    {
      name: 'Home',
      icon: home,
      link: '/',
    },
    {
      name: 'Explore',
      icon: explore,
      link: '/explore',
    },
    {
      name: 'Messages',
      icon: messages,
      link: '/messages',
    },
    {
      name: 'Profile',
      icon: profile,
      link: '/' + user?.username,
    },
  ]

  return (
    <>
      <Sidebar navItems={navItems} />
      <Bottom navItems={navItems} />
    </>
  )
}
