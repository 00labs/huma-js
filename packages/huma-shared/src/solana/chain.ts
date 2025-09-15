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
    poolState: '9tNHuAjsx3nZMWrLQrDMX5sKrMvNvZgXEo76U2C8NN3n',
    classicModeConfig: 'CdNvmFR73UoGAEPEgM4wMiVuhNDd3AAtsXhDfgPaECcy',
    classicModeMint: '3kTT1x7H2tKSA6hJXdyZnQqwFrMvse4CoBttcMRuDXzS',
    maxiModeConfig: 'GYUW3PPU5nmBo2ZQ4AmPf3tJXmH3A7q8K3ns7MgsiGAw',
    maxiModeMint: 'CQRBRW29Mk6eiVoet7bgHhvQm6H4aPSdwErxaYkWvp1T',
  },
  [SolanaChainEnum.SolanaMainnet]: {
    id: SolanaChainEnum.SolanaMainnet,
    name: 'mainnet',
    isTestnet: false,
    poolState: 'iFgP2EbzHUZzMjqbjaagJQ8zmn6as3Hw95aVUKm67od',
    classicModeConfig: '3FhoMDyKzQqxtGxnz9DfysfoGQKvgDnSFjoDGgguDCQN',
    classicModeMint: '59obFNBzyTBGowrkif5uK7ojS58vsuWz3ZCvg6tfZAGw',
    maxiModeConfig: 'AcHvC47rpoMAY22CbHRpp7vsAskRyhyZGYQCqdm4BWcH',
    maxiModeMint: 'HUPfpnsaJtJGpJxAPNX1vXah7BgYiQYt1c2JMgMumvPs',
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
