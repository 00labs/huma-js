/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChainEnum,
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
} from '@huma-finance/shared'
import { request } from 'graphql-request'

import { BigNumber, ethers } from 'ethers'
import { ReceivableService } from '../../src/services/ReceivableService'
import { getChainIdFromSignerOrProvider } from '../../src/utils/chain'
import { getRealWorldReceivableContract } from '../../src/helpers/RealWorldReceivableContractHelper'
import { getDefaultGasOptions } from '../../src/utils/maticGasStation'
import { ARWeaveService } from '../../src/services/ARWeaveService'
import { SubgraphService } from '../../src/services/SubgraphService'

jest.mock('../../src/utils/chain', () => ({
  getChainIdFromSignerOrProvider: jest.fn(),
}))
jest.mock('../../src/services/ARWeaveService', () => ({
  ARWeaveService: {
    queryForMetadata: jest.fn(),
    getBundlrNetworkConfig: jest.fn(),
    storeData: jest.fn(),
    fetchMetadataFromUrl: jest.fn(),
    getURIFromARWeaveId: jest.fn(),
  },
}))
jest.mock('../../src/helpers/RealWorldReceivableContractHelper', () => ({
  getRealWorldReceivableContract: jest.fn(),
}))
jest.mock('../../src/utils/maticGasStation', () => ({
  getDefaultGasOptions: jest.fn(),
}))
jest.mock('../../src/services/SubgraphService', () => ({
  SubgraphService: {
    getRWReceivableInfo: jest.fn(),
    getRWReceivableInfoTotalCount: jest.fn(),
  },
}))
jest.mock('graphql-request', () => ({
  gql: jest.fn(),
  request: jest.fn(),
}))

describe('declareReceivablePaymentByReferenceId', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw if no chain id is found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(undefined)
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    try {
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe('No Chain Id found')
    }
  })

  it('should throw if ARWeave Id is null', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(null)
    ;(request as jest.Mock).mockResolvedValue({ transactions: {} })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0xNull'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    try {
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        'Could not find ARWeave Id for this reference Id. Please check your logs for more details.',
      )
    }
  })

  it('should throw if No receivable subgraph exists for this chain', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(1)
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    try {
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        'No receivable subgraph exists for this chain',
      )
    }
  })

  it('should throw if No receivables is returned by subgraph', async () => {
    console.log = jest.fn()
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(request as jest.Mock).mockResolvedValue({})

    const signer = {
      getAddress: jest.fn().mockResolvedValue('no-receivables-address'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    await expect(
      ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      ),
    ).rejects.toThrow(
      'Could not find tokenId for this ARWeave Id. Please check your logs for more details.',
    )
  })

  it('should throw if receivables are empty returned by subgraph', async () => {
    console.log = jest.fn()
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(request as jest.Mock).mockResolvedValue({ receivables: [] })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('no-receivables-address'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    await expect(
      ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      ),
    ).rejects.toThrow(
      'Could not find tokenId for this ARWeave Id. Please check your logs for more details.',
    )
  })

  it('should throw if receivables have more than one element returned by subgraph', async () => {
    console.log = jest.fn()
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(request as jest.Mock).mockResolvedValue({
      rwreceivables: ['receivable1', 'receivable2'],
    })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('no-receivables-address'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    try {
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        `This owner has multiple receivables with the same URI, so we don't know which to use. Please burn 
        unnecessary receivables. If paying, you can pay the correct token manually using declareReceivablePaymentByTokenId`,
      )
    }
  })

  it('should throw if not find RealWorldReceivable contract', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(request as jest.Mock).mockResolvedValue({
      rwreceivables: [{ tokenId: 12 }],
    })
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue(undefined)

    const signer = {
      getAddress: jest.fn().mockResolvedValue('no-receivables-address'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    try {
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        `Could not find RealWorldReceivable contract`,
      )
    }
  })

  it('should throw if no tokenId found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(request as jest.Mock).mockResolvedValue({
      rwreceivables: [{ tokenId: null }],
    })
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue(undefined)

    const signer = {
      getAddress: jest.fn().mockResolvedValue('no-receivables-address'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    try {
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        `Could not find tokenId for this ARWeave Id. Please check your logs for more details.`,
      )
    }
  })

  it('should return declarePayment', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(ARWeaveService.getURIFromARWeaveId as jest.Mock).mockReturnValue('uri')
    ;(request as jest.Mock).mockResolvedValue({
      rwreceivables: [{ tokenId: 'receivable1' }],
    })
    ;(getDefaultGasOptions as jest.Mock).mockResolvedValue({})
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      declarePayment: () => true,
    })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('no-receivables-address'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const referenceId = 'ref1'
    const paymentAmount = 10
    const gasOpts = {}

    const result =
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )

    expect(result).toBeTruthy()
  })
})

