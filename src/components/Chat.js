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
    this.socket.on('connect', () => {
      this.socket.emit('join_room', this.state.room)
    })

    this.socket.on('list_messages', messages => {
      this.setState({
        messages: messages
      })
    })

    this.socket.on('new_chat', message => {
      var mess = this.state.messages
      mess.push(JSON.parse(message))
      this.setState({
        messages: mess
      })
    })
  }

  componentWillUnmount() {
    this.socket.close()
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

    /* Post new message */
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: timestamp,
          room: this.state.room,
          message: this.state.message
        })
      })
      this.setState({ message: '' })
    } catch (e) {
      alert(e.message)
    }
  }

  render() {
    return (
      <div className="Chat">
        <h4>Chat: {this.state.room}</h4>
        <div>
          {this.state.messages.map(message => {
            return (
              <div key={message.date}>
                {message.nickname}@{message.date}: {message.message}
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
