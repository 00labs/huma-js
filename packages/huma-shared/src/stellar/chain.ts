export enum StellarChainEnum {
  StellarMainnet = 1500,
  StellarTestnet = 1501,
}

export const STELLAR_CHAINS = {
  [StellarChainEnum.StellarTestnet]: {
    id: StellarChainEnum.StellarTestnet,
    name: 'testnet',
    isTestnet: true,
  },
  [StellarChainEnum.StellarMainnet]: {
    id: StellarChainEnum.StellarMainnet,
    name: 'mainnet',
    isTestnet: false,
  },
}

export function isStellarTestnet(chainId: StellarChainEnum): boolean {
  return chainId !== StellarChainEnum.StellarMainnet
}

export function getStellarExplorerUrl(
  chainId: StellarChainEnum,
  signature: string,
): string | null {
  let network = ''
  switch (chainId) {
    case StellarChainEnum.StellarTestnet:
      network = 'testnet'
      break
    default:
      network = 'public'
      break
  }

  if (!signature) {
    return null
  }

  return `https://stellar.expert/explorer/${network}/search?term=${signature}`
}
