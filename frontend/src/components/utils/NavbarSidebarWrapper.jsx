import React from 'react'

import Navbar from '../navbar/index'
import Sidebar from '../sidebar/index'

function NavbarSidebarWrapper({
  children,
  showNavbar = true,
  showSidebar = true,
}) {
  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showSidebar && <Sidebar />}
    </>
  )
}

export default NavbarSidebarWrapper
