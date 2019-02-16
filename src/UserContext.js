import { createContext } from 'react'

const isLoggedIn = async () => {
  try {
    const response = await fetch('/api/login')
    const responseStatus = await response.status

    if (responseStatus === 200) {
      return true
    }
  } catch (e) {
    if (e !== 'No current user') {
      alert(e)
    }
  }
  return false
}

export const UserContext = createContext({ isAuthenticated: isLoggedIn() })
