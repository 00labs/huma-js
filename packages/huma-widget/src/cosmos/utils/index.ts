/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/**
 * Updates cy.visit() to include an injected window.ethereum provider.
 */
import { Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers, Wallet } from 'ethers'
import { deepCopy } from 'ethers/lib/utils'

export enum ChainEnum {
  Goerli = 5,
  Mumbai = 80001,
}

class MetamaskBridge extends Eip1193Bridge {
  private walletAddress: string
  private chainId: number

  constructor(
    signer: ethers.Signer,
    provider: ethers.providers.Provider,
    walletAddress: string,
    chainId = 5,
  ) {
    super(signer, provider)
    this.walletAddress = walletAddress
    this.chainId = chainId
  }

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
      const chainIdHex = ethers.utils.hexlify(this.chainId)
      if (isCallbackForm) {
        callback(null, { result: chainIdHex })
      } else {
        return Promise.resolve(chainIdHex)
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
      // to gasLimit which makes send transaction error.
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

export const getProvider = (chainId = ChainEnum.Goerli) => {
  const rpcUrlMap: { [x: number]: { name: string; url: string } } = {
    [ChainEnum.Goerli]: {
      name: 'Goerli',
      url: `https://goerli.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`,
    },
    [ChainEnum.Mumbai]: {
      name: 'Mumbai',
      url: `https://polygon-mumbai.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`,
    },
  }
  return new JsonRpcProvider(rpcUrlMap[chainId].url, {
    name: rpcUrlMap[chainId].name,
    chainId,
  })
}

export const getInjectedMetamask = (
  testPrivateKey: string,
  chainId = ChainEnum.Goerli,
) => {
  const TEST_ADDRESS_NEVER_USE = new Wallet(testPrivateKey).address
  const provider = getProvider(chainId)
  const signer = new Wallet(testPrivateKey, provider)
  return new MetamaskBridge(signer, provider, TEST_ADDRESS_NEVER_USE, chainId)
}

export const getSigner = (
  testPrivateKey: string,
  chainId = ChainEnum.Goerli,
) => {
  return new Wallet(testPrivateKey, getProvider(chainId))
}
