import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { Box, Button, styled } from '~/style'
import { Components } from './Components'
import { Playground } from './Playground'
import { Typography } from './Typography'

const nav = () => [
  { path: '', component: Index },
  { path: 'components', component: Components },
  { path: 'playground', component: Playground },
  { path: 'typography', component: Typography }
]

export const DebugRoute = () => {
  const route = useRouteMatch()

  return (
    <Box pt={20}>
      <Box sx={{ fontWeight: 'bold', textAlign: 'center' }} mb={20}>
        Dev Debug Tools
      </Box>

      <Switch>
        {nav().map((n, i) => (
          <Route key={i} path={`${route.path}/${n.path}`} exact={true} component={n.component} />
        ))}
      </Switch>
    </Box>
  )
}

const Index = () => {
  const route = useRouteMatch()

  return (
    <Box sx={{ width: '400px' }} mx="auto">
      {nav()
        .slice(1)
        .map((n, i) => (
          <NavButton key={i} to={`${route.url}/${n.path}`}>
            {n.path}
          </NavButton>
        ))}
    </Box>
  )
}

const NavButton = styled(Button)`
  width: 100%;
  padding: 5px;
  margin: 5px 0;
  color: white;
  border: 1px solid ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.highlight};
    border: 1px solid ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.lightgrey};
  }
`
