import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import {
  FormGroup,
  FormControl,
  ListGroup,
  Container,
  Row,
  Col
} from 'react-bootstrap'
import LoaderButton from './LoaderButton'
import Rooms from './Rooms'
import './Chat.css'

const socket = io('localhost:3001')

const Chat = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [, setNumMessages] = useState(0)
  const [messagesList, setMessagesList] = useState([])

  const lastMessage = useRef()

  useEffect(() => {
    console.log("SELECT ROOM")
    var passedRoom = ''
    try {
      passedRoom = props.location.state.selectedRoom
    } catch (err) {}

    if (passedRoom && passedRoom !== selectedRoom) {
      setIsLoading(true)
      setMessagesList([])
      setSelectedRoom(passedRoom)
    }
  }, [props])

  useEffect(() => {
    socket.open()
    socket.emit('join_room', selectedRoom)
    //return () => socket.close()
  }, [selectedRoom])

  useEffect(() => {
    socket.on('list_messages', getMessagesList)
    return () => socket.removeListener('list_messages', getMessagesList)
  }, [messagesList])

  useEffect(() => {
    socket.on('new_chat', receiveNewMessage)
    return () => socket.removeListener('new_chat', receiveNewMessage)
  }, [messagesList])

  const getMessagesList = messages => {
    setIsLoading(false)
    setMessagesList(messages)

    const messagesLen = messages.length
    if (messagesLen > 0) {
      setNumMessages(messagesLen)
      scrollToLastMessage()
    }
  }

  const receiveNewMessage = message => {
    var messages = messagesList
    messages.push(message)
    setMessagesList(messages)
    setNumMessages(messages.length)
    scrollToLastMessage()
  }

  const validateForm = () => {
    return newMessage.length > 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const timestamp = Date.now()

    /* Post new message */
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
      alert(e.message)
    }
  }

  const scrollToLastMessage = () => {
    lastMessage.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Container className="Chat">
      <Row>
        <Col xs={2}>
          <Rooms />
        </Col>
        <Col xs={8}>
          {selectedRoom ? (
            <div>
              <h4>{selectedRoom}</h4>
              <div>
                {isLoading ? (
                  <LoaderButton
                    block
                    isLoading={isLoading}
                    loadingText="Loading..."
                  />
                ) : (
                  <ListGroup className="Messages">
                    {messagesList.map(message => {
                      return (
                        <ListGroup.Item key={message.date}>
                          <p>
                            {message.nickname}@{message.date}:
                          </p>
                          {message.message}
                        </ListGroup.Item>
                      )
                    })}
                    <div
                      style={{ float: 'left', clear: 'both' }}
                      ref={lastMessage}
                    />
                  </ListGroup>
                )}
              </div>
              <form onSubmit={handleSubmit} className="SubmitMessage">
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
                  loadingText="Submiting…"
                />
              </form>
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
