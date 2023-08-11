import { BigNumberish } from 'ethers'

export type RealWorldReceivableInfo<T> = {
  tokenId: BigNumberish
  poolAddress: string
  receivableAmount: BigNumberish
  paidAmount: BigNumberish
  creationDate: BigNumberish
  maturityDate: BigNumberish
  currencyCode: BigNumberish
  tokenURI: string
  metadata: T
}
