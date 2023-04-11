import { createContext, useState } from 'react'

const authContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  token: null,
  setToken: () => {},
})

export { authContext }

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        token,
        setToken,
      }}
    >
      {props.children}
    </authContext.Provider>
  )
}

export default AuthContextProvider
