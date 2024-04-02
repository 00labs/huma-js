import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { ethers } from 'ethers'

export class HumaContext {
  #signer: ethers.Signer

  #provider: JsonRpcProvider | Web3Provider

  #chainId: number

  #poolName: POOL_NAME

  #poolType: POOL_TYPE

  constructor({
    signer,
    provider,
    chainId,
    poolName,
    poolType,
  }: {
    signer: ethers.Signer
    provider: JsonRpcProvider | Web3Provider
    chainId: number
    poolName: POOL_NAME
    poolType: POOL_TYPE
  }) {
    if (!signer || !provider || !chainId || !poolName || !poolType) {
      throw new Error('All parameters are required')
    }

    this.#signer = signer
    this.#provider = provider
    this.#chainId = chainId
    this.#poolName = poolName
    this.#poolType = poolType
  }

  get signer(): ethers.Signer {
    return this.#signer
  }

  set signer(value: ethers.Signer) {
    this.#signer = value
  }

  get provider(): JsonRpcProvider | Web3Provider {
    return this.#provider
  }

  set provider(value: JsonRpcProvider | Web3Provider) {
    this.#provider = value
  }

  get chainId(): number {
    return this.#chainId
  }

  set chainId(value: number) {
    this.#chainId = value
  }

  get poolName(): POOL_NAME {
    return this.#poolName
  }

  set poolName(value: POOL_NAME) {
    this.#poolName = value
  }

  get poolType(): POOL_TYPE {
    return this.#poolType
  }

  set poolType(value: POOL_TYPE) {
    this.#poolType = value
  }
}
