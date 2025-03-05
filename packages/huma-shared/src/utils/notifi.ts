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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isDev: boolean,
): boolean {
  switch (chainEnum) {
    default:
      return false
  }
}
