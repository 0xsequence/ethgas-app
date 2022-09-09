import { History } from 'history'

import { observable, RootStore } from '~/stores'

export class RouterStore {
  history: History

  location = observable<Location>({
    pathname: '',
    hash: '',
    search: ''
  })

  scrollRetention: { [key: string]: number } = {}

  redirectLocation = observable<string>('')

  constructor(private root: RootStore) {}

  routeToHome = (params?: object) => {
    this.push('/', params)
  }

  routeToRedirectLocation = (params?: object) => {
    const redirectLocation = this.redirectLocation.get()
    if (redirectLocation) {
      this.push(redirectLocation, params)
    } else {
      this.routeToHome()
    }
  }

  setLocation(newState: Location) {
    this.location.set(newState)
  }

  push = (location, params?: object) => {
    this.history.push(location, params)
  }

  replace = (location, params?: object) => {
    this.history.replace(location, params)
  }

  go = destination => {
    this.history.go(destination)
  }

  goBack = () => {
    this.history.goBack()
  }

  goForward = () => {
    this.history.goForward()
  }
}

export const syncHistoryWithStore = (history: History, store: RouterStore) => {
  // Initialize the store
  store.history = history

  // Handle updates from history object
  const handleLocationChange = location => {
    const yPos = store.scrollRetention[location.pathname]
    if (yPos !== undefined) {
      window.setTimeout(() => {
        window.scrollTo(0, yPos)
        delete store.scrollRetention[location.pathname]
      }, 0)
    } else if (window.scrollY !== 0) {
      window.scrollTo(0, 0)
    }
    store.setLocation(location)
  }

  const unsubscribeFromHistory = history.listen(handleLocationChange)

  handleLocationChange(history.location)

  const subscribe = listener => {
    const onStoreChange = () => {
      const rawLocation = { ...store.location }
      listener(rawLocation, history.action)
    }

    // Listen for changes to location state in the store
    const unsubscribeFromStore = store.location.onChange(onStoreChange)

    listener(store.location, history.action)

    return unsubscribeFromStore
  }

  ;(history as any).subscribe = subscribe
  ;(history as any).unsubscribe = unsubscribeFromHistory

  // Return the history object with modified subscribe / unsubscribe function
  // for react-router
  return history
}

interface Location {
  pathname: string
  hash: string
  search: string
  state?: object // router params
}
