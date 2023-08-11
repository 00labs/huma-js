/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jest/no-conditional-expect */
import { BigNumber, ethers } from 'ethers'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import {
  approvePoolAllowance,
  drawdownFromPool,
  getCreditRecord,
  getPoolContract,
  getTotalDue,
  makePaymentToPool,
} from '../../src/helpers/PoolContractHelper'

import { getContract, getERC20Contract } from '../../src/utils/web3'
import { getDefaultGasOptions } from '../../src/utils/maticGasStation'

const provider = new ethers.providers.JsonRpcProvider(
  `https://polygon-mainnet.g.alchemy.com/v2/asdfasdfasdfasdf`,
  {
    name: 'matic',
    chainId: ChainEnum.Polygon,
  },
)

jest.mock('../../src/utils/web3', () => ({
  getContract: jest.fn(),
  getERC20Contract: jest.fn(),
}))
jest.mock('../../src/utils/maticGasStation', () => ({
  getDefaultGasOptions: jest.fn(),
}))

describe('getPoolContract', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return null if the pool contract is not found', () => {
    const contract = getPoolContract(
      provider,
      1,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )

    expect(contract).toBeNull()
  })

  it('should return the pool contract instance', () => {
    ;(getContract as jest.Mock).mockReturnValue({
      creditRecordMapping: jest.fn().mockResolvedValue({}),
    })

    const contract = getPoolContract(
      provider,
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )

    expect(contract).toBeDefined()
  })
})

describe('getCreditRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw an error if pool contract is not found', async () => {
    await expect(
      getCreditRecord(
        '0xAb3dc5221F373Dd879BEc070058c775A0f6Af759',
        provider,
        1,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
      ),
    ).rejects.toThrowError('Could not find pool contract')
  })

  it('should return the credit record', async () => {
    ;(getContract as jest.Mock).mockReturnValue({
      creditRecordMapping: jest.fn().mockResolvedValue({
        dueDate: 123,
        unbilledPrincipal: 123,
        correction: 123,
        totalDue: 123,
      }),
    })

    const creditRecord = await getCreditRecord(
      '0xAb3dc5221F373Dd879BEc070058c775A0f6Af759',
      provider,
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )

    expect(creditRecord).toBeDefined()
    expect(creditRecord.unbilledPrincipal).toBe(123)
    expect(creditRecord.dueDate).toBe(123)
    expect(creditRecord.correction).toBe(123)
    expect(creditRecord.totalDue).toBe(123)
  })
})

describe('getTotalDue', () => {
  it('should return the total due amount', async () => {
    ;(getContract as jest.Mock).mockReturnValue({
      creditRecordMapping: jest.fn().mockResolvedValue({
        dueDate: 123,
        unbilledPrincipal: 123,
        correction: 123,
        totalDue: 123,
      }),
    })

    const totalDue = await getTotalDue(
      '0xAb3dc5221F373Dd879BEc070058c775A0f6Af759',
      provider,
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )

    expect(totalDue).toEqual(123)
  })
})

describe('drawdownFromPool', () => {
  it('should throw if cannot find pool contract', async () => {
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const mockChainId = 2

    try {
      await drawdownFromPool(
        signer,
        mockChainId,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        '100',
      )
    } catch (error) {
      expect((error as any).message).toBe('Could not find pool contract')
    }
  })

  it('should drawdown successfully', async () => {
    ;(getContract as jest.Mock).mockReturnValue({
      drawdown: jest.fn().mockResolvedValue({
        hash: '0x123',
      }),
    })
    ;(getDefaultGasOptions as jest.Mock).mockReturnValue({})

    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any

    const result = await drawdownFromPool(
      signer,
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
      '100',
    )
    expect(result.hash).toBe('0x123')
  })
})

describe('makePaymentToPool', () => {
  it('should throw if cannot find the pool info', async () => {
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const mockChainId = 1
    const mockPaymentAmount = '100'

    await expect(
      makePaymentToPool(
        signer,
        mockChainId,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        mockPaymentAmount,
      ),
    ).rejects.toThrowError('Could not find pool underlying token address')
  })

  it('should throw if cannot find pool contract', async () => {
    ;(getERC20Contract as jest.Mock).mockReturnValue({
      allowance: jest.fn().mockResolvedValue('100'),
    })
    ;(getContract as jest.Mock).mockImplementation(() => null)

    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const mockPaymentAmount = '100'

    await expect(
      makePaymentToPool(
        signer,
        ChainEnum.Goerli,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        mockPaymentAmount,
      ),
    ).rejects.toThrowError('Could not find pool contract')
  })

  it('should make payment', async () => {
    const mockApprove = jest.fn().mockResolvedValue({
      wait: () => Promise.resolve(100),
    })

    ;(getERC20Contract as jest.Mock).mockReturnValue({
      allowance: jest.fn().mockResolvedValue(BigNumber.from('90')),
      approve: mockApprove,
    })
    ;(getContract as jest.Mock).mockReturnValue({
      address: 'poolAddress',
      makePayment: jest.fn().mockResolvedValue({
        hash: '0x123',
      }),
    })
    ;(getDefaultGasOptions as jest.Mock).mockReturnValue({})

    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const mockPaymentAmount = BigNumber.from('100')

    const result = await makePaymentToPool(
      signer,
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
      mockPaymentAmount,
    )
    expect(result.hash).toBe('0x123')
    expect(mockApprove).toHaveBeenCalled()
  })
})

describe('approvePoolAllowance', () => {
  it('should throw if cannot find the pool info', async () => {
    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const mockChainId = 1
    const allowanceAmount = '100'

    await expect(
      approvePoolAllowance(
        signer,
        mockChainId,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        allowanceAmount,
      ),
    ).rejects.toThrowError('Could not find pool underlying token address')
  })

  it('should throw if cannot find pool contract', async () => {
    ;(getERC20Contract as jest.Mock).mockReturnValue({
      allowance: jest.fn().mockResolvedValue('100'),
    })
    ;(getContract as jest.Mock).mockImplementation(() => null)

    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const allowanceAmount = '100'

    await expect(
      approvePoolAllowance(
        signer,
        ChainEnum.Goerli,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        allowanceAmount,
      ),
    ).rejects.toThrowError('Could not find pool contract')
  })

  it('should approve', async () => {
    ;(getERC20Contract as jest.Mock).mockReturnValue({
      approve: jest.fn().mockResolvedValue({
        hash: '0x123',
      }),
    })
    ;(getContract as jest.Mock).mockReturnValue({
      address: 'poolAddress',
    })
    ;(getDefaultGasOptions as jest.Mock).mockReturnValue({})

    const signer = { getAddress: jest.fn().mockResolvedValue('0x123') } as any
    const allowanceAmount = BigNumber.from('100')

    const result = await approvePoolAllowance(
      signer,
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
      allowanceAmount,
    )
    expect(result.hash).toBe('0x123')
  })
})
