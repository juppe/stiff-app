import React, { useState, useContext } from 'react'
import LoaderButton from './LoaderButton'
import { UserContext } from '../UserContext'
import './Logout.css'
import { Container, Form } from 'react-bootstrap'

const Logout = props => {
  const userContext = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)

  // Post logout to back end and update userContext
  const handleSubmit = async event => {
    event.preventDefault()

    try {
      await fetch('/api/logout')
    } catch (e) {
      alert('Logout failed:' + e.message)
    }
    setIsLoading(false)
    userContext.isAuthenticated = false
    props.history.push('/')
  }

  return (
    <Container className="Logout">
      <h4>Are you sure you want to log out?</h4>
      <Form onSubmit={handleSubmit}>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          text="Logout"
          loadingText="Logging out.."
        />
      </Form>
    </Container>
  )
}

export default Logout
