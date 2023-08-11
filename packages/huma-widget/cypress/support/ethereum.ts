/**
 * Updates cy.visit() to include an injected window.ethereum provider.
 */
import { Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge'
import { ethers } from 'ethers'
import { deepCopy } from 'ethers/lib/utils'

import {
  addressForApprove,
  addressForTx,
  provider,
  signerForApprove,
  signerForTx,
} from '../utils'

class MetamaskBridge extends Eip1193Bridge {
  private walletAddress: string

  constructor(
    signer: ethers.Signer,
    provider: ethers.providers.Provider,
    walletAddress: string,
  ) {
    super(signer, provider)
    this.walletAddress = walletAddress
  }

  chainId = 5

  async sendAsync(...args: any[]) {
    console.debug('sendAsync called', ...args)
    return this.send(...args)
  }
  async send(...args: any[]) {
    console.debug('send called', ...args)
    const isCallbackForm =
      typeof args[0] === 'object' && typeof args[1] === 'function'
    let callback
    let method
    let params
    if (isCallbackForm) {
      callback = args[1]
      method = args[0].method
      params = args[0].params
    } else {
      method = args[0]
      params = args[1]
    }
    if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
      if (isCallbackForm) {
        callback({ result: [this.walletAddress] })
      } else {
        return Promise.resolve([this.walletAddress])
      }
    }
    if (method === 'eth_chainId') {
      if (isCallbackForm) {
        callback(null, { result: '0x5' })
      } else {
        return Promise.resolve('0x5')
      }
    }
    // Eip1193Bridge only supports eth_sign
    // address is the first param for eth_sign
    if (method === 'personal_sign') {
      method = 'eth_sign'
      const [data, address] = deepCopy(params)
      params[0] = address
      params[1] = data
    }
    try {
      // Please refer to: https://github.com/ethers-io/ethers.js/issues/1683
      // If from is present on eth_call it errors, removing it makes the library set
      // from as the connected wallet which works fine
      if (params && params.length && method === 'eth_call') {
        if (params[0].from) {
          delete params[0].from
        }
        if (params[0].gas) {
          delete params[0].gas
        }
      }

      let result
      // For sending a transaction if we call send it will error
      // as it wants gasLimit in sendTransaction but hexlify sets the property gas
      // to gasLimit which makes sensd transaction error.
      // This have taken the code from the super method for sendTransaction and altered
      // it slightly to make it work with the gas limit issues.
      if (
        params &&
        params.length &&
        params[0].from &&
        method === 'eth_sendTransaction'
      ) {
        // Hexlify will not take gas, must be gasLimit, set this property to be gasLimit
        params[0].gasLimit = params[0].gas
        delete params[0].gas
        // If from is present on eth_sendTransaction it errors, removing it makes the library set
        // from as the connected wallet which works fine
        delete params[0].from
        const req = ethers.providers.JsonRpcProvider.hexlifyTransaction(
          params[0],
        )
        // Hexlify sets the gasLimit property to be gas again and send transaction requires gasLimit
        req.gasLimit = req.gas
        delete req.gas
        // Send the transaction
        const tx = await this.signer.sendTransaction(req)
        result = tx.hash
      } else {
        // All other transactions the base class works for
        result = await super.send(method, params)
      }
      console.debug('result received', method, params, result)
      if (isCallbackForm) {
        callback(null, { result })
      } else {
        return result
      }
    } catch (error) {
      console.log(error)
      if (isCallbackForm) {
        callback(error, null)
      } else {
        throw error
      }
    }
  }
}

export const injectedForTx = new MetamaskBridge(
  signerForTx,
  provider,
  addressForTx,
)

export const injectedForApprove = new MetamaskBridge(
  signerForApprove,
  provider,
  addressForApprove,
)
