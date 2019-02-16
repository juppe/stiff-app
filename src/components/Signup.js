import React, { useState, useContext } from 'react'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import { UserContext } from '../UserContext'
import './Signup.css'

const Signup = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const userContext = useContext(UserContext)

  const validateForm = () => {
    return (
      username.length > 0 &&
      nickname.length > 0 &&
      password.length > 0 &&
      password === confirmPassword
    )
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          nickname: nickname,
          password: password
        })
      })
      const res = await response.json()
      console.log('User created : ' + res)
    } catch (e) {
      console.log('New user: ' + e.message)
      alert('New user: ' + e.message)
    }

    setIsLoading(false)
    userContext.isAuthenticated = true
    props.history.push('/rooms')
  }

  return (
    <div className="Signup">
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
        <FormGroup controlId="nickname">
          <FormLabel>Nickname</FormLabel>
          <FormControl
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
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
        <FormGroup controlId="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    </div>
  )
}

export default Signup
