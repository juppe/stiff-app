import React, { useState, useEffect, useContext } from 'react'
import { ListGroup, Container } from 'react-bootstrap'
import { UserContext } from '../UserContext'
import './Users.css'

const Users = () => {
  const [usersList, setUsersList] = useState([])

  // Get socket connection from context
  const userContext = useContext(UserContext)
  const socket = userContext.socket

  // Open socket and request user list
  useEffect(() => {
    socket.open()
    socket.emit('list_users')
  }, [])

  // Receive user list
  useEffect(() => {
    socket.on('users_list', getUsersList)
    return () => socket.removeListener('users_list', getUsersList)
  }, [usersList])

  // Receive new user
  useEffect(() => {
    socket.on('new_user', receiveNewUser)
    return () => socket.removeListener('new_user', receiveNewUser)
  }, [usersList])

  const getUsersList = users => {
    setUsersList(users)
  }

  const receiveNewUser = user => {
    setUsersList([...usersList, user])
  }

  // Buld users list
  const listUsers = () => {
    return usersList.map(u => (
      <ListGroup.Item key={u.username}>
        {u.nickname} - ({u.username})
      </ListGroup.Item>
    ))
  }

  return (
    <Container className="Users">
      <h4>Users</h4>
      <ListGroup>{listUsers()}</ListGroup>
    </Container>
  )
}

export default Users
