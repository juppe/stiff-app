import React, { useState, useEffect, useContext } from 'react'
import { withRouter, Link } from 'react-router-dom'
import {
  Container,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Modal,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap'
import { UserContext } from '../UserContext'
import LoaderButton from './LoaderButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import './Rooms.css'

const Rooms = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [roomsList, setRoomsList] = useState([])
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [addRoomFeedback, setAddRoomFeedback] = useState({
    invalid: false,
    message: ''
  })

  // Get socket connection from context
  const userContext = useContext(UserContext)
  const socket = userContext.socket

  // Open socket and request rooms list
  useEffect(() => {
    socket.open()
    socket.emit('list_rooms')
  }, [])

  // Receive list of rooms
  useEffect(() => {
    socket.on('rooms_list', getRoomsList)
    return () => socket.removeListener('rooms_list', getRoomsList)
  }, [roomsList])

  // Receive new room
  useEffect(() => {
    socket.on('new_room', submitNewRoom)
    return () => socket.removeListener('new_room', submitNewRoom)
  }, [roomsList])

  const getRoomsList = rooms => {
    setRoomsList(rooms)
  }

  const submitNewRoom = room => {
    setRoomsList([...roomsList, room])
  }

  // Validate form input
  const validateForm = () => {
    return roomName.length > 0
  }

  // Post new room to back end
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
        // Flag invalidity when back end returns error
        setAddRoomFeedback({
          invalid: true,
          message: res.message
        })
        setIsLoading(false)
        return
      }
    } catch (e) {
      alert('Error creating room: ' + e.message)
    }

    const selectedRoom = roomName
    setIsLoading(false)
    setRoomName('')
    toggleModal(!showAddRoom)

    // Redirect to new room and join created room
    // when we are in the /chat component
    if (props.location.pathname === '/chat') {
      props.history.push({
        pathname: '/chat',
        state: { selectedRoom: selectedRoom }
      })
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

  // Build rooms list
  const listRooms = () => {
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

  // Modal form for creating new room
  const addRoomForm = () => (
    <Modal show={showAddRoom} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Room</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
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
      </Form>
    </Modal>
  )

  return (
    <Container className="Rooms">
      <h4>Chat rooms</h4>
      <ListGroup>
        {listRooms()}
        <ListGroupItem
          variant="primary"
          action
          onClick={toggleModal}
          className="addRoom"
        >
          <FontAwesomeIcon icon={faPlusCircle} /> Add room
        </ListGroupItem>
      </ListGroup>
      {addRoomForm()}
    </Container>
  )
}

export default withRouter(Rooms)
