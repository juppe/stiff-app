import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true
    }
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return
    }
    this.setState({ isLoading: false })
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Stiff Chat Service</h1>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    )
  }

  renderChat() {
    return (
      <div className="Chat">
        <h4>Stiff Chat Service</h4>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderChat() : this.renderLander()}
      </div>
    )
  }
}
