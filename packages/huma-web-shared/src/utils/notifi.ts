import { ChainEnum } from './chain'

export function getBlockchainConfigFromChain(
  chainEnum: ChainEnum,
): 'POLYGON' | 'ETHEREUM' | 'CELO' {
  switch (chainEnum) {
    case ChainEnum.Celo:
    case ChainEnum.Alfajores:
      return 'CELO'
    case ChainEnum.Polygon:
    case ChainEnum.Mumbai:
      return 'POLYGON'
    case ChainEnum.Goerli:
      return 'ETHEREUM'
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
      return true
    case ChainEnum.Polygon:
      return true
    case ChainEnum.Alfajores:
    case ChainEnum.Mumbai:
    case ChainEnum.Goerli:
      return isDev
    default:
      return false
  }
}
