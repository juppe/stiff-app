import React from 'react'
import io from 'socket.io-client'
import ChatInput from './ChatInput'

class Chat extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      message: '',
      messages: []
    }

    this.socket = io('localhost:3001')
  }

  componentDidMount() {
    this.getMessages()
    this.socket.on('receive_message', message => {
      this.addMessage(message)
    })
  }

  addMessage = message => {
    this.setState(state => ({ messages: [message, ...state.messages] }))
  }

  submitMessage = messageData => {
    this.socket.emit('send_message', {
      username: messageData.username,
      message: messageData.message
    })
  }

  async getMessages() {
    try {
      const response = await fetch('/api/messages')
      const responseJson = await response.json()

      this.setState({
        messages: responseJson
      })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div style={{ marginTop: '20px' }}>
        <ChatInput
          ws={this.ws}
          onSubmitMessage={messageData => this.submitMessage(messageData)}
        />
        <div>
          {this.state.messages.map(message => {
            return (
              <div>
                {message.username}: {message.message}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Chat
