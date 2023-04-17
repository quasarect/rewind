// native
import { useContext, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'

// pages
import Login from './pages/Login'
import Callback from './pages/Callback'
import NotFound404 from './pages/NotFound404'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Post from './pages/Post'
import TestMessage from './pages/TestMessages'
import Messages from './pages/Messages'
import Chat from './components/messages/Chat'
import Notifications from './pages/Notifications'

// utils
import NavbarSidebarWrapper from './components/utils/NavbarSidebarWrapper'

import { authContext } from './store/authContext'

function App() {
  const { fetchMe, isAuthenticated } = useContext(authContext)

  useEffect(() => {
    try {
      fetchMe()
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <div className='flex h-screen bg-rewind-dark-primary text-white '>
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
          path='/explore'
          element={
            <NavbarSidebarWrapper>
              <Explore />
            </NavbarSidebarWrapper>
          }
        />
        <Route
          path='/post/:postId'
          element={
            <NavbarSidebarWrapper>
              <Post />
            </NavbarSidebarWrapper>
          }
        />

        <Route
          path='/messages'
          element={
            <NavbarSidebarWrapper showSidebar={false}>
              <Messages />
            </NavbarSidebarWrapper>
          }
        >
          <Route path=':coversationId' element={<Chat />} />
        </Route>

        <Route
          path='/notifications'
          element={
            <NavbarSidebarWrapper>
              <Notifications />
            </NavbarSidebarWrapper>
          }
        />

        <Route path='/test-messages' element={<TestMessage />} />
        <Route path='/404' element={<NotFound404 />} />
        <Route
          path='/:username'
          element={
            <NavbarSidebarWrapper showSidebar={false}>
              <Profile />
            </NavbarSidebarWrapper>
          }
        />
      </Routes>
    </div>
  )
}

export default App