describe('declareReceivablePaymentByTokenId', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw if no chain id is found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(undefined)
    ;(ARWeaveService.getURIFromARWeaveId as jest.Mock).mockReturnValue('uri')

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const receivableTokenId = ethers.BigNumber.from('10')
    const paymentAmount = 10
    const gasOpts = {}

    try {
      await ReceivableService.declareReceivablePaymentByTokenId(
        signer,
        receivableTokenId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe('No Chain Id found')
    }
  })

  it('should throw if realWorldReceivable is not found', async () => {
    const chainIdWithoutRealWorldReceivable = 12
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      chainIdWithoutRealWorldReceivable,
    )

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const receivableTokenId = ethers.BigNumber.from('10')
    const paymentAmount = 10
    const gasOpts = {}

    try {
      await ReceivableService.declareReceivablePaymentByTokenId(
        signer,
        receivableTokenId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        'RealWorldReceivable is not available on this network',
      )
    }
  })

  it('should throw if getRealWorldReceivableContract is not found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue(undefined)

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const receivableTokenId = ethers.BigNumber.from('10')
    const paymentAmount = 10
    const gasOpts = {}

    await expect(
      ReceivableService.declareReceivablePaymentByTokenId(
        signer,
        receivableTokenId,
        paymentAmount,
        gasOpts,
      ),
    ).rejects.toThrow('Could not find RealWorldReceivable contract')
  })

  it('should return declarePayment', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(getDefaultGasOptions as jest.Mock).mockResolvedValue({})
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      declarePayment: () => true,
    })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const receivableTokenId = ethers.BigNumber.from('10')
    const paymentAmount = 10
    const gasOpts = {}

    const result = await ReceivableService.declareReceivablePaymentByTokenId(
      signer,
      receivableTokenId,
      paymentAmount,
      gasOpts,
    )

    expect(result).toBeTruthy()
  })
})

describe('createReceivable', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw if no chain id is found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(undefined)

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const poolName = POOL_NAME.Jia
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadataUri = 'https://arweave.net/tx1'
    const gasOpts = {}

    try {
      await ReceivableService.createReceivable(
        signer,
        poolName,
        poolType,
        currencyCode,
        receivableAmount,
        maturityDate,
        metadataUri,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe('No Chain Id found')
    }
  })

  it('should throw if no RealWorldReceivableContract is found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue(undefined)

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const poolName = POOL_NAME.ArfCreditPool1
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadataUri = 'https://arweave.net/tx1'
    const gasOpts = {}

    await expect(
      ReceivableService.createReceivable(
        signer,
        poolName,
        poolType,
        currencyCode,
        receivableAmount,
        maturityDate,
        metadataUri,
        gasOpts,
      ),
    ).rejects.toThrow('Could not find RealWorldReceivable contract')
  })

  it('should createRealWorldReceivable', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      createRealWorldReceivable: () => true,
    })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const poolName = POOL_NAME.ArfCreditPool1
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadataUri = 'https://arweave.net/tx1'
    const gasOpts = {}

    const result = await ReceivableService.createReceivable(
      signer,
      poolName,
      poolType,
      currencyCode,
      receivableAmount,
      maturityDate,
      metadataUri,
      gasOpts,
    )
    expect(result).toBeTruthy()
  })
})

