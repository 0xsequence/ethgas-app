import 'micro-observables/batchingForReactDom'
import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { createStore, StoreProvider, syncHistoryWithStore } from '~/stores'
import App from './App'

// store instance
const rootStore = createStore()

// browser history, synced to the router store
const history = syncHistoryWithStore(createBrowserHistory(), rootStore.router)

ReactDOM.render(
  <>
    <StoreProvider store={rootStore}>
      <Router history={history}>
        <App />
      </Router>
    </StoreProvider>
  </>,
  document.getElementById('app')
)
