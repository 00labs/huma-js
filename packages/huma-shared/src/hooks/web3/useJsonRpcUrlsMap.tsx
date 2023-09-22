import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react'
import {
  JsonRpcProvider,
  StaticJsonRpcProvider,
} from '@ethersproject/providers'
import { ChainEnum } from '../../utils/chain'
import { JSON_RPC_FALLBACK_ENDPOINTS } from '../../utils/jsonRpcEndpoints'

export type JsonRpcConnectionMap = {
  [chainId: number]: string | string[] | JsonRpcProvider | JsonRpcProvider[]
}

const JsonRpcUrlMapContext = createContext<JsonRpcConnectionMap | undefined>(
  undefined,
)

export function Provider({
  jsonRpcMap,
  children,
}: PropsWithChildren<{ jsonRpcMap?: JsonRpcConnectionMap }>) {
  return (
    <JsonRpcUrlMapContext.Provider value={jsonRpcMap}>
      {children}
    </JsonRpcUrlMapContext.Provider>
  )
}

export default function useJsonRpcUrlsMap(): Record<ChainEnum, string[]> {
  const jsonRpcMap = useContext(JsonRpcUrlMapContext)
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return useMemo(() => toJsonRpcUrlsMap(jsonRpcMap), [jsonRpcMap])
}

function toJsonRpcMap<T>(
  getChainConnections: (chainId: ChainEnum) => T,
): Record<ChainEnum, T> {
  return {
    [ChainEnum.Localhost]: getChainConnections(ChainEnum.Localhost),
    [ChainEnum.Goerli]: getChainConnections(ChainEnum.Goerli),
    [ChainEnum.Polygon]: getChainConnections(ChainEnum.Polygon),
    [ChainEnum.Mumbai]: getChainConnections(ChainEnum.Mumbai),
    [ChainEnum.Alfajores]: getChainConnections(ChainEnum.Alfajores),
    [ChainEnum.Celo]: getChainConnections(ChainEnum.Celo),
  }
}

function getChainConnections(
  connectionMap: JsonRpcConnectionMap | undefined,
  chainId: ChainEnum,
): (string | JsonRpcProvider)[] {
  const value = connectionMap?.[chainId]
  return (Array.isArray(value) ? value : [value])
    .filter((value): value is string | JsonRpcProvider => Boolean(value))
    .concat(...JSON_RPC_FALLBACK_ENDPOINTS[chainId])
}

export function toJsonRpcConnectionMap(
  connectionMap?: JsonRpcConnectionMap,
): Record<ChainEnum, JsonRpcProvider> {
  function getJsonRpcProvider(chainId: ChainEnum): JsonRpcProvider {
    const [connection] = getChainConnections(connectionMap, chainId)
    return JsonRpcProvider.isProvider(connection)
      ? connection
      : new StaticJsonRpcProvider(connection, Number(chainId))
  }
  return toJsonRpcMap(getJsonRpcProvider)
}

export function toJsonRpcUrlMap(
  connectionMap?: JsonRpcConnectionMap,
): Record<ChainEnum, string> {
  function getJsonRpcUrl(chainId: ChainEnum): string {
    const [connection] = getChainConnections(connectionMap, chainId)
    return JsonRpcProvider.isProvider(connection)
      ? connection.connection.url
      : connection
  }
  return toJsonRpcMap(getJsonRpcUrl)
}

export function toJsonRpcUrlsMap(
  connectionMap?: JsonRpcConnectionMap,
): Record<ChainEnum, string[]> {
  function getJsonRpcUrls(chainId: ChainEnum): string[] {
    const connections = getChainConnections(connectionMap, chainId)
    return connections.map((connection) =>
      JsonRpcProvider.isProvider(connection)
        ? connection.connection.url
        : connection,
    )
  }
  return toJsonRpcMap(getJsonRpcUrls)
}