describe('createReceivableWithMetadata', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw if metadata is not object', async () => {
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const privateKey = '0xabc'
    const chainId = 12 // chainId which will make the ARWeaveService.storeData throw error
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadata = 'value' as any
    const referenceId = 'ref1'
    const extraTags = [{ name: 'tag1', value: 'value1' }]
    const lazyFund = true
    const gasOpts = {}

    try {
      await ReceivableService.createReceivableWithMetadata(
        signer,
        privateKey,
        chainId,
        poolName,
        poolType,
        currencyCode,
        receivableAmount,
        maturityDate,
        metadata,
        referenceId,
        extraTags,
        lazyFund,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe('Input must be a JSON object.')
    }
  })

  it('should throw if metadata is array', async () => {
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const privateKey = '0xabc'
    const chainId = 12 // chainId which will make the ARWeaveService.storeData throw error
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadata = ['value'] as any
    const referenceId = 'ref1'
    const extraTags = [{ name: 'tag1', value: 'value1' }]
    const lazyFund = true
    const gasOpts = {}

    try {
      await ReceivableService.createReceivableWithMetadata(
        signer,
        privateKey,
        chainId,
        poolName,
        poolType,
        currencyCode,
        receivableAmount,
        maturityDate,
        metadata,
        referenceId,
        extraTags,
        lazyFund,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe('Input must be a JSON object.')
    }
  })

  it('should throw if createReceivable throws error', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(ARWeaveService.storeData as jest.Mock).mockReturnValue({})
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    ;(request as jest.Mock).mockResolvedValue({
      rwreceivables: [{ tokenId: null }],
    })

    const privateKey = '0xabc'
    const chainId = 13 // chainId which will make the createReceivable throw error
    const poolName = POOL_NAME.ArfCreditPool1
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadata = { key: 'value' } as any
    const referenceId = 'ref1'
    const extraTags = [{ name: 'tag1', value: 'value1' }]
    const lazyFund = true
    const gasOpts = {}

    try {
      await ReceivableService.createReceivableWithMetadata(
        signer,
        privateKey,
        chainId,
        poolName,
        poolType,
        currencyCode,
        receivableAmount,
        maturityDate,
        metadata,
        referenceId,
        extraTags,
        lazyFund,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        'Could not find RealWorldReceivable contract',
      )
    }
  })

  it('should throw If there already exists metadata with this reference Id', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(ARWeaveService.storeData as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.getURIFromARWeaveId as jest.Mock).mockReturnValue('uri')
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    ;(request as jest.Mock).mockResolvedValue({
      rwreceivables: [{ tokenId: 'receivable1' }],
    })

    const privateKey = '0xabc'
    const chainId = 12 // chainId which will make the ARWeaveService.storeData throw error
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadata = { key: 'value' } as any
    const referenceId = 'ref1'
    const extraTags = [{ name: 'tag1', value: 'value1' }]
    const lazyFund = true
    const gasOpts = {}

    try {
      await ReceivableService.createReceivableWithMetadata(
        signer,
        privateKey,
        chainId,
        poolName,
        poolType,
        currencyCode,
        receivableAmount,
        maturityDate,
        metadata,
        referenceId,
        extraTags,
        lazyFund,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        'A token already exists with this metadata, canceling mint',
      )
    }
  })

  it('should createReceivableWithMetadata if dataId is not null', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave-id',
    )
    ;(ARWeaveService.storeData as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.getURIFromARWeaveId as jest.Mock).mockReturnValue(
      'https://arweave.net/ARWeave-id',
    )
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      createRealWorldReceivable: (
        pool: string,
        currencyCode: number,
        receivableAmount: number,
        maturityDate: number,
        uri: string,
        gasOpts: any,
      ) => ({
        pool,
        currencyCode,
        receivableAmount,
        maturityDate,
        uri,
        gasOpts,
      }),
    })
    ;(request as jest.Mock).mockResolvedValue({
      rwreceivables: [{ tokenId: null }],
    })

    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const privateKey = '0xabc'
    const chainId = ChainEnum.Polygon
    const poolName = POOL_NAME.ArfCreditPool1
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadata = { key: 'value' } as any
    const referenceId = 'ref1'
    const extraTags = [{ name: 'tag1', value: 'value1' }]
    const lazyFund = true
    const gasOpts = {}

    const result = await ReceivableService.createReceivableWithMetadata(
      signer,
      privateKey,
      chainId,
      poolName,
      poolType,
      currencyCode,
      receivableAmount,
      maturityDate,
      metadata,
      referenceId,
      extraTags,
      lazyFund,
      gasOpts,
    )
    // @ts-ignore
    expect(result.uri).toBe(`https://arweave.net/ARWeave-id`)
  })

  it('should createReceivableWithMetadata if dataId is null', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Polygon,
    )
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(null)
    ;(ARWeaveService.storeData as jest.Mock).mockReturnValue({ id: 'id' })
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      createRealWorldReceivable: () => true,
    })
    ;(request as jest.Mock).mockResolvedValue({
      rwreceivables: [{ tokenId: null }],
    })

    const signer = { getAddress: jest.fn().mockResolvedValue('0xNull') } as any
    const privateKey = '0xabc'
    const chainId = ChainEnum.Polygon
    const poolName = POOL_NAME.ArfCreditPool1
    const poolType = POOL_TYPE.CreditLine
    const currencyCode = 1
    const receivableAmount = 10
    const maturityDate = 1234567890
    const metadata = { key: 'value' } as any
    const referenceId = 'ref1'
    const extraTags = [{ name: 'tag1', value: 'value1' }]
    const lazyFund = true
    const gasOpts = {}

    const result = await ReceivableService.createReceivableWithMetadata(
      signer,
      privateKey,
      chainId,
      poolName,
      poolType,
      currencyCode,
      receivableAmount,
      maturityDate,
      metadata,
      referenceId,
      extraTags,
      lazyFund,
      gasOpts,
    )

    expect(ARWeaveService.storeData).toBeCalledWith(
      {},
      privateKey,
      {
        key: 'value',
        referenceId: 'ref1',
      },
      [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'appName', value: 'HumaFinance' },
        { name: 'poolName', value: poolName },
        { name: 'poolType', value: poolType },
        { name: 'referenceId', value: referenceId },
        { name: 'tag1', value: 'value1' },
      ],
      true,
    )
    expect(result).toBeTruthy()
  })
})

