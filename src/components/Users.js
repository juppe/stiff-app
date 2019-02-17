import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { ListGroup } from 'react-bootstrap'
import './Users.css'

const socket = io('localhost:3001')

const Users = () => {
  const [, setNumUsers] = useState(0)
  const [usersList, setUsersList] = useState([])

  useEffect(() => {
    socket.open()
    socket.emit('list_users')
    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    socket.on('list_users', getUsersList)
    return () => socket.removeListener('list_users', getUsersList)
  }, [usersList])

  useEffect(() => {
    socket.on('new_user', receiveNewUser)
    return () => socket.removeListener('new_user', receiveNewUser)
  }, [usersList])

  const getUsersList = users => {
    setUsersList(users)
    setNumUsers(users.length)
  }

  const receiveNewUser = user => {
    console.log(user)
    var users = usersList
    console.log(usersList)
    users.push(user)
    setUsersList(users)
    setNumUsers(users.length)
  }

  return (
    <div className="Users">
      <h4>Users</h4>
      <div>
        <ListGroup>
          {usersList.map(u => (
            <ListGroup.Item key={u.username}>
              {u.nickname} - ({u.username})
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  )
}

export default Users
