// native
import { Routes, Route } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Login from './pages/Login'
import Callback from './pages/Callback'

// utils
import NavbarSidebarWrapper from './components/utils/NavbarSidebarWrapper'

function App() {
  return (
    <div className='flex h-screen bg-rewind-dark-primary'>
      <Routes>
        <Route
          path='/'
          element={
            <NavbarSidebarWrapper>
              <Home />
            </NavbarSidebarWrapper>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/callback' element={<Callback />} />
      </Routes>
    </div>
  )
}

export default App