describe('loadReceivablesOfOwnerWithMetadata', () => {
  it('should throw if owner is not valid', async () => {
    const mockProvider = {} as any
    const InvalidAccount = '0x123'

    try {
      await ReceivableService.loadReceivablesOfOwnerWithMetadata<{}>(
        mockProvider,
        InvalidAccount,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
      )
    } catch (error) {
      expect((error as any).message).toBe('Invalid owner address')
    }
  })

  it('should throw if No Chain ID found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockReturnValue(
      Promise.resolve(undefined),
    )

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any

    const owner = '0xF6c0ACD62e69669155f314D6A6E22f5cF63fab4E'

    try {
      await ReceivableService.loadReceivablesOfOwnerWithMetadata<{}>(
        signer,
        owner,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
      )
    } catch (error) {
      expect((error as any).message).toBe('No Chain Id found')
    }
  })

  it('should return ReceivablesOfOwnerWithMetadata', async () => {
    const poolInfo =
      PoolContractMap[ChainEnum.Polygon]?.[POOL_TYPE.CreditLine]?.[
        POOL_NAME.HumaCreditLine
      ]
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockReturnValue(
      Promise.resolve(ChainEnum.Polygon),
    )
    ;(ARWeaveService.fetchMetadataFromUrl as jest.Mock).mockResolvedValue({
      key: 'value',
    })
    ;(SubgraphService.getRWReceivableInfo as jest.Mock).mockReturnValue([
      {
        tokenId: '1',
        poolAddress: poolInfo?.pool,
        receivableAmount: 10,
        paidAmount: 10,
        creationDate: 1234567890,
        maturityDate: 1234567890,
        currencyCode: 1,
        tokenURI: 'https://arweave.net/tx1',
      },
    ])

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
    } as any

    const owner = '0xF6c0ACD62e69669155f314D6A6E22f5cF63fab4E'

    const result =
      await ReceivableService.loadReceivablesOfOwnerWithMetadata<{}>(
        signer,
        owner,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
      )
    expect(result).toStrictEqual([
      {
        tokenId: '1',
        poolAddress: poolInfo?.pool,
        receivableAmount: 10,
        paidAmount: 10,
        creationDate: 1234567890,
        maturityDate: 1234567890,
        currencyCode: 1,
        tokenURI: 'https://arweave.net/tx1',
        metadata: {
          key: 'value',
        },
      },
    ])
  })
})

