import React, { Component } from 'react'
import './Users.css'

export default class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      users: []
    }
  }

  async listUsers() {
    try {
      const response = await fetch('/api/users')
      const Users = await response.json()

      this.setState({
        users: Users
      })
    } catch (error) {
      console.error(error)
    }
  }

  componentDidMount() {
    this.listUsers()
  }

  render() {
    const { users } = this.state
    const userlist = users.map(u => (
      <li key={u.email}>
        {u.nickname} - ({u.email})
      </li>
    ))

    return (
      <div className="Users">
        <h4>Users</h4>
        <div>
          <ul>{userlist}</ul>
        </div>
      </div>
    )
  }
}
