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

jest.mock('../../src/utils/chain', () => ({
  getChainIdFromSignerOrProvider: jest.fn(),
}))
jest.mock('../../src/services/ARWeaveService', () => ({
  ARWeaveService: {
    queryForMetadata: jest.fn(),
    getBundlrNetworkConfig: jest.fn(),
    storeData: jest.fn(),
    fetchMetadataFromUrl: jest.fn(),
  },
}))
jest.mock('../../src/helpers/RealWorldReceivableContractHelper', () => ({
  getRealWorldReceivableContract: jest.fn(),
}))
jest.mock('../../src/utils/maticGasStation', () => ({
  getDefaultGasOptions: jest.fn(),
}))
jest.mock('graphql-request', () => ({
  gql: jest.fn(),
  request: jest.fn(),
}))

describe('declareReceivablePaymentByReferenceId', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
      ChainEnum.Goerli,
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
        'Could not find tokenId for this ARWeave Id. Please check your logs for more details.',
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
      ChainEnum.Goerli,
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

    try {
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        'Could not find tokenId for this ARWeave Id. Please check your logs for more details.',
      )
    }
    expect(console.log).toHaveBeenCalledWith(
      `No receivables found with this ARWeave Id.`,
    )
  })

  it('should throw if receivables are empty returned by subgraph', async () => {
    console.log = jest.fn()
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
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

    try {
      await ReceivableService.declareReceivablePaymentByReferenceId(
        signer,
        referenceId,
        paymentAmount,
        gasOpts,
      )
    } catch (error) {
      expect((error as any).message).toBe(
        'Could not find tokenId for this ARWeave Id. Please check your logs for more details.',
      )
    }
    expect(console.log).toHaveBeenCalledWith(
      `No receivables found with this ARWeave Id.`,
    )
  })

  it('should throw if receivables have more than one element returned by subgraph', async () => {
    console.log = jest.fn()
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(request as jest.Mock).mockResolvedValue({
      receivables: ['receivable1', 'receivable2'],
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
        `Could not find tokenId for this ARWeave Id. Please check your logs for more details.`,
      )
    }
    expect(console.log).toHaveBeenCalledWith(
      `This owner has multiple receivables with the same ARWeave URI, so we don't know which to use. Please burn 
        unnecessary receivables or pay the correct token manually using declareReceivablePaymentByTokenId`,
    )
  })

  it('should throw if not find RealWorldReceivable contract', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(request as jest.Mock).mockResolvedValue({
      receivables: [{ tokenId: 'receivable1' }],
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

  it('should return declarePayment', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
    )
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(request as jest.Mock).mockResolvedValue({
      receivables: [{ tokenId: 'receivable1' }],
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
    jest.clearAllMocks()
  })

  it('should throw if no chain id is found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(undefined)

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
      ChainEnum.Goerli,
    )
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue(undefined)

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
        'Could not find RealWorldReceivable contract',
      )
    }
  })

  it('should return declarePayment', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
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
    jest.clearAllMocks()
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

  it('should throw if no poolInfo is found', async () => {
    const chainIdWithoutPoolInfo = 12
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      chainIdWithoutPoolInfo,
    )

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
      expect((error as any).message).toBe(
        'RealWorldReceivable is not available on this network',
      )
    }
  })

  it('should throw if no RealWorldReceivableContract is found', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
    )
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue(undefined)

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const poolName = POOL_NAME.HumaCreditLine
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
      expect((error as any).message).toBe(
        'Could not find RealWorldReceivable contract',
      )
    }
  })

  it('should createRealWorldReceivable', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
    )
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      createRealWorldReceivable: () => true,
    })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any
    const poolName = POOL_NAME.HumaCreditLine
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
    jest.clearAllMocks()
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
      ChainEnum.Goerli,
    )
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(ARWeaveService.storeData as jest.Mock).mockReturnValue({})
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    ;(request as jest.Mock).mockResolvedValue({
      receivables: [{ tokenId: null }],
    })

    const privateKey = '0xabc'
    const chainId = 13 // chainId which will make the createReceivable throw error
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
        'Could not find RealWorldReceivable contract',
      )
    }
  })

  it('should throw If there already exists metadata with this reference Id', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
    )
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave id',
    )
    ;(ARWeaveService.storeData as jest.Mock).mockReturnValue({})
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    ;(request as jest.Mock).mockResolvedValue({
      receivables: [{ tokenId: 'receivable1' }],
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
        'A token already exists with this reference Id, canceling mint',
      )
    }
  })

  it('should createReceivableWithMetadata if dataId is not null', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      ChainEnum.Goerli,
    )
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(
      'ARWeave-id',
    )
    ;(ARWeaveService.storeData as jest.Mock).mockReturnValue({})
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
      receivables: [{ tokenId: null }],
    })

    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const privateKey = '0xabc'
    const chainId = ChainEnum.Goerli
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
      ChainEnum.Goerli,
    )
    ;(ARWeaveService.getBundlrNetworkConfig as jest.Mock).mockReturnValue({})
    ;(ARWeaveService.queryForMetadata as jest.Mock).mockResolvedValue(null)
    ;(ARWeaveService.storeData as jest.Mock).mockReturnValue({ id: 'id' })
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      createRealWorldReceivable: () => true,
    })
    ;(request as jest.Mock).mockResolvedValue({
      receivables: [{ tokenId: null }],
    })

    const signer = { getAddress: jest.fn().mockResolvedValue('0xNull') } as any
    const privateKey = '0xabc'
    const chainId = ChainEnum.Goerli
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
  it('should throw is owner is not valid', async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      {
        name: 'matic',
        chainId: ChainEnum.Polygon,
      },
    )

    const InvalidAccount = '0x123'

    try {
      await ReceivableService.loadReceivablesOfOwnerWithMetadata<{}>(
        provider as any,
        InvalidAccount,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
      )
    } catch (error) {
      expect((error as any).message).toBe('Invalid owner address')
    }
  })

  it('should throw is No Chain ID found', async () => {
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

  it('should throw is RealWorldReceivable is not available on this network', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockReturnValue(
      Promise.resolve(1),
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
      expect((error as any).message).toBe(
        'RealWorldReceivable is not available on this network',
      )
    }
  })

  it('should return ReceivablesOfOwnerWithMetadata', async () => {
    const poolInfo =
      PoolContractMap[ChainEnum.Goerli]?.[POOL_TYPE.CreditLine]?.[
        POOL_NAME.HumaCreditLine
      ]
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockReturnValue(
      Promise.resolve(ChainEnum.Goerli),
    )
    ;(ARWeaveService.fetchMetadataFromUrl as jest.Mock).mockResolvedValue({
      key: 'value',
    })
    ;(getRealWorldReceivableContract as jest.Mock).mockReturnValue({
      balanceOf: () => Promise.resolve(BigNumber.from(2)),
      tokenOfOwnerByIndex: (owner: string, tokenIndex: number) =>
        Promise.resolve(tokenIndex),
      tokenURI: () => Promise.resolve('https://arweave.net/tx1'),
      rwrInfoMapping: (tokenId: number) => {
        if (tokenId === 0) {
          return Promise.resolve({
            tokenId,
            poolAddress: 'wrong pool',
            receivableAmount: 10,
            paidAmount: 10,
            creationDate: 1234567890,
            maturityDate: 1234567890,
            currencyCode: 1,
            tokenURI: 'https://arweave.net/tx1',
            metadata: {
              key: 'value',
            },
          })
        }
        return Promise.resolve({
          tokenId,
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
        })
      },
    })

    const signer = {
      getAddress: jest.fn().mockResolvedValue('0x123'),
      sendTransaction: jest.fn().mockResolvedValue({ hash: 'tx1' }),
    } as any

    const owner = '0xF6c0ACD62e69669155f314D6A6E22f5cF63fab4E'

    const result = await ReceivableService.loadReceivablesOfOwnerWithMetadata<{}>(
      signer,
      owner,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )
    expect(result).toStrictEqual([
      {
        tokenId: 1,
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
