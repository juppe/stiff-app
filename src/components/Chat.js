import React, { useState, useEffect, useRef, useContext } from 'react'
import {
  FormGroup,
  FormControl,
  ListGroup,
  Container,
  OverlayTrigger,
  Popover,
  Row,
  Col,
  Form
} from 'react-bootstrap'
import * as R from 'ramda'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from '../UserContext'
import LoaderButton from './LoaderButton'
import Rooms from './Rooms'
import './Chat.css'

const Chat = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [messagesList, setMessagesList] = useState([])
  const [roomMembers, setRoomMembers] = useState({ qty: 0, members: [] })
  const lastMessage = useRef()

  // Get socket connection from context
  const userContext = useContext(UserContext)
  const socket = userContext.socket

  // Select chat room based on selectedRoom prop
  useEffect(() => {
    const passedRoom = R.path(['location', 'state', 'selectedRoom'], props)

    if (passedRoom !== undefined && passedRoom !== selectedRoom) {
      setIsLoading(true)
      setMessagesList([])
      setSelectedRoom(passedRoom)
    }
  }, [props.location.state])

  // Open socket and join chat room
  useEffect(() => {
    if (selectedRoom !== '') {
      socket.open()
      socket.emit('join_room', selectedRoom)
      socket.emit('room_members', selectedRoom)
    }
  }, [selectedRoom])

  // Receive message history of chat room
  useEffect(() => {
    socket.on('messages_list', getMessagesList)
    return () => socket.removeListener('messages_list', getMessagesList)
  }, [messagesList])

  // Receive members list
  useEffect(() => {
    socket.on('members_list', receiveMembersList)
    return () => socket.removeListener('members_list', receiveMembersList)
  }, [messagesList])

  // Receive new message posted in chat room
  useEffect(() => {
    socket.on('new_chat', receiveNewMessage)
    return () => socket.removeListener('new_chat', receiveNewMessage)
  }, [messagesList])

  // Process received message list
  const getMessagesList = messages => {
    setMessagesList(messages)
    setIsLoading(false)

    if (messages.length) {
      scrollToLastMessage()
    }
  }

  // Process received members list
  const receiveMembersList = members => {
    setRoomMembers({ qty: members.length, members: members })
  }

  // Process received new message
  const receiveNewMessage = message => {
    setMessagesList([...messagesList, message])
    scrollToLastMessage()
  }

  // Validate message before posting
  const validateForm = () => {
    return newMessage.length > 0
  }

  // Post new message to back end
  const handleSubmit = async event => {
    event.preventDefault()
    const timestamp = Date.now()

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: timestamp,
          room: selectedRoom,
          message: newMessage
        })
      })
      setNewMessage('')
    } catch (e) {
      alert('Message post failed:' + e.message)
    }
  }

  // Scroll to last message on chat room
  const scrollToLastMessage = () => {
    lastMessage.current.scrollIntoView({ behavior: 'smooth' })
  }

  // Members list popover
  const memberListPopover = (
    <Popover id="popover-basic" title="Active members">
      <ListGroup className="Members">
        {roomMembers.members.map(member => (
          <ListGroup.Item key={member}>{member}</ListGroup.Item>
        ))}
      </ListGroup>
    </Popover>
  )

  // Submit new message form
  const addMessageForm = () => (
    <Form onSubmit={handleSubmit} className="SubmitMessage">
      <FormGroup controlId="message">
        <FormControl
          autoFocus
          type="text"
          value={newMessage}
          placeholder="Write a message"
          onChange={e => setNewMessage(e.target.value)}
        />
      </FormGroup>
      <LoaderButton
        block
        disabled={!validateForm()}
        type="submit"
        isLoading={isLoading}
        text="Submit"
        loadingText="Submitting…"
      />
    </Form>
  )

  // Buld messages list
  const listMessages = () => {
    return messagesList.map(message => (
      <ListGroup.Item key={message.date}>
        <p>
          {message.nickname}@{message.date}:
        </p>
        {message.message}
      </ListGroup.Item>
    ))
  }

  return (
    <Container className="Chat">
      <Row>
        <Col xs={2}>
          <Rooms />
        </Col>
        <Col xs={10}>
          {selectedRoom ? (
            <div>
              <h4 className="d-inline">{selectedRoom}</h4>
              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={memberListPopover}
              >
                <div className="RoomMembers d-inline">
                  <FontAwesomeIcon icon={faUserSecret} />
                  {roomMembers.qty}
                </div>
              </OverlayTrigger>
              <ListGroup className="Messages">
                {listMessages()}
                <div ref={lastMessage} />
              </ListGroup>
              {addMessageForm()}
            </div>
          ) : (
            <p>Please select a chat room!</p>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Chat
