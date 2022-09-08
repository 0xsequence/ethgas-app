import { useEffect } from 'react'

import { SAVED_NETWORK_HANDLE } from '~/constants/localStorageKeys'
import { useStore, useObservable, DataStore, RouterStore } from '~/stores'

// The home route redirects redirect to the previously used network if applicable
// or to another suported network otherwise
export const HomeRoute = () => {
  const dataStore = useStore<DataStore>('data')
  const routerStore = useStore<RouterStore>('router')
  const networks = useObservable(dataStore.networks)

  useEffect(() => {
    dataStore.fetchNetworks()
  }, [])

  useEffect(() => {
    const savedNetworkHandle = localStorage.getItem(SAVED_NETWORK_HANDLE)
    if (savedNetworkHandle) {
      routerStore.push(`/${savedNetworkHandle}`, { replace: true })
    } else if(networks) (
      routerStore.push(`/${networks[0].handle}`)
    )
  }, [networks])

  return null
}