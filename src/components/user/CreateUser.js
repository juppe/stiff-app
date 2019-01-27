import React from 'react'

class CreateUser extends React.Component {
  constructor() {
    super()

    this.state = {
      username: '',
      fullname: '',
      response: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const username = this.state.username
    const fullname = this.state.fullname

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          fullname: fullname
        })
      })
      const responseJson = await response.json()
      this.setState({
        response: responseJson.response,
        username: '',
        fullname: ''
      })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { username, fullname, response } = this.state

    return (
      <div style={{ marginTop: '20px' }}>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="username">Enter username</label>
            <input
              name="username"
              type="text"
              onChange={this.handleChange}
              value={username}
            />
            <br />
            <label htmlFor="fullname">Enter your full name</label>
            <input
              name="fullname"
              fullname="text"
              onChange={this.handleChange}
              value={fullname}
            />
            <br />
            <button>Create user</button>
          </form>
        </div>
        <div>
          API RESPONSE: <span style={{ color: 'red' }}>{response}</span>
        </div>
      </div>
    )
  }
}

export default CreateUser
