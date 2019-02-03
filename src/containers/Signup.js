import React, { Component } from 'react'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import './Signup.css'

export default class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null
    }
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
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
      console.log('New user: ' +JSON.stringify({
        email: this.state.email,
        nickname: this.state.nickname,
        password: this.state.password
      }))

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
          nickname: this.state.nickname,
          password: this.state.password
        })
      })
      const newUser = await response.json()
      this.setState({
        newUser
      })
    } catch (e) {
      console.log('New user: ' + e.message)
      alert('New user: ' + e.message)
    }

    this.setState({ isLoading: false })
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault()
    this.setState({ isLoading: true })

    try {
      /*
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode)
      await Auth.signIn(this.state.email, this.state.password)
      */
      this.props.userHasAuthenticated(true)
      this.props.history.push('/')
    } catch (e) {
      alert(e.message)
      this.setState({ isLoading: false })
    }
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode">
          <FormLabel>Confirmation Code</FormLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
        </FormGroup>
        <LoaderButton
          block

          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    )
  }

  renderForm() {
    return (
      <form onSubmit={this.handleRegisterSubmit}>
        <FormGroup controlId="email">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
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
    )
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    )
  }
}
