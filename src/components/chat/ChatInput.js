import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired
  }
  state = {
    username: '',
    message: ''
  }

  render() {
    return (
      <form
        action="."
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmitMessage({
            username: this.state.username,
            message: this.state.message
          })
          this.setState({ message: '' })
        }}
      >
        <input
          type="text"
          placeholder={'Enter username...'}
          value={this.state.username}
          onChange={e => this.setState({ username: e.target.value })}
        />

        <input
          type="text"
          placeholder={'Enter message...'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <input type="submit" value={'Send'} />
      </form>
    )
  }
}

export default ChatInput
