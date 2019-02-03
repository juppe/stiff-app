import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import './Rooms.css'

export default class Rooms extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      roomname: '',
      rooms: []
    }

    this.socket = io('localhost:3001')
  }

  validateForm() {
    return this.state.roomname.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = async event => {
    event.preventDefault()
    this.setState({ isLoading: true })

    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomname: this.state.roomname
        })
      })
      this.setState({ isLoading: false, roomname: '' })
    } catch (e) {
      alert(e.message)
      this.setState({ isLoading: false })
    }
  }

  componentDidMount() {
    this.socket.on('list_rooms', rooms => {
      this.setState({
        rooms: rooms
      })
    })

    this.socket.on('new_room', room => {
      var rooms = this.state.rooms
      rooms.push(room)
      this.setState({
        rooms: rooms
      })
    })
  }

  componentWillUnmount() {
    this.socket.off('list_rooms')
    this.socket.off('new_room')
  }

  render() {
    const roomslist = this.state.rooms.map(u => (
      <li key={u}>
        <Link to={"/chat/"+u}>{u}</Link>
      </li>
    ))

    return (
      <div className="Rooms">
        <h4>Chat rooms</h4>
        <div>
          <ul>{roomslist}</ul>
        </div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="roomname">
            <FormLabel>Create New Room</FormLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.roomname}
              onChange={this.handleChange}
            />
          </FormGroup>
          <LoaderButton
            block
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create new room"
            loadingText="Creating new room…"
          />
        </form>
      </div>
    )
  }
}
