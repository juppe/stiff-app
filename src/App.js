import React, { Component, Fragment } from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import Routes from './Routes'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    }
  }

  async amiLoggedin() {
    try {
      const response = await fetch('/api/login')
      const responseStatus = await response.status

      if (responseStatus === 200) {
        this.userHasAuthenticated(true)
      }
    } catch (e) {
      if (e !== 'No current user') {
        alert(e)
      }
    }
  }

  async logout() {
    try {
      const response = await fetch('/api/logout')
      const responseStatus = await response.status

      if (responseStatus === 200) {
        this.userHasAuthenticated(true)
      }
    } catch (e) {
      if (e !== 'No current user') {
        alert(e)
      }
    }
  }

  async componentDidMount() {
    await this.amiLoggedin()
    this.setState({ isAuthenticating: false })
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated })
  }

  handleLogout = async event => {
    await this.logout()
    this.userHasAuthenticated(false)
    this.props.history.push('/login')
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }

    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <Navbar bg="light">
            <Navbar.Brand>
              <Link to="/" className="nav-link">
                Stiff Chat Service
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav variant="pills">
                {this.state.isAuthenticated ? (
                  <Fragment>
                    <Nav.Item>
                      <NavLink to="/chat" className="nav-link">
                        Chat
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink to="/rooms" className="nav-link">
                        Rooms
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink to="/users" className="nav-link">
                        Users
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item onClick={this.handleLogout} className="nav-link">
                      Logout
                    </Nav.Item>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Nav.Item>
                      <NavLink to="/signup" className="nav-link">
                        Signup
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink to="/login" className="nav-link">
                        Login
                      </NavLink>
                    </Nav.Item>
                  </Fragment>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      )
    )
  }
}

export default withRouter(App)
