import { BigNumberish } from 'ethers'

export interface RealWorldReceivableInfoBase {
  tokenId: BigNumberish
  poolAddress: string
  receivableAmount: BigNumberish
  paidAmount: BigNumberish
  creationDate: BigNumberish
  maturityDate: BigNumberish
  currencyCode: BigNumberish
  tokenURI: string
}

export interface RealWorldReceivableInfo<T>
  extends RealWorldReceivableInfoBase {
  metadata: T
}
