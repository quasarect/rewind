// native
import { useContext, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'

// pages
import Login from './pages/Login'
import Callback from './pages/Callback'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Messages from './pages/Messages'

// utils
import NavbarSidebarWrapper from './components/utils/NavbarSidebarWrapper'

import { authContext } from './store/authContext'
import { useHttpClient } from './hooks/httpRequest'

function App() {
  const { setUser } = useContext(authContext)

  const { sendRequest } = useHttpClient()

  const fetchMe = useCallback(async () => {
    const res = await sendRequest('/user/me')
    setUser(res.user)
  }, [])

  useEffect(() => {
    try {
      fetchMe()
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <div className='flex h-screen bg-rewind-dark-primary text-white'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/callback' element={<Callback />} />
        <Route
          path='/'
          element={
            <NavbarSidebarWrapper>
              <Home />
            </NavbarSidebarWrapper>
          }
        />
        <Route
          path='/:username'
          element={
            <NavbarSidebarWrapper showSidebar={false}>
              <Profile />
            </NavbarSidebarWrapper>
          }
        />
        <Route path='/messages' element={<Messages />} />
      </Routes>
    </div>
  )
}

export default App
