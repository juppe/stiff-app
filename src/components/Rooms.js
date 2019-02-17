import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import io from 'socket.io-client'
import {
  FormGroup,
  FormControl,
  FormLabel,
  Modal,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap'
import LoaderButton from './LoaderButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import './Rooms.css'

const socket = io('localhost:3001')

const Rooms = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [, setNumRooms] = useState(0)
  const [roomsList, setRoomsList] = useState([])
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [addRoomFeedback, setAddRoomFeedback] = useState({
    invalid: false,
    message: ''
  })

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
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomname: roomName
        })
      })
      const res = await response.json()

      if (res.status === 'ERROR') {
        setAddRoomFeedback({
          invalid: true,
          message: res.message
        })
        setIsLoading(false)
        return
      }
    } catch (e) {
      alert(e.message)
    }
    const selectedRoom = roomName
    setIsLoading(false)
    setRoomName('')
    toggleModal(!showAddRoom)

    // Redirect to and join created room when we are in the /chat component
    if (props.location.pathname === '/chat') {
      props.history.push({
        pathname: '/chat',
        state: { selectedRoom: selectedRoom }
      })
    }
  }

  const listRooms = roomsList => {
    if (roomsList.length) {
      return roomsList.map(room => (
        <Link
          to={{ pathname: '/chat', state: { selectedRoom: room } }}
          key={room}
          className="list-group-item list-group-item-action"
        >
          {room}
        </Link>
      ))
    }
  }

  const toggleModal = () => {
    setShowAddRoom(!showAddRoom)
  }

  const handleRoomNameChange = event => {
    setRoomName(event.target.value)

    if (addRoomFeedback.invalid) {
      setAddRoomFeedback({
        invalid: false,
        message: ''
      })
    }
  }

  return (
    <div className="Rooms">
      <h4>Chat rooms</h4>
      <div>
        <ListGroup>
          {listRooms(roomsList)}

          <ListGroupItem
            variant="primary"
            action
            onClick={toggleModal}
            className="addRoom"
          >
            <FontAwesomeIcon icon={faPlusCircle} /> Add room
          </ListGroupItem>
        </ListGroup>
      </div>

      <Modal show={showAddRoom} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Room</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <FormGroup controlId="roomname">
              <FormLabel>Room Name</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value={roomName}
                onChange={handleRoomNameChange}
                isInvalid={addRoomFeedback.invalid}
              />
              <FormControl.Feedback type="invalid">
                {addRoomFeedback.message}
              </FormControl.Feedback>
            </FormGroup>
          </Modal.Body>

          <Modal.Footer>
            <LoaderButton
              block
              disabled={!validateForm()}
              type="submit"
              isLoading={isLoading}
              text="Add"
              loadingText="Creating new room…"
            />
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}

export default withRouter(Rooms)
