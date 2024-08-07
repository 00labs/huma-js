import { JsonRpcProvider } from '@ethersproject/providers'
import {
  ChainEnum,
  JsonRpcConnector,
  MetaMaskConnectionError,
  supportedChainId,
  WalletConnectPopup,
  WalletConnectQR,
} from '@huma-finance/shared'
import {
  initializeConnector,
  Web3ReactHooks,
  Web3ReactProvider,
} from '@web3-react/core'
import { EIP1193 } from '@web3-react/eip1193'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector, Provider as Eip1193Provider } from '@web3-react/types'
import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react'

import { useAsyncError } from '../useAsyncError'
import { Provider as ConnectorsProvider } from './useConnectors'
import {
  JsonRpcConnectionMap,
  Provider as JsonRpcUrlMapProvider,
  toJsonRpcConnectionMap,
  toJsonRpcUrlMap,
} from './useJsonRpcUrlsMap'

const DEFAULT_CHAIN_ID = ChainEnum.Polygon

type Web3ReactConnector<T extends Connector = Connector> = [T, Web3ReactHooks]

interface Web3ReactConnectors {
  user: Web3ReactConnector<EIP1193 | JsonRpcConnector> | undefined
  metaMask: Web3ReactConnector<MetaMask>
  walletConnect: Web3ReactConnector<WalletConnectPopup>
  walletConnectQR: Web3ReactConnector<WalletConnectQR>
  network: Web3ReactConnector<Network>
}

export interface ProviderProps {
  defaultChainId?: ChainEnum
  jsonRpcUrlMap?: JsonRpcConnectionMap
  provider: Eip1193Provider | JsonRpcProvider
}

function initializeWeb3ReactConnector<T extends Connector, P extends object>(
  Constructor: { new (options: P): T },
  options: Omit<P, 'actions'>,
): Web3ReactConnector<T> {
  const [connector, hooks] = initializeConnector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (actions) => new Constructor({ actions, ...options } as any),
  )
  if (options && 'provider' in options) {
    // Short-circuit provider selection to improve performance and testability.
    // Without doing so, provider will be unavailable for a frame.
    hooks.useProvider = (() =>
      (options as Record<'provider', unknown>)
        .provider) as typeof hooks.useProvider
  }
  return [connector, hooks]
}

function useWeb3ReactConnectors({
  defaultChainId,
  provider,
  jsonRpcUrlMap,
}: ProviderProps) {
  const [urlMap, connectionMap] = useMemo(
    () => [
      toJsonRpcUrlMap(jsonRpcUrlMap),
      toJsonRpcConnectionMap(jsonRpcUrlMap),
    ],
    [jsonRpcUrlMap],
  )

  const throwAsync = useAsyncError()

  const user = useMemo(() => {
    if (!provider) return
    if (JsonRpcProvider.isProvider(provider)) {
      // eslint-disable-next-line consistent-return
      return initializeWeb3ReactConnector(JsonRpcConnector, {
        provider,
        onError: console.error,
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (JsonRpcProvider.isProvider((provider as any).provider)) {
      throw new Error(
        'Eip1193Bridge is experimental: pass your ethers Provider directly',
      )
    } else {
      // eslint-disable-next-line consistent-return
      return initializeWeb3ReactConnector(EIP1193, {
        provider,
        onError: console.error,
      })
    }
  }, [provider])
  const metaMask = useMemo(
    () =>
      initializeWeb3ReactConnector(MetaMask, {
        onError: () => {
          throwAsync(new MetaMaskConnectionError())
        },
      }),
    [throwAsync],
  )
  const walletConnect = useMemo(
    () =>
      initializeWeb3ReactConnector(WalletConnectPopup, {
        options: { rpc: urlMap },
        defaultChainId,
        onError: console.error,
      }),
    [defaultChainId, urlMap],
  )
  const walletConnectQR = useMemo(
    () =>
      initializeWeb3ReactConnector(WalletConnectQR, {
        options: { rpc: urlMap },
        defaultChainId,
        onError: console.error,
      }),
    [defaultChainId, urlMap],
  )
  const network = useMemo(
    () =>
      initializeWeb3ReactConnector(Network, {
        urlMap: connectionMap,
        defaultChainId,
      }),
    [connectionMap, defaultChainId],
  )

  return useMemo<Web3ReactConnectors>(
    () => ({
      user,
      metaMask,
      walletConnect,
      walletConnectQR,
      network,
    }),
    [metaMask, network, user, walletConnect, walletConnectQR],
  )
}

export function Provider({
  defaultChainId: chainId = ChainEnum.Polygon,
  jsonRpcUrlMap,
  provider,
  children,
}: PropsWithChildren<ProviderProps>) {
  const defaultChainId = useMemo(() => {
    if (!supportedChainId(chainId)) {
      console.warn(
        `Unsupported chainId: ${chainId}. Falling back to ${DEFAULT_CHAIN_ID} (${ChainEnum[DEFAULT_CHAIN_ID]}).`,
      )
      return DEFAULT_CHAIN_ID
    }
    return chainId
  }, [chainId])

  const web3ReactConnectors = useWeb3ReactConnectors({
    provider,
    jsonRpcUrlMap,
    defaultChainId,
  })

  const key = useRef(0)
  const prioritizedConnectors = useMemo(() => {
    // Re-key Web3ReactProvider before rendering new connectors, as it expects connectors to be
    // referentially static.
    key.current += 1

    const prioritizedConnectors: (Web3ReactConnector | null | undefined)[] = [
      web3ReactConnectors.user,
      web3ReactConnectors.metaMask,
      web3ReactConnectors.walletConnect,
      web3ReactConnectors.walletConnectQR,
      web3ReactConnectors.network,
    ]
    return prioritizedConnectors.filter(
      (connector): connector is Web3ReactConnector => Boolean(connector),
    )
  }, [web3ReactConnectors])

  const connectors = useMemo(
    () => ({
      user: web3ReactConnectors.user?.[0],
      metaMask: web3ReactConnectors.metaMask[0],
      walletConnect: web3ReactConnectors.walletConnect[0],
      walletConnectQR: web3ReactConnectors.walletConnectQR[0],
      network: web3ReactConnectors.network[0],
    }),
    [web3ReactConnectors],
  )

  const shouldEagerlyConnect = provider === undefined // !== null
  useEffect(() => {
    // Ignore any errors during connection so they do not propagate to the widget.
    if (connectors.user) {
      connectors.user.activate().catch(() => undefined)
      return
    }
    if (shouldEagerlyConnect) {
      const eagerConnectors = [connectors.metaMask, connectors.walletConnect]
      eagerConnectors.forEach((connector) =>
        connector.connectEagerly().catch(() => undefined),
      )
    }
    connectors.network.activate().catch(() => undefined)
  }, [
    connectors.metaMask,
    connectors.network,
    connectors.user,
    connectors.walletConnect,
    shouldEagerlyConnect,
  ])

  return (
    <Web3ReactProvider connectors={prioritizedConnectors} key={key.current}>
      <JsonRpcUrlMapProvider jsonRpcMap={jsonRpcUrlMap}>
        <ConnectorsProvider connectors={connectors}>
          {children}
        </ConnectorsProvider>
      </JsonRpcUrlMapProvider>
    </Web3ReactProvider>
  )
}
