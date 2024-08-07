import { MaxUint256 } from '@ethersproject/constants'
import { JsonRpcProvider } from '@ethersproject/providers'
import {
  CreditState,
  POOL_NAME,
  POOL_TYPE,
  toBigNumber,
} from '@huma-finance/shared'
import { act, renderHook, waitFor } from '@testing-library/react'
import { BigNumber } from 'ethers'

import { useContract, useERC20Contract } from '../../src/hooks/useContract'
import { usePoolInfo } from '../../src/hooks/usePool'
import {
  useAccountStats,
  useCreditRecord,
  useFeeManager,
  useLastDepositTime,
  useLenderApproved,
  useLenderPosition,
  usePoolAllowance,
  usePoolApr,
  usePoolBalance,
  usePoolTotalSupply,
  usePoolTotalValue,
  usePoolUnderlyingTokenBalance,
  useWithdrawlLockoutInSeconds,
} from '../../src/hooks/usePoolContract'

jest.mock('../../src/hooks/usePool', () => ({
  usePoolInfo: jest.fn(),
}))

jest.mock('../../src/hooks/useContract', () => ({
  useERC20Contract: jest.fn(),
  useContract: jest.fn(),
}))

jest.mock('../../src/utils/pool', () => ({
  POOL_NAME: {
    HumaCreditLine: 'HumaCreditLine',
  },
  POOL_TYPE: {
    Invoice: 'Invoice',
    CreditLine: 'CreditLine',
  },
  PoolContractMap: {
    1: {
      CreditLine: {
        HumaCreditLine: {
          pool: '0x0',
        },
      },
    },
  },
  getPoolInfo: jest.fn(),
}))

describe('usePoolUnderlyingTokenBalance', () => {
  it('returns default value if PoolUnderlyingTokenContract is not valid', () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolUnderlyingTokenBalance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    expect(result.current).toEqual(toBigNumber(0))
  })

  it('returns default value if account is not provided', () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolUnderlyingTokenBalance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    expect(result.current).toEqual(toBigNumber(0))
  })

  it('returns the balance if account and contract are provided', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolUnderlyingTokenBalance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual(BigNumber.from(100))
    })
  })
})

describe('usePoolTotalValue', () => {
  it('returns undefined if chainId is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      totalPoolValue: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolTotalValue(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns undefined if poolContract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolTotalValue(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns the total value', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      totalPoolValue: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(200)),
    })

    const { result } = renderHook(() =>
      usePoolTotalValue(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })

    act(() => {
      result.current[1]()
    })

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(200))
    })
  })
})

describe('usePoolTotalSupply', () => {
  it('returns undefined if chainId is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      HDT: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      totalPoolValue: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolTotalSupply(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns undefined if HDTContract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      HDT: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolTotalSupply(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns the total supply', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      HDT: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      totalSupply: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(200)),
    })

    const { result } = renderHook(() =>
      usePoolTotalSupply(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })

    act(() => {
      result.current[1]()
    })

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(200))
    })
  })
})

describe('usePoolBalance', () => {
  it('returns undefined if chainId is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolBalance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns undefined if poolUnderlyingTokenContract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolBalance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns undefined if pool address is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolBalance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns the pool balance', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      balanceOf: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(200)),
    })

    const { result } = renderHook(() =>
      usePoolBalance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })

    act(() => {
      result.current[1]()
    })

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(200))
    })
  })
})

