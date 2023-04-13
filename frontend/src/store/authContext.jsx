import { createContext, useState, useEffect } from 'react'

const authContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  token: null,
  user: null,
})

export { authContext }

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

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
        setUser,
        login,
        logout,
      }}
    >
      {props.children}
    </authContext.Provider>
  )
}

export default AuthContextProvider
