import { Observable, Unsubscriber } from 'micro-observables'
import React, { useContext, useState, useEffect, useMemo } from 'react'

import { env } from '~/env'
import { ETHGasAPI } from '~/lib/apiclient'

import { AppStore } from './AppStore'
import { DataStore } from './DataStore'
import { RouterStore, syncHistoryWithStore } from './RouterStore'

export { AppStore, RouterStore, DataStore }

export class RootStore {
  api = new ETHGasAPI(env.apiServer)

  app = new AppStore(this)
  router = new RouterStore(this)
  data = new DataStore(this)
}

export const createStore = () => new RootStore()

export const StoreContext = React.createContext<RootStore | null>(null)

export const StoreProvider = ({ store, children }: { store: RootStore; children: React.ReactNode }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useRootStore(): RootStore {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('store cannot be null! check your <StoreProvider ...>')
  }
  return store
}

export function useAPI(): ETHGasAPI {
  const rootStore = useRootStore()
  return rootStore.api
}

// useStore hook will access the rootStore instance from the application context and return
// the specific sub-store. You can set the `observe` parameter to observe changes for all fields,
// specific fields or none of the fields, so that React components that use the `useStore` are
// able to automatically re-render from state changes.
//
// observe: when the argument is undefined, it will watch all observable fields of the store. In other words
// if you don't specify the observe argument's functionality, the default is to observe the entire store.
//
// observe: when null, it won't observe any of the fields in the store.
//
// observe: by passing a function that returns an array of observable fields, this hook will only watch
// and re-render whenever one of those specific observables changes. This is handy as a performance optimization.
export function useStore<T>(storeKey: keyof RootStore, observe?: null | ((store: T) => Observable<any>[])): T {
  const store = useRootStore()[storeKey] as any

  if (observe === null) {
    return store as T
  }

  let observables: Observable<any>[]

  if (observe === undefined) {
    // eslint-disable-next-line
    observables = useMemo<Observable<any>[]>(() => {
      const v: Observable<any>[] = []
      const keys = Object.keys(store)
      for (let i = 0; i < keys.length; i++) {
        if (store[keys[i]] instanceof Observable) {
          v.push(store[keys[i]])
        }
      }
      return v
    }, [store])
  } else {
    observables = observe(store)
  }

  if (observables.length === 0) {
    return store as T
  }

  // eslint-disable-next-line
  const [, forceRender] = useState({})

  // eslint-disable-next-line
  useEffect(() => {
    const unsubscribers: Unsubscriber[] = []

    for (let i = 0; i < observables.length; i++) {
      unsubscribers.push(
        observables[i].onChange(() => {
          forceRender({})
        })
      )
    }

    return () => {
      setTimeout(() => {
        for (let i = 0; i < unsubscribers.length; i++) {
          unsubscribers[i]()
        }
      }, 0)
    }
  }, observables)

  return store as T
}

export function useObservable<T>(observable: Observable<T>): T {
  const [, forceRender] = useState({})

  useEffect(() => {
    const unsubscribe = observable.onChange(() => forceRender({}))
    // return unsubscribe
    return () => {
      setTimeout(() => unsubscribe(), 0)
    }
  }, [observable])

  return observable.get()
}

export function useMemoizedObservable<T>(compute: () => Observable<T>, deps: any[] = []): T {
  return useObservable(useMemo(compute, deps))
}

export function useComputedObservable<T>(compute: () => T, deps: any[] = []): T {
  return useMemoizedObservable(() => Observable.compute(compute), deps)
}

export { Observable, observable } from 'micro-observables'
export { syncHistoryWithStore }
