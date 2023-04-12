import { createContext, useState, useEffect } from 'react'

const authContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  userId: null,
  token: null,
})

export { authContext }

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (token, userId) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    setToken(token)
    setUserId(userId)
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
        login,
        logout,
        token,
      }}
    >
      {props.children}
    </authContext.Provider>
  )
}

export default AuthContextProvider
