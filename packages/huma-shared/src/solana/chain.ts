import { NETWORK_TYPE } from '../utils'

export enum SolanaChainEnum {
  SolanaDevnet = 901,
  SolanaMainnet = 900,
}

export const SOLANA_CHAINS = {
  [SolanaChainEnum.SolanaDevnet]: {
    id: SolanaChainEnum.SolanaDevnet,
    name: 'devnet',
    isTestnet: true,
  },
  [SolanaChainEnum.SolanaMainnet]: {
    id: SolanaChainEnum.SolanaMainnet,
    name: 'mainnet',
    isTestnet: false,
  },
}

export function isSolanaTestnet(chainId: SolanaChainEnum): boolean {
  return chainId !== SolanaChainEnum.SolanaMainnet
}

export function getSolanaNetworkType(chainId: SolanaChainEnum): NETWORK_TYPE {
  return isSolanaTestnet(chainId) ? NETWORK_TYPE.testnet : NETWORK_TYPE.mainnet
}

export function getSolanaExplorerUrl(
  chainId: SolanaChainEnum,
  signature: string,
  type: 'tx' | 'address',
): string | null {
  let cluster = ''
  switch (chainId) {
    case SolanaChainEnum.SolanaDevnet:
      cluster = '?cluster=devnet'
      break
    default:
      break
  }

  if (!signature) {
    return null
  }

  return `https://explorer.solana.com/${type}/${signature}${cluster}`
}
