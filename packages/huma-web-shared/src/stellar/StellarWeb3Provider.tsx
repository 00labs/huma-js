import { requestAccess, WatchWalletChanges } from '@stellar/freighter-api'
import React, { useState, createContext, useMemo, useEffect } from 'react'

export interface StellarConnectionContextType {
  address: string
  requestAccessFn: () => void
}

export const StellarConnectionContext =
  createContext<StellarConnectionContextType>({
    address: '',
    requestAccessFn: () => {},
  })

const Watcher = new WatchWalletChanges(1000)

type WCProps<P = {}> = P & {
  children?: React.ReactNode
}

export function StellarWeb3Provider({ children }: WCProps) {
  const [address, setAddress] = useState('')

  useEffect(() => {
    Watcher.watch((watcherResults) => {
      if (watcherResults.address !== address) {
        setAddress(watcherResults.address)
      }
      // document.querySelector('#network').innerHTML = watcherResults.network
    })
    // Only watch once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestAccessFn = async () => {
    const accessObj = await requestAccess()

    if (accessObj.error) {
      setAddress('')
    } else {
      setAddress(accessObj.address)
    }
  }

  const providerValue = useMemo(
    () => ({
      address,
      requestAccessFn,
    }),
    [address],
  )

  return (
    <StellarConnectionContext.Provider value={providerValue}>
      {children}
    </StellarConnectionContext.Provider>
  )
}
