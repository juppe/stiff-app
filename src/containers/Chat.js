import React, { Component } from 'react'
import io from 'socket.io-client'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import './Chat.css'

export default class Chat extends Component {
  constructor(props) {
    super(props)

    const { room } = this.props.match.params

    this.state = {
      room: room,
      message: '',
      messages: []
    }

    this.socket = io('localhost:3001')
  }

  componentDidMount() {
    /* Join socket room */
    this.socket.emit('join_room', this.state.room)

    this.socket.on('list_messages', messages => {
      this.setState({
        messages: messages
      })
    })

    this.socket.on('new_messsage', message => {
      console.log('receive_message')
      var mess = this.state.messages
      mess.push(JSON.parse(message))
      this.setState({
        messages: mess
      })
    })
  }

  componentWillUnmount() {
    this.socket.off('list_messages')
    this.socket.off('new_messsage')
    this.socket.off('write_message')
  }

  validateForm() {
    return this.state.message.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = async event => {
    event.preventDefault()
    const timestamp = Date.now()

    /* Emit new message to socket */
    this.socket.emit('write_message', {
      date: timestamp,
      room: this.state.room,
      message: this.state.message
    })
  }

  render() {
    return (
      <div className="Chat">
        <h4>Chat</h4>
        <div>
          {this.state.messages.map(message => {
            return (
              <div key={message.date}>
                {message.username}: {message.message}
              </div>
            )
          })}
        </div>

        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="message">
            <FormLabel>Write a message</FormLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.message}
              onChange={this.handleChange}
            />
          </FormGroup>
          <LoaderButton
            block
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Submit"
            loadingText="Submiting…"
          />
        </form>
      </div>
    )
  }
}
