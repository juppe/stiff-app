import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { UserContext } from './UserContext'

const RouteAuthenticated = props => {
  const userContext = useContext(UserContext)
  const isAuthenticated = userContext.isAuthenticated

  const { component: Component, ...rest } = props

  return (
    <Route
      {...rest}
      render={props => {
        return isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login'
            }}
          />
        )
      }}
    />
  )
}

export default RouteAuthenticated
