import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
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

  useEffect(() => {
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
    return () => socket.close()
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
    setMessagesList(messages)
    setNumMessages(messages.length)
    setIsLoading(false)
  }

  const receiveNewMessage = message => {
    var messages = messagesList
    messages.push(message)
    setMessagesList(messages)
    setNumMessages(messages.length)
  }

  const validateForm = () => {
    return newMessage.length > 0
  }

  const handleSubmit = async event => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  return (
    <div className="Chat">
      <div className="row ">
        <div className="col">
          <Rooms />
        </div>
        <div className="col-8">
          {selectedRoom ? (
            <div>
              <h4>Chat: {selectedRoom}</h4>
              <div>
                {isLoading ? (
                  <LoaderButton
                    block
                    isLoading={isLoading}
                    loadingText="Loading..."
                  />
                ) : (
                  messagesList.map(message => {
                    return (
                      <div key={message.date}>
                        {message.nickname}@{message.date}: {message.message}
                      </div>
                    )
                  })
                )}
              </div>
              <form onSubmit={handleSubmit}>
                <FormGroup controlId="message">
                  <FormLabel>Write a message</FormLabel>
                  <FormControl
                    autoFocus
                    type="text"
                    value={newMessage}
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
            <div>
              <p>Please select a chat room!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat
