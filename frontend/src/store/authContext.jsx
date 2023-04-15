import { createContext, useState, useEffect } from 'react'

const authContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  fetchMe: () => {},
  token: null,
  user: null,
})

export { authContext }

import { useHttpClient } from '../hooks/httpRequest'

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  const { sendRequest } = useHttpClient()

  const fetchMe = async () => {
    const res = await sendRequest('/user/me')
    setUser(res.user)
    console.log(res.user)
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
    }
  }, [])

  const login = token => {
    localStorage.setItem('token', token)
    setToken(token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        fetchMe,
        login,
        logout,
      }}
    >
      {props.children}
    </authContext.Provider>
  )
}

export default AuthContextProvider
