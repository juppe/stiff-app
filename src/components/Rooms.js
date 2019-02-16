import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import LoaderButton from './LoaderButton'
import './Rooms.css'

const socket = io('localhost:3001')

const Rooms = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [, setNumRooms] = useState(0)
  const [roomsList, setRoomsList] = useState([])

  useEffect(() => {
    socket.open()
    socket.emit('list_rooms')
    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    socket.on('list_rooms', getRoomsList)
    return () => socket.removeListener('list_rooms', getRoomsList)
  }, [roomsList])

  useEffect(() => {
    socket.on('new_room', submitNewRoom)
    return () => socket.removeListener('new_room', submitNewRoom)
  }, [roomsList])

  const getRoomsList = rooms => {
    setRoomsList(rooms)
    setNumRooms(rooms.length)
  }

  const submitNewRoom = room => {
    var rooms = roomsList
    rooms.push(room)
    setRoomsList(rooms)
    setNumRooms(rooms.length)
  }

  const validateForm = () => {
    return roomName.length > 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsLoading(true)

    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomname: roomName
        })
      })
      setRoomName('')
    } catch (e) {
      alert(e.message)
    }
    setIsLoading(false)
  }

  const listRooms = roomsList => {
    if (roomsList.length) {
      return roomsList.map(room => (
        <li key={room}>
          <Link to={{ pathname: '/chat', state: { selectedRoom: room } }}>
            {room}
          </Link>
        </li>
      ))
    }
  }

  return (
    <div className="Rooms">
      <h4>Chat rooms</h4>
      <div>
        <ul>{listRooms(roomsList)}</ul>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="roomname">
            <FormLabel>Create New Room</FormLabel>
            <FormControl
              autoFocus
              type="text"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
            />
          </FormGroup>
          <LoaderButton
            block
            disabled={!validateForm()}
            type="submit"
            isLoading={isLoading}
            text="Create new room"
            loadingText="Creating new room…"
          />
        </form>
      </div>
    </div>
  )
}

export default Rooms
