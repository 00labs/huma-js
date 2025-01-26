import { ChainEnum } from './chain'

export function getBlockchainConfigFromChain(
  chainEnum: ChainEnum,
): 'POLYGON' | 'ETHEREUM' | 'CELO' | 'SCROLL' {
  switch (chainEnum) {
    case ChainEnum.Celo:
    case ChainEnum.Alfajores:
      return 'CELO'
    case ChainEnum.Polygon:
    case ChainEnum.Mumbai:
      return 'POLYGON'
    case ChainEnum.Goerli:
      return 'ETHEREUM'
    case ChainEnum.Scroll:
    case ChainEnum.ScrollSepolia:
      return 'SCROLL'
    default:
      throw new Error('Invalid chain')
  }
}

export function doesChainSupportNotifi(
  chainEnum: ChainEnum,
  isDev: boolean,
): boolean {
  switch (chainEnum) {
    case ChainEnum.Celo:
    case ChainEnum.Polygon:
    case ChainEnum.Scroll:
      return true
    case ChainEnum.Alfajores:
    case ChainEnum.Mumbai:
    case ChainEnum.Goerli:
    case ChainEnum.ScrollSepolia:
      return isDev
    default:
      return false
  }
}
