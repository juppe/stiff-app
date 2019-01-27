import React from 'react'

class Hello extends React.Component {
  state = {
    api_reponse: ''
  }

  async helloApi() {
    try {
      const response = await fetch('/api/hello')
      const responseJson = await response.json()
      this.setState({
        api_reponse: responseJson.response
      })
    } catch (error) {
      console.error(error)
    }
  }

  callHello = () => {
    this.helloApi()
  }

  componentDidMount() {
    this.helloApi()
  }

  render() {
    const { api_reponse } = this.state

    return (
      <div style={{ marginTop: '20px' }}>
        <div>
          <button onClick={this.callHello}>Test API</button> API RESPONSE:{' '}
          <span style={{ color: 'red' }}>{api_reponse}</span>
        </div>
      </div>
    )
  }
}

export default Hello
