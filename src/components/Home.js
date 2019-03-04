import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'
import './Home.css'
import { Container } from 'react-bootstrap'

const Home = () => {
  const userContext = useContext(UserContext)
  const isAuthenticated = userContext.isAuthenticated

  return (
    <Container className="Home">
      {isAuthenticated === true ? (
        <div className="Chat">
          <h4>Stiff Chat Service</h4>
          <p>Welcome to the Stiff Chat Service</p>
        </div>
      ) : (
        <div className="Landingpage">
          <h1>Stiff Chat Service</h1>
          <div>
            <Link to="/signup" className="btn btn-success btn-lg">
              Signup
            </Link>
            <Link to="/login" className="btn btn-info btn-lg">
              Login
            </Link>
          </div>
        </div>
      )}
    </Container>
  )
}

export default Home