describe('useAccountStats', () => {
  const initialAccountStats = {
    creditRecord: undefined,
    creditRecordStatic: undefined,
    receivableInfo: undefined,
    isApproved: false,
    payoffAmount: 0,
    principalAmount: 0,
    creditAvailableAmount: 0,
    totalDueAmount: 0,
  }

  it('returns initial state if poolContract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useAccountStats(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        undefined,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(initialAccountStats)
    })
  })

  it('returns initial state if account is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        decimals: 6,
      },
    })
    ;(useContract as jest.Mock).mockReturnValue({
      creditRecord: jest.fn(),
      creditRecordStaticMapping: jest.fn(),
      receivableInfoMapping: jest.fn(),
    })

    const { result } = renderHook(() =>
      useAccountStats(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(initialAccountStats)
    })
  })

  it('returns initial state if poolInfo is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue(null)
    ;(useContract as jest.Mock).mockReturnValue({
      creditRecord: jest.fn(),
      creditRecordStaticMapping: jest.fn(),
      receivableInfoMapping: jest.fn(),
    })

    const { result } = renderHook(() =>
      useAccountStats(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(initialAccountStats)
    })
  })

  it('returns the account stats', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolUnderlyingToken: {
        decimals: 6,
      },
    })

    const mockCreditRecord1 = {
      unbilledPrincipal: BigNumber.from(100000000),
      totalDue: BigNumber.from(200000000),
      correction: BigNumber.from(5000000),
      feesAndInterestDue: BigNumber.from(20000000),
      state: 2,
    }
    const mockCreditRecord2 = {
      unbilledPrincipal: BigNumber.from(100000000),
      totalDue: BigNumber.from(200000000),
      correction: BigNumber.from(5000000),
      feesAndInterestDue: BigNumber.from(20000000),
      state: 1,
    }
    const mockCreditRecordStatic = {
      creditLimit: BigNumber.from(500000000),
    }
    const mockReceivableInfo = {
      receivableAsset: 'receivableAsset',
      receivableAmount: BigNumber.from(10000000),
      receivableParam: BigNumber.from('0x0'),
    }

    ;(useERC20Contract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValue(BigNumber.from(10000000000)),
    })
    ;(useContract as jest.Mock).mockReturnValue({
      creditRecordMapping: jest
        .fn()
        .mockResolvedValueOnce(mockCreditRecord1)
        .mockResolvedValueOnce(mockCreditRecord2),
      creditRecordStaticMapping: jest
        .fn()
        .mockResolvedValue(mockCreditRecordStatic),
      receivableInfoMapping: jest.fn().mockResolvedValue(mockReceivableInfo),
    })

    const { result } = renderHook(() =>
      useAccountStats(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual({
        creditRecord: mockCreditRecord1,
        creditRecordStatic: mockCreditRecordStatic,
        receivableInfo: mockReceivableInfo,
        isApproved: true,
        payoffAmount: '305',
        principalAmount: '280',
        creditAvailableAmount: '220',
        totalDueAmount: '200',
      })
    })

    act(() => {
      result.current[1]()
    })

    await waitFor(() => {
      expect(result.current[0]).toEqual({
        creditRecord: mockCreditRecord2,
        creditRecordStatic: mockCreditRecordStatic,
        receivableInfo: mockReceivableInfo,
        isApproved: false,
        payoffAmount: '305',
        principalAmount: '280',
        creditAvailableAmount: '220',
        totalDueAmount: '200',
      })
    })
  })
})

describe('useCreditRecord', () => {
  it('returns false if poolContract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useCreditRecord(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    const isApproved = await result.current.checkIsApproved()

    expect(isApproved).toBe(false)
  })

  it('returns false if account is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    const mockCreditRecordMapping = jest.fn()
    ;(useContract as jest.Mock).mockImplementation(() => ({
      creditRecordMapping: mockCreditRecordMapping,
    }))

    const { result } = renderHook(() =>
      useCreditRecord(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    const isApproved = await result.current.checkIsApproved()
    expect(isApproved).toBe(false)
  })

  it('returns the approval status if account and contract are provided', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockImplementation(() => ({
      creditRecordMapping: jest
        .fn()
        .mockResolvedValueOnce({
          state: CreditState.Approved,
        })
        .mockResolvedValueOnce({
          state: CreditState.Deleted,
        }),
    }))

    const { result } = renderHook(() =>
      useCreditRecord(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    const isApproved = await result.current.checkIsApproved()
    expect(isApproved).toBe(true)

    const isApproved2 = await result.current.checkIsApproved()
    expect(isApproved2).toBe(false)
  })
})

describe('useFeeManager', () => {
  it('returns fees undefined and getFeesCharged 0 if contract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolFeeManager: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    })
    ;(useContract as jest.Mock).mockReturnValue(null)
    const { result } = renderHook(() =>
      useFeeManager(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current.fees).toBeUndefined()
    })

    await waitFor(() => {
      expect(result.current.getFeesCharged(100)).toBe(0)
    })
  })

  it('returns fees and getFeesCharged 0 if requestedLoan is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolFeeManager: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    })

    const mockFees = {
      _frontLoadingFeeFlat: BigNumber.from(100),
      _frontLoadingFeeBps: BigNumber.from(200),
      _lateFeeFlat: BigNumber.from(300),
      _lateFeeBps: BigNumber.from(400),
      _membershipFee: BigNumber.from(500),
    }
    ;(useContract as jest.Mock).mockReturnValue({
      getFees: jest.fn().mockResolvedValue(mockFees),
    })
    const { result } = renderHook(() =>
      useFeeManager(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current.fees).toEqual(mockFees)
    })

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(result.current.getFeesCharged(null as any)).toBe(0)
    })
  })

  it('returns fees and getFeesCharged 0 if poolInfo is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue(null)

    const mockFees = {
      _frontLoadingFeeFlat: BigNumber.from(100),
      _frontLoadingFeeBps: BigNumber.from(200),
      _lateFeeFlat: BigNumber.from(300),
      _lateFeeBps: BigNumber.from(400),
      _membershipFee: BigNumber.from(500),
    }
    ;(useContract as jest.Mock).mockReturnValue({
      getFees: jest.fn().mockResolvedValue(mockFees),
    })
    const { result } = renderHook(() =>
      useFeeManager(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current.fees).toEqual(mockFees)
    })

    await waitFor(() => {
      expect(result.current.getFeesCharged(100)).toBe(0)
    })
  })

  it('returns fees and getFeesCharged', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolFeeManager: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolUnderlyingToken: {
        decimals: 6,
      },
    })

    const mockFees = {
      _frontLoadingFeeFlat: BigNumber.from(10000000),
      _frontLoadingFeeBps: BigNumber.from(20000000),
      _lateFeeFlat: BigNumber.from(3000000),
      _lateFeeBps: BigNumber.from(4000000),
      _membershipFee: BigNumber.from(5000000),
    }
    ;(useContract as jest.Mock).mockReturnValue({
      getFees: jest.fn().mockResolvedValue(mockFees),
    })
    const { result } = renderHook(() =>
      useFeeManager(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current.fees).toEqual(mockFees)
    })

    await waitFor(() => {
      expect(result.current.getFeesCharged(100)).toBe(200010)
    })
  })
})

