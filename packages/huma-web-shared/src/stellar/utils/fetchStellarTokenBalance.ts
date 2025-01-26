import { StellarChainInfo } from '@huma-finance/shared'
import {
  rpc,
  Contract,
  Address,
  scValToNative,
  TransactionBuilder,
  BASE_FEE,
  Account,
} from '@stellar/stellar-sdk'

export async function fetchStellarTokenBalance(
  chainMetadata: StellarChainInfo,
  tokenAddress: string,
  accountAddress: string,
  sourceAddress?: string,
) {
  try {
    const server = new rpc.Server(chainMetadata.rpc)

    // Create a Contract instance
    const contract = new Contract(tokenAddress)

    // Prepare the parameters for the balance function call
    const accountParam = Address.fromString(accountAddress).toScVal()

    // Simulate the contract call
    const account = new Account(sourceAddress ?? accountAddress, '0')
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: chainMetadata.networkPassphrase,
    })
      .addOperation(contract.call('balance', accountParam))
      .setTimeout(30)
      .build()

    const result = await server.simulateTransaction(transaction)

    // Extract and return the balance

    if (!('result' in result) || !result.result?.retval) {
      throw new Error('Failed to fetch token balances due to simulation fail')
    }

    const balance = scValToNative(result.result.retval)
    return balance
  } catch (error) {
    console.error('Error fetching token balance:', error)
    throw error
  }
}