describe('getTotalCountOfReceivables', () => {
  it('should throw if owner is not valid', async () => {
    const mockProvider = {} as any
    const InvalidAccount = '0x123'

    try {
      await ReceivableService.getTotalCountOfReceivables(
        mockProvider,
        InvalidAccount,
      )
    } catch (error) {
      expect((error as any).message).toBe('Invalid owner address')
    }
  })

  it('should throw if No Chain ID found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockReturnValue(
      Promise.resolve(undefined),
    )

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any

    const owner = '0xF6c0ACD62e69669155f314D6A6E22f5cF63fab4E'

    try {
      await ReceivableService.getTotalCountOfReceivables(signer, owner)
    } catch (error) {
      expect((error as any).message).toBe('No Chain Id found')
    }
  })

  it('should throw if RealWorldReceivable contract is not found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockReturnValue(
      Promise.resolve(ChainEnum.Polygon),
    )
    ;(ARWeaveService.fetchMetadataFromUrl as jest.Mock).mockResolvedValue({
      key: 'value',
    })
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue(undefined)

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
    } as any

    const owner = '0xF6c0ACD62e69669155f314D6A6E22f5cF63fab4E'

    await expect(
      ReceivableService.getTotalCountOfReceivables(signer, owner),
    ).rejects.toThrow('Could not find RealWorldReceivable contract')
  })

  it('should return total count of Receivables', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockReturnValue(
      Promise.resolve(ChainEnum.Polygon),
    )
    ;(ARWeaveService.fetchMetadataFromUrl as jest.Mock).mockResolvedValue({
      key: 'value',
    })
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      balanceOf: () => Promise.resolve(BigNumber.from(6)),
    })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
    } as any

    const owner = '0xF6c0ACD62e69669155f314D6A6E22f5cF63fab4E'

    const result = await ReceivableService.getTotalCountOfReceivables(
      signer,
      owner,
    )
    expect(result).toStrictEqual(6)
  })
})

describe('uploadOrFetchMetadataURI', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockReset()
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({
      /* mock config object here */
    })
    ;(ARWeaveService.storeData as jest.Mock).mockResolvedValue({
      id: 'arweave_id_here',
    })
    ;(ARWeaveService.getURIFromARWeaveId as jest.Mock).mockReturnValue(
      'arweave_uri_here',
    )
  })

  test('should upload metadata and return ARWeave URI if data does not exist', async () => {
    const mockSigner = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any

    const mockReferenceId = 'reference_id_here'
    const mockExtraTags = [{ name: 'tag1', value: 'value1' }]
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(null)

    const result = await ReceivableService.uploadOrFetchMetadataURI(
      mockSigner,
      'private key',
      1,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
      { value: 1 },
      mockReferenceId,
      mockExtraTags,
      true,
    )

    expect(result).toBe('arweave_uri_here')
    expect(ARWeaveService.queryForMetadata).toHaveBeenCalledWith(
      1,
      expect.any(String),
      mockReferenceId,
    )
    expect(ARWeaveService.storeData).toHaveBeenCalledWith(
      {
        /* mock config object here */
      },
      'private key',
      { value: 1, referenceId: mockReferenceId },
      expect.arrayContaining([
        { name: 'Content-Type', value: 'application/json' },
        { name: 'appName', value: 'HumaFinance' },
        { name: 'poolName', value: 'HumaCreditLine' },
        { name: 'poolType', value: 'CreditLine' },
        { name: 'referenceId', value: 'reference_id_here' },
        { name: 'tag1', value: 'value1' },
      ]),
      true,
    )
    expect(ARWeaveService.getURIFromARWeaveId).toHaveBeenCalledWith(
      'arweave_id_here',
    )
  })

  test('should return existing ARWeave URI if data exists', async () => {
    const mockSigner = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any

    const mockReferenceId = 'reference_id_here'
    const mockExtraTags = [{ name: 'tag1', value: 'value1' }]
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'existing_data_id_here',
    )

    const result = await ReceivableService.uploadOrFetchMetadataURI(
      mockSigner,
      'private_key_here',
      1,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
      { value: 1 },
      mockReferenceId,
      mockExtraTags,
      true,
    )

    expect(result).toBe('arweave_uri_here')
    expect(ARWeaveService.queryForMetadata).toHaveBeenCalledWith(
      1,
      expect.any(String),
      mockReferenceId,
    )
    expect(ARWeaveService.getURIFromARWeaveId).toHaveBeenCalledWith(
      'existing_data_id_here',
    )
    expect(ARWeaveService.storeData).not.toHaveBeenCalled() // Ensure storeData is not called
  })
})
