import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Logout from './components/Logout'
import Signup from './components/Signup'
import Users from './components/Users'
import Rooms from './components/Rooms'
import Chat from './components/Chat'
import NotFound from './components/NotFound'

import RouteAuthenticated from './RouteAuthenticated'

export default () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/logout" exact component={Logout} />
    <Route path="/signup" exact component={Signup} />
    <RouteAuthenticated path="/users" exact component={Users} />
    <RouteAuthenticated path="/rooms" exact component={Rooms} />
    <RouteAuthenticated path="/chat" exact component={Chat} />
    <Route component={NotFound} />
  </Switch>
)
