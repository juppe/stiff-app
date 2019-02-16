import React, { useState, useEffect, useContext, Fragment } from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import { UserContext } from './UserContext'
import Routes from './Routes'
import './App.css'

const App = props => {
  const userContext = useContext(UserContext)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const authenticated = async () => {
    const auth = await userContext.isAuthenticated
    setIsAuthenticated(auth)
  }

  useEffect(() => {
    authenticated()
  }, [userContext.isAuthenticated])

  return (
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
            {isAuthenticated ? (
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
    </div>
  )
}

export default withRouter(App)
