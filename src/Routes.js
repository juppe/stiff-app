import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './containers/Home'
import Login from './containers/Login'
import Signup from './containers/Signup'
import Users from './containers/Users'
import Rooms from './containers/Rooms'
import Chat from './containers/Chat'
import NotFound from './containers/NotFound'

import AppliedRoute from './components/AppliedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={Login}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/signup"
      exact
      component={Signup}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/users"
      exact
      component={Users}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/rooms"
      exact
      component={Rooms}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/chat/:room"
      exact
      component={Chat}
      props={childProps}
    />
    <Route component={NotFound} />
  </Switch>
)
