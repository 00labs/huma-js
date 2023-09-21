/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the function to test after the mock
import axios from 'axios'
import { BigNumber } from 'ethers'
import { request } from 'graphql-request'
import BN from 'bignumber.js'

import { ARWeaveService, BundlrConfig } from '../../src/services/ARWeaveService'

jest.mock('@bundlr-network/client/build/cjs/node/bundlr', () => {
  class Bundlr {
    nodeUrl: string

    currency: string

    signer: any

    providerUrl?: string

    constructor(
      nodeUrl: string,
      currency: string,
      signer: any,
      providerUrl?: string,
    ) {
      this.nodeUrl = nodeUrl
      this.currency = currency
      this.signer = signer
      this.providerUrl = providerUrl
    }

    public get utils() {
      return {
        toAtomic: (amount: number) => BigNumber.from(String(amount * 10 ** 18)),
      }
    }

    ready(): Promise<void> {
      return Promise.resolve()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fund(amount: BigNumber): Promise<any> {
      return Promise.resolve(amount)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    upload(dataStr: string, opts: any): Promise<any> {
      return Promise.resolve({ success: true })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getPrice(size: number): Promise<any> {
      return Promise.resolve(new BN(size))
    }
  }
  return Bundlr
})

jest.mock('graphql-request')
const mockRequest = request as jest.MockedFunction<typeof request>

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('getBundlrNetworkConfig', () => {
  it('should return Goerli config for chainId 5', () => {
    const config = ARWeaveService.getBundlrNetworkConfig(5)
    expect(config).toEqual({
      nodeUrl: 'https://devnet.bundlr.network',
      currency: 'ethereum',
      providerUrl:
        'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    })
  })

  it('should return Mumbai config for chainId 80001', () => {
    const config = ARWeaveService.getBundlrNetworkConfig(80001)
    expect(config).toEqual({
      nodeUrl: 'https://devnet.bundlr.network',
      currency: 'matic',
      providerUrl: 'https://rpc.ankr.com/polygon_mumbai',
    })
  })

  it('should return Matic config for chainId 137', () => {
    const config = ARWeaveService.getBundlrNetworkConfig(137)
    expect(config).toEqual({
      nodeUrl: 'https://node1.bundlr.network',
      currency: 'matic',
    })
  })

  it('should return default config for any other chainId', () => {
    const config = ARWeaveService.getBundlrNetworkConfig(999)
    expect(config).toEqual({
      nodeUrl: '',
      currency: '',
    })
  })
})

describe('getBundlrInstance', () => {
  it('should create a Bundlr instance with the provided config and signer', async () => {
    const config = {
      nodeUrl: 'https://devnet.bundlr.network',
      currency: 'ethereum',
      providerUrl:
        'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    }
    const signer =
      '0000000000000000000000000000000000000000000000000000000000000000'

    const bundlrInstance = await ARWeaveService.getBundlrInstance(
      config,
      signer,
    )

    expect(bundlrInstance).toBeDefined()
    expect(bundlrInstance.currency).toBe(config.currency)
    expect(bundlrInstance.signer).toBe(signer)
  })

  it('should create a Bundlr instance without a providerUrl if not provided in the config', async () => {
    const config = {
      nodeUrl: 'https://bundlr.network',
      currency: 'ethereum',
    }
    const signer =
      '0000000000000000000000000000000000000000000000000000000000000000'

    const bundlrInstance = await ARWeaveService.getBundlrInstance(
      config,
      signer,
    )

    expect(bundlrInstance).toBeDefined()
    expect(bundlrInstance.currency).toBe(config.currency)
    expect(bundlrInstance.signer).toBe(signer)
  })
})

describe('prefundBundlr', () => {
  it('should prefund the Bundlr network if providerUrl is present', async () => {
    const config: BundlrConfig = {
      nodeUrl: 'https://devnet.bundlr.network',
      currency: 'ethereum',
      providerUrl:
        'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    }
    const signer =
      '0000000000000000000000000000000000000000000000000000000000000000'
    const amount = 10

    const result = await ARWeaveService.prefundBundlr(config, signer, amount)

    expect(result).toEqual(BigNumber.from(String(amount * amount ** 18)))
  })

  it('should not prefund the Bundlr network if providerUrl is empty', async () => {
    const config: BundlrConfig = {
      nodeUrl: 'https://devnet.bundlr.network',
      currency: 'ethereum',
      providerUrl: '',
    }
    const signer =
      '0000000000000000000000000000000000000000000000000000000000000000'
    const amount = 10

    const result = await ARWeaveService.prefundBundlr(config, signer, amount)
    expect(result).toEqual(BigNumber.from(String(amount * amount ** 18)))
  })
})

describe('storeData', () => {
  it('should store data on the Bundlr network', async () => {
    console.log = jest.fn()

    const config: BundlrConfig = {
      nodeUrl: 'https://devnet.bundlr.network',
      currency: 'ethereum',
      providerUrl:
        'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    }
    const signer =
      '0000000000000000000000000000000000000000000000000000000000000000'
    // byteLength 15
    const data = { key: 'value' }
    const tags = [{ name: 'tag1', value: 'value1' }]
    const lazyFund = true

    const result = await ARWeaveService.storeData(
      config,
      signer,
      data as any,
      tags,
      lazyFund,
    )

    const priceWithBuffer = new BN(15).multipliedBy(1.2).integerValue()
    expect(console.log).toHaveBeenCalledWith(
      `Funding bundlr with ${priceWithBuffer} ethereum to upload data`,
    )
    expect(result).toEqual({ success: true })
  })
})

describe('queryForMetadata', () => {
  it('should query for metadata from the Arweave network', async () => {
    const chainId = 5
    const sender =
      '0000000000000000000000000000000000000000000000000000000000000000'
    const referenceId = 'ref1'

    // Mock the request function to resolve with specific data
    mockRequest.mockResolvedValue({
      transactions: {
        edges: [
          {
            node: {
              id: 'tx1',
            },
          },
        ],
      },
    })

    const result = await ARWeaveService.queryForMetadata(
      chainId,
      sender,
      referenceId,
    )

    expect(result).toEqual('tx1')
  })
})

describe('fetchMetadataFromUrl', () => {
  it('should fetch data from the provided URL', async () => {
    const mockData = { key: 'value' }
    ;(axios.get as jest.Mock).mockResolvedValue({ data: mockData })

    const data = await ARWeaveService.fetchMetadataFromUrl('https://test.url')

    expect(axios.get).toHaveBeenCalledWith('https://test.url')
    expect(data).toEqual(mockData)
  })

  it('should return null and log an error if the fetch fails', async () => {
    const mockError = new Error('Fetch failed')
    ;(axios.get as jest.Mock).mockRejectedValue(mockError)
    console.error = jest.fn()

    const data = await ARWeaveService.fetchMetadataFromUrl('https://test.url')

    expect(axios.get).toHaveBeenCalledWith('https://test.url')
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching data:',
      mockError,
    )
    expect(data).toBeNull()
  })
})
