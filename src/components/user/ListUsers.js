import React from 'react'

class ListUsers extends React.Component {
  state = {
    users: []
  }

  async ListUsers() {
    try {
      const response = await fetch('/api/users')
      const responseJson = await response.json()

      console.log('RESONSE:' + responseJson)

      this.setState({
        users: responseJson
      })
    } catch (error) {
      console.error(error)
    }
  }

  refreshUsers = () => {
    this.ListUsers()
  }

  componentDidMount() {
    this.ListUsers()
  }

  render() {
    const { users } = this.state
    const userlist = users.map(u => (
      <li key={u.username}>
        {u.username} - {u.fullname}
      </li>
    ))

    return (
      <div style={{ marginTop: '20px' }}>
        <div>
          USERS: <button onClick={this.refreshUsers}>Refresh</button>
        </div>
        <div>{userlist}</div>
      </div>
    )
  }
}

export default ListUsers
