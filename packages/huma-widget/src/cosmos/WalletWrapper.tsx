/* eslint-disable @typescript-eslint/no-use-before-define */
import { Button } from '@mui/material'
import { getDefaultClient } from 'connectkit'
import {
  createClient,
  goerli,
  useAccount,
  useConnect,
  useDisconnect,
  WagmiConfig,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: 'huma widget',
    chains: [goerli],
  }),
)

export function WalletWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig client={client}>
      <Profile />
      {children}
    </WagmiConfig>
  )
}

function Profile() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (isConnected)
    return (
      <div>
        Account: {address}
        <Button variant='contained' onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    )
  return (
    <Button variant='contained' onClick={() => connect()}>
      Connect Wallet
    </Button>
  )
}
