import React from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader/root'
import { withRouter } from 'react-router'
import { Routes } from '~/modules'
import { Reset, ThemeProvider, theme, Styled } from '~/style'

const App = () => {
  return (
    <>
      <Helmet>
        <title>ethgas.app</title>

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;800&display=swap"
        />
      </Helmet>

      <ThemeProvider theme={theme}>
        <Styled.root>
          <Routes />
        </Styled.root>
        <Reset />
      </ThemeProvider>
    </>
  )
}

export default hot(withRouter(App))
