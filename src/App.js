import io from 'socket.io-client'
import React, { useState, useEffect, useContext, Fragment } from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Nav, Navbar, Container } from 'react-bootstrap'
import { UserContext } from './UserContext'
import Routes from './Routes'
import './App.css'

const App = () => {
  const userContext = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated in back end
  const checkAuth = async () => {
    let auth = false
    try {
      const response = await fetch('/api/login')
      const res = await response.json()

      if (response.status === 200 && res.status === 'OK') {
        auth = true
      }
    } catch (e) {
      alert('Authentication failed:' + e.message)
    }

    // Open Socket.IO connection when succesfully logged in
    if (auth === true) {
      // Socket.IO connection
      // FIXME: hardcoded host / port
      const socket = io('localhost:3001')

      // Store socket connection in context
      userContext.socket = socket
    }

    // Keep login state in context
    userContext.isAuthenticated = auth
    setIsAuthenticated(auth)
    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [userContext.isAuthenticated])

  if (isLoading) {
    return null
  }

  return (
    <Container className="App">
      <Navbar bg="light">
        <Navbar.Brand>
          <Link to="/" className="nav-link">
            Stiff Chat Service
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav variant="pills">
            {isAuthenticated === true ? (
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
                <Nav.Item>
                  <NavLink to="/logout" className="nav-link">
                    Logout
                  </NavLink>
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
      <Routes />
    </Container>
  )
}

export default withRouter(App)
