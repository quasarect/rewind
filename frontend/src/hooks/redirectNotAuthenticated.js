import { useEffect, useContext } from 'react'
import { authContext } from '../store/authContext'
import { useNavigate } from 'react-router-dom'

const useRedirectNotAuthenticated = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(authContext)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])
}

export { useRedirectNotAuthenticated }
