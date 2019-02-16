import React, { useState, useContext } from 'react'
import LoaderButton from './LoaderButton'
import { UserContext } from '../UserContext'
import './Logout.css'

const Logout = props => {
  const userContext = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const response = await fetch('/api/logout')
      console.log(response)
    } catch (e) {
      if (e !== 'No current user') {
        alert(e)
      }
    }
    setIsLoading(false)
    userContext.isAuthenticated = false
    props.history.push('/')
  }

  return (
    <div className="Logout">
      <h4>Are you sure you want to log out?</h4>
      <form onSubmit={handleSubmit}>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          text="Logout"
          loadingText="Logging out.."
        />
      </form>
    </div>
  )
}

export default Logout
