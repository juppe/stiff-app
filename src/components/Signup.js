import React, { Component } from 'react'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import './Signup.css'

export default class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      username: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      confirmationCode: ''
    }
  }

  validateForm() {
    return (
      this.state.username.length > 0 &&
      this.state.nickname.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    )
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleRegisterSubmit = async event => {
    event.preventDefault()
    this.setState({ isLoading: true })

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.state.username,
          nickname: this.state.nickname,
          password: this.state.password
        })
      })
      const res = await response.json()
      console.log('User created : ' + res)
    } catch (e) {
      console.log('New user: ' + e.message)
      alert('New user: ' + e.message)
    }

    this.props.userHasAuthenticated(true)
    this.props.history.push('/')
    this.setState({ isLoading: false })
  }

  render() {
    return (
      <div className="Signup">
        <form onSubmit={this.handleRegisterSubmit}>
          <FormGroup controlId="username">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="nickname">
            <FormLabel>Nickname</FormLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.nickname}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Signup"
            loadingText="Signing up…"
          />
        </form>
      </div>
    )
  }
}
