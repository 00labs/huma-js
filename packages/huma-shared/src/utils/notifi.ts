import { ChainEnum } from './chain'

export function getNotifiDappId(isDev: boolean): string {
  return isDev ? 'humadapp' : 'humafinanceprod'
}

export function getBlockchainConfigFromChain(
  chainEnum: ChainEnum,
): 'POLYGON' | 'ETHEREUM' {
  switch (chainEnum) {
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
  account: string,
): boolean {
  switch (chainEnum) {
    case ChainEnum.Polygon:
      return true
    case ChainEnum.Mumbai:
    case ChainEnum.Goerli:
      return (
        isDev ||
        [
          '0x1fA2bE830cCb0f6930b9095559C25f64DD6A2146',
          '0xE0Dc47a5735F784972EBD2E6662B62cc37929A63',
          '0xdA8241Ee675D9f7d40fefcFC29E749d970C44c17',
          '0x808E2154028cA8623E2704119df0aE8e39D87a8E',
          '0xEf9a89cd4169b71CCD867dc7d374247F6F3Ed8F3',
          '0xCb269B3A441b8cb95dEa7d803e8Ff5Fbd3154D65',
        ]
          .map((address) => address.toLowerCase())
          .includes(account.toLowerCase())
      )
    default:
      return false
  }
}
