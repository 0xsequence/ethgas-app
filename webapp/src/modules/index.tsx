/* eslint-disable import/order */
import React from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'

import { ChartRoute } from './chart'
import { HomeRoute } from './HomeRoute'

// Route config
const routeConfig = (): IRoute[] => [
  {
    path: '/',
    isExact: true,
    component: HomeRoute
  },
  {
    path: '/:networkId',
    isExact: true,
    component: ChartRoute
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
    {/* <Suspense fallback={<Loading />}> */}
    <Switch>
      {RouteConfig.map(route => {
        return <Route path={route.path} exact={route.isExact} key={route.path} component={route.component} />
      })}
    </Switch>
    {/* </Suspense> */}
  </>
))

export const RouteConfig = routeConfig()
