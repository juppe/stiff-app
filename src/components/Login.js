import React, { useState, useContext } from 'react'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import LoaderButton from './LoaderButton'
import { UserContext } from '../UserContext'
import './Login.css'

const Login = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const userContext = useContext(UserContext)

  const validateForm = () => {
    return username.length > 0 && password.length > 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })

      if (response.ok) {
        userContext.isAuthenticated = true
      } else {
        alert('Login failed!')
      }
    } catch (e) {
      alert('Login failed:' + e.message)
    }
    setIsLoading(false)

    if (userContext.isAuthenticated) {
      props.history.push({
        pathname: '/',
        state: { login: true }
      })
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="username">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
          text="Login"
          loadingText="Logging in…"
        />
      </form>
    </div>
  )
}

export default Login
