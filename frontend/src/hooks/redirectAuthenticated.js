import { useEffect, useContext } from 'react'
import { authContext } from '../store/authContext'
import { useNavigate } from 'react-router-dom'

const useRedirectAuthenticated = (path = '/') => {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(authContext)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(path)
    }
  }, [isAuthenticated, navigate])
}

export { useRedirectAuthenticated }
