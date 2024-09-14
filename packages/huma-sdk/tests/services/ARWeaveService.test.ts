/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the function to test after the mock
import axios from 'axios'
import { BigNumber } from 'ethers'
import { request } from 'graphql-request'
import BN from 'bignumber.js'

import {
  ARWeaveService,
  IrysConstructorArgs,
} from '../../src/services/ARWeaveService'

jest.mock('@irys/sdk', () => {
  class Irys {
    network: string

    token: string

    key: any

    providerUrl?: string

    constructor(data: {
      network: string
      token: string
      key: any
      config?: {
        providerUrl?: string
      }
    }) {
      this.network = data.network
      this.token = data.token
      this.key = data.key
      this.providerUrl = data?.config?.providerUrl
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
  return Irys
})

jest.mock('graphql-request')
const mockRequest = request as jest.MockedFunction<typeof request>

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('getIrysNetworkConfig', () => {
  it('should return Mumbai config for chainId 80001', () => {
    const config = ARWeaveService.getIrysNetworkConfig(80002)
    expect(config).toEqual({
      network: 'devnet',
      token: 'matic',
      config: {
        providerUrl: 'https://rpc.ankr.com/polygon_amoy',
      },
    })
  })

  it('should return Matic config for chainId 137', () => {
    const config = ARWeaveService.getIrysNetworkConfig(137)
    expect(config).toEqual({
      network: 'mainnet',
      token: 'matic',
    })
  })

  it('should return default config for any other chainId', () => {
    const config = ARWeaveService.getIrysNetworkConfig(999)
    expect(config).toEqual({
      network: '',
      token: '',
    })
  })
})

describe('getIrysInstance', () => {
  it('should create a Irys instance with the provided config and signer', async () => {
    const config = {
      network: 'mainnet',
      token: 'matic',
    }
    const signer =
      '0000000000000000000000000000000000000000000000000000000000000000'

    const irysInstance = await ARWeaveService.getIrysInstance(config, signer)

    expect(irysInstance).toBeDefined()
    expect(irysInstance.token).toBe(config.token)
  })
})

describe('prefundIrys', () => {
  it('should prefund the Irys network if providerUrl is present', async () => {
    const config: IrysConstructorArgs = {
      network: 'devnet',
      token: 'matic',
      config: {
        providerUrl: 'https://rpc.ankr.com/polygon_amoy',
      },
    }
    const signer =
      '0000000000000000000000000000000000000000000000000000000000000000'
    const amount = 10

    const result = await ARWeaveService.prefundIrys(config, signer, amount)

    expect(result).toEqual(BigNumber.from(String(amount * amount ** 18)))
  })
})

describe('storeData', () => {
  it('should store data on the Bundlr network', async () => {
    console.log = jest.fn()

    const config: IrysConstructorArgs = {
      network: 'mainnet',
      token: 'matic',
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
      `Funding irys with ${priceWithBuffer} matic to upload data`,
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

    expect(axios.get).toHaveBeenCalledWith('https://test.url', {
      withCredentials: false,
    })
    expect(data).toEqual(mockData)
  })

  it('should return null and log an error if the fetch fails', async () => {
    const mockError = new Error('Fetch failed')
    ;(axios.get as jest.Mock).mockRejectedValue(mockError)
    console.error = jest.fn()

    const data = await ARWeaveService.fetchMetadataFromUrl('https://test.url')

    expect(axios.get).toHaveBeenCalledWith('https://test.url', {
      withCredentials: false,
    })
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching data:',
      mockError,
    )
    expect(data).toBeNull()
  })
})
