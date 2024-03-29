import React, { useState, useContext } from 'react'
import {
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Container
} from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import { UserContext } from '../UserContext'
import './Signup.css'

const Signup = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [addUserFeedback, setAddUserFeedback] = useState({
    invalid: false,
    message: ''
  })

  const userContext = useContext(UserContext)

  // Validate form input
  const validateForm = () => {
    return (
      username.length > 0 &&
      nickname.length > 0 &&
      password.length > 0 &&
      password === confirmPassword
    )
  }

  // Post new user to back end
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

      if (res.status === 'OK') {
        setIsLoading(false)
        userContext.isAuthenticated = true
        props.history.push('/')
      } else if (res.status === 'ERROR') {
        // Flag invalidity when back end returns error
        setAddUserFeedback({
          invalid: true,
          message: res.message
        })
        setIsLoading(false)
      }
    } catch (e) {
      alert('Error creating user: ' + e.message)
    }
  }

  // Handle change in username input
  const handleUsernameChange = event => {
    setUsername(event.target.value)

    if (addUserFeedback.invalid) {
      setAddUserFeedback({
        invalid: false,
        message: ''
      })
    }
  }

  return (
    <Container className="Signup">
      <Form onSubmit={handleSubmit}>
        <FormGroup controlId="username">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={username}
            isInvalid={addUserFeedback.invalid}
            onChange={handleUsernameChange}
          />
          <FormControl.Feedback type="invalid">
            {addUserFeedback.message}
          </FormControl.Feedback>
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
      </Form>
    </Container>
  )
}

export default Signup
