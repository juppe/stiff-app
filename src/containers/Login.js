import React, { Component } from 'react'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import './Login.css'

export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      username: '',
      password: ''
    }
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = async event => {
    event.preventDefault()
    this.setState({ isLoading: true })

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      })

      if (response.ok) {
        this.props.userHasAuthenticated(true)
      } else {
        alert('Login failed!')
      }
      this.setState({ isLoading: false })
    } catch (e) {
      alert('Login failed:' + e.message)
      this.setState({ isLoading: false })
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.username}
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
          <LoaderButton
            block
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </div>
    )
  }
}
