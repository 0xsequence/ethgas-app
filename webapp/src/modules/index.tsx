/* eslint-disable import/order */
import React, { lazy, Suspense } from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'

import { Loading } from '#/ui/Loading'

import { HomeRoute } from './home'
import { DebugRoute } from './debug'

// Route config
const routeConfig = (): IRoute[] => [
  // Home
  {
    path: '/',
    isExact: true,
    component: HomeRoute
  },

  // TODO: do not include any of this code in dist build
  {
    path: '/_debug',
    isExact: false,
    component: DebugRoute,
  }
]

// Types
export interface IRoute {
  path: string
  component: RouteProps['component']
  isExact: boolean
}

// Routing components
const RedirectTo = (to: string) => () => <Redirect to={to} />

export const Routes = React.memo(() => (
  <>
    <Suspense fallback={<Loading />}>
      <Switch>
        {RouteConfig.map(route => {
          return <Route path={route.path} exact={route.isExact} key={route.path} component={route.component} />
        })}
      </Switch>
    </Suspense>
  </>
))

export const RouteConfig = routeConfig()
