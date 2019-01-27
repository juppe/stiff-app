import React from 'react'

import Hello from './Hello'
import Chat from '../chat/Chat'
import CreateUser from '../user/CreateUser'
import ListUsers from '../user/ListUsers'

const App = () => (
  <div>
    <Hello />
    <Chat />
    <CreateUser />
    <ListUsers />
  </div>
)

export default App
