import { Connection, PublicKey } from '@solana/web3.js'
import { POOL_NAME, SolanaChainEnum } from '@huma-finance/shared'

export class HumaSolanaContext {
  #publicKey: PublicKey

  #connection: Connection

  #chainId: SolanaChainEnum

  #poolName: POOL_NAME

  #heliusApiKey: string | null

  constructor({
    publicKey,
    connection,
    chainId,
    poolName,
    heliusApiKey,
  }: {
    publicKey: PublicKey
    connection: Connection
    chainId: SolanaChainEnum
    poolName: POOL_NAME
    heliusApiKey?: string
  }) {
    if (!publicKey || !connection || !chainId || !poolName) {
      throw new Error('All parameters are required')
    }

    this.#publicKey = publicKey
    this.#connection = connection
    this.#chainId = chainId
    this.#poolName = poolName
    this.#heliusApiKey = heliusApiKey || null
  }

  get publicKey(): PublicKey {
    return this.#publicKey
  }

  set publicKey(value: PublicKey) {
    this.#publicKey = value
  }

  get connection(): Connection {
    return this.#connection
  }

  set connection(value: Connection) {
    this.#connection = value
  }

  get chainId(): SolanaChainEnum {
    return this.#chainId
  }

  set chainId(value: SolanaChainEnum) {
    this.#chainId = value
  }

  get poolName(): POOL_NAME {
    return this.#poolName
  }

  set poolName(value: POOL_NAME) {
    this.#poolName = value
  }

  get heliusApiKey(): string | null {
    return this.#heliusApiKey
  }
}
