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

const Watcher = new WatchWalletChanges()

type WCProps<P = {}> = P & {
  children?: React.ReactNode
}

export function StellarWeb3Provider({ children }: WCProps) {
  const [address, setAddress] = useState('')

  // Watch for changes in the Freighter wallet address on a 3 second interval by default.
  // Need this to catch users switching wallet addresses in the extension and for auto-connecting
  // existing users.
  // Documentation: https://docs.freighter.app/docs/guide/usingfreighterwebapp/#watchwalletchanges
  useEffect(() => {
    Watcher.watch((watcherResults) => {
      if (watcherResults.address !== address) {
        setAddress(watcherResults.address)
      }
    })
    // Only watch once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // This callback function is passed in the context and can be used
  // to connect with a Freighter wallet.
  // It will update the address state with the connected wallet address.
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