describe('usePoolAllowance', () => {
  it('returns initial state if contract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolAllowance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual({
        approved: false,
        allowance: BigNumber.from(0),
        loaded: false,
        refresh: expect.any(Function),
      })
    })
  })

  it('returns initial state if poolInfo is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue(null)
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      allowance: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolAllowance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual({
        approved: false,
        allowance: BigNumber.from(0),
        loaded: false,
        refresh: expect.any(Function),
      })
    })
  })

  it('returns initial state if account is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      allowance: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(MaxUint256)),
    })

    const { result } = renderHook(() =>
      usePoolAllowance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual({
        approved: false,
        allowance: BigNumber.from(0),
        loaded: false,
        refresh: expect.any(Function),
      })
    })
  })

  it('returns correct state', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      allowance: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(MaxUint256)),
    })

    const { result } = renderHook(() =>
      usePoolAllowance(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual({
        approved: false,
        allowance: BigNumber.from(100),
        loaded: true,
        refresh: expect.any(Function),
      })
    })

    result.current.refresh()

    await waitFor(() => {
      expect(result.current).toEqual({
        approved: true,
        allowance: BigNumber.from(MaxUint256),
        loaded: true,
        refresh: expect.any(Function),
      })
    })
  })
})

describe('useLenderPosition', () => {
  it('returns undefined if contract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useLenderPosition(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns undefined if account is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      withdrawableFundsOf: jest.fn(),
    })

    const { result } = renderHook(() =>
      useLenderPosition(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns undefined if poolInfo is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue(null)
    ;(useContract as jest.Mock).mockReturnValue({
      withdrawableFundsOf: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useLenderPosition(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns lender position', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        decimals: 6,
      },
    })
    ;(useContract as jest.Mock).mockReturnValue({
      withdrawableFundsOf: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(1000000)),
    })

    const { result } = renderHook(() =>
      useLenderPosition(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(0))
    })

    result.current[1]()

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(1000000))
    })
  })
})

describe('useLenderApproved', () => {
  it('returns undefined if contract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useLenderApproved(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns undefined if account is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      isApprovedLender: jest.fn(),
    })

    const { result } = renderHook(() =>
      useLenderApproved(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns lender approved or not', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      isApprovedLender: jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true),
    })

    const { result } = renderHook(() =>
      useLenderApproved(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBe(false)
    })
    result.current[1]()
    await waitFor(() => {
      expect(result.current[0]).toBe(true)
    })
  })
})

describe('useWithdrawlLockoutInSeconds', () => {
  it('returns undefined if contract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useWithdrawlLockoutInSeconds(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toBeUndefined()
    })
  })

  it('returns withdrawlLockoutInSeconds', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      withdrawalLockoutPeriodInSeconds: jest
        .fn()
        .mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useWithdrawlLockoutInSeconds(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual(100)
    })
  })
})

describe('useLastDepositTime', () => {
  it('returns undefined if contract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useLastDepositTime(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toBeUndefined()
    })
  })

  it('returns undefined if account is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      lastDepositTime: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useLastDepositTime(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toBeUndefined()
    })
  })

  it('returns lastDepositTime', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue({
      lastDepositTime: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useLastDepositTime(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual(100)
    })
  })
})

describe('usePoolApr', () => {
  it('returns undefined if contract is not valid', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolApr(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toBeUndefined()
    })
  })

  it('returns pool apr', async () => {
    ;(usePoolInfo as jest.Mock).mockReturnValue({})
    ;(useContract as jest.Mock).mockReturnValue({
      poolAprInBps: jest.fn().mockResolvedValue(BigNumber.from(1500)),
    })

    const { result } = renderHook(() =>
      usePoolApr(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual(0.15)
    })
  })
})
