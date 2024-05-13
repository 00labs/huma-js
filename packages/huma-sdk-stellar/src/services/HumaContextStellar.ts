import { StellarNetwork, POOL_NAME, POOL_TYPE } from '../utils/network'
import { StellarWallet } from './StellarWallet'

export class HumaContextStellar {
  #wallet: StellarWallet

  #network: StellarNetwork

  #poolName: POOL_NAME

  #poolType: POOL_TYPE

  constructor({
    wallet,
    network,
    poolName,
    poolType,
  }: {
    wallet: StellarWallet
    network: StellarNetwork
    poolName: POOL_NAME
    poolType: POOL_TYPE
  }) {
    if (!wallet || !network || !poolName || !poolType) {
      throw new Error('All parameters are required')
    }

    this.#wallet = wallet
    this.#network = network
    this.#poolName = poolName
    this.#poolType = poolType
  }

  get wallet(): StellarWallet {
    return this.#wallet
  }

  set wallet(value: StellarWallet) {
    this.#wallet = value
  }

  get network(): StellarNetwork {
    return this.#network
  }

  set network(value: StellarNetwork) {
    this.#network = value
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
