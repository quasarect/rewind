import Sidebar from './Sidebar'
import Bottom from './Bottom'

import home from './logos/home.svg'
import explore from './logos/explore.svg'
import messages from './logos/messages.svg'
import profile from './logos/profile.svg'

export default function Navbar() {
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
      link: '/profile',
    },
  ]

  return (
    <>
      <Sidebar navItems={navItems} />
      <Bottom navItems={navItems} />
    </>
  )
}
