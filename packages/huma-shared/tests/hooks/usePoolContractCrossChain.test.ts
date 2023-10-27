import { JsonRpcProvider } from '@ethersproject/providers'
import { act, renderHook, waitFor } from '@testing-library/react'
import { BigNumber } from 'ethers'

import {
  useAccountStatsCrossChain,
  useBorrowerApprovedCrossChain,
  useLenderPositionCrossChain,
  usePoolAprCrossChain,
  usePoolBalanceCrossChain,
} from '../../src/hooks/usePoolContractCrossChain'
import { getPoolInfo, POOL_NAME, POOL_TYPE } from '../../src/utils/pool'
import { getContract } from '../../src/utils/web3'

jest.mock('../../src/hooks/usePool', () => ({
  usePoolInfo: jest.fn(),
}))

jest.mock('../../src/utils/web3', () => ({
  getContract: jest.fn(),
  getERC20Contract: jest.fn(),
}))

jest.mock('../../src/utils/pool', () => ({
  POOL_NAME: {
    RequestNetwork: 'RequestNetwork',
    HumaCreditLine: 'HumaCreditLine',
  },
  POOL_TYPE: {
    Invoice: 'Invoice',
    CreditLine: 'CreditLine',
  },
  PoolContractMap: {
    1: {
      Invoice: {
        RequestNetwork: {
          pool: '0x0',
        },
      },
    },
  },
  getPoolInfo: jest.fn(),
}))

describe('usePoolBalanceCrossChain', () => {
  it('returns undefined if poolUnderlyingTokenContract is not valid', async () => {
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
      poolUnderlyingToken: {
        address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
      },
    })
    ;(getContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolBalanceCrossChain(
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

  it('returns undefined if poolInfo is not valid', async () => {
    ;(getPoolInfo as jest.Mock).mockReturnValue(undefined)
    ;(getContract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolBalanceCrossChain(
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
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
      poolUnderlyingToken: {
        address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
      },
    })
    ;(getContract as jest.Mock).mockReturnValue({
      balanceOf: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(200)),
    })

    const { result } = renderHook(() =>
      usePoolBalanceCrossChain(
        POOL_NAME.RequestNetwork,
        POOL_TYPE.Invoice,
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

describe('useLenderPositionCrossChain', () => {
  it('returns undefined if contract is not valid', async () => {
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(getContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useLenderPositionCrossChain(
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
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(getContract as jest.Mock).mockReturnValue({
      withdrawableFundsOf: jest.fn(),
    })

    const { result } = renderHook(() =>
      useLenderPositionCrossChain(
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
    ;(getPoolInfo as jest.Mock).mockReturnValue(null)
    ;(getContract as jest.Mock).mockReturnValue({
      withdrawableFundsOf: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useLenderPositionCrossChain(
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
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        decimals: 6,
      },
    })
    ;(getContract as jest.Mock).mockReturnValue({
      withdrawableFundsOf: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(1000000)),
    })

    const { result } = renderHook(() =>
      useLenderPositionCrossChain(
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

describe('usePoolAprCrossChain', () => {
  it('returns undefined if contract is not valid', async () => {
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(getContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolAprCrossChain(
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
    ;(getPoolInfo as jest.Mock).mockReturnValue({})
    ;(getContract as jest.Mock).mockReturnValue({
      poolAprInBps: jest.fn().mockResolvedValue(BigNumber.from(1500)),
    })

    const { result } = renderHook(() =>
      usePoolAprCrossChain(
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

describe('useBorrowerApprovedCrossChain', () => {
  it('returns undefined if contract is not valid', async () => {
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(getContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useBorrowerApprovedCrossChain(
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
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(getContract as jest.Mock).mockReturnValue({
      isApproved: jest.fn(),
    })

    const { result } = renderHook(() =>
      useBorrowerApprovedCrossChain(
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

  it('returns borrower is approved or not', async () => {
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
    })
    ;(getContract as jest.Mock).mockReturnValue({
      isApproved: jest.fn().mockResolvedValueOnce(true),
    })

    const { result } = renderHook(() =>
      useBorrowerApprovedCrossChain(
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
        1,
        'account',
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(true)
    })
  })
})

describe('useAccountStatsCrossChain', () => {
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
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      poolAbi: [],
      poolUnderlyingToken: {
        address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
      },
    })
    ;(getContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useAccountStatsCrossChain(
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

  it('returns initial state if account is not valid', async () => {
    ;(getPoolInfo as jest.Mock).mockReturnValue({
      poolUnderlyingToken: {
        decimals: 6,
      },
    })
    ;(getContract as jest.Mock).mockReturnValue({
      creditRecord: jest.fn(),
      creditRecordStaticMapping: jest.fn(),
      receivableInfoMapping: jest.fn(),
    })

    const { result } = renderHook(() =>
      useAccountStatsCrossChain(
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

  //   it('returns initial state if poolInfo is not valid', async () => {
  //     ;(getPoolInfo as jest.Mock).mockReturnValue(null)
  //     ;(getContract as jest.Mock).mockReturnValue({
  //       creditRecord: jest.fn(),
  //       creditRecordStaticMapping: jest.fn(),
  //       receivableInfoMapping: jest.fn(),
  //     })

  //     const { result } = renderHook(() =>
  //       useAccountStatsCrossChain(
  //         1,
  //         POOL_NAME.HumaCreditLine,
  //         POOL_TYPE.CreditLine,
  //         'account',
  //         [],
  //       ),
  //     )

  //     await waitFor(() => {
  //       expect(result.current[0]).toEqual(initialAccountStats)
  //     })
  //   })

  //   it('returns the account stats', async () => {
  //     ;(getPoolInfo as jest.Mock).mockReturnValue({
  //       pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  //       poolUnderlyingToken: {
  //         decimals: 6,
  //       },
  //     })

  //     const mockCreditRecord1 = {
  //       unbilledPrincipal: BigNumber.from(100000000),
  //       totalDue: BigNumber.from(200000000),
  //       correction: BigNumber.from(5000000),
  //       feesAndInterestDue: BigNumber.from(20000000),
  //       state: 2,
  //     }
  //     const mockCreditRecord2 = {
  //       unbilledPrincipal: BigNumber.from(100000000),
  //       totalDue: BigNumber.from(200000000),
  //       correction: BigNumber.from(5000000),
  //       feesAndInterestDue: BigNumber.from(20000000),
  //       state: 1,
  //     }
  //     const mockCreditRecordStatic = {
  //       creditLimit: BigNumber.from(500000000),
  //     }
  //     const mockReceivableInfo = {
  //       receivableAsset: 'receivableAsset',
  //       receivableAmount: BigNumber.from(10000000),
  //       receivableParam: BigNumber.from('0x0'),
  //     }

  //     ;(useERC20Contract as jest.Mock).mockReturnValue({
  //       balanceOf: jest.fn().mockResolvedValue(BigNumber.from(10000000000)),
  //     })
  //     ;(getContract as jest.Mock).mockReturnValue({
  //       creditRecordMapping: jest
  //         .fn()
  //         .mockResolvedValueOnce(mockCreditRecord1)
  //         .mockResolvedValueOnce(mockCreditRecord2),
  //       creditRecordStaticMapping: jest
  //         .fn()
  //         .mockResolvedValue(mockCreditRecordStatic),
  //       receivableInfoMapping: jest.fn().mockResolvedValue(mockReceivableInfo),
  //     })

  //     const { result } = renderHook(() =>
  //       useAccountStatsCrossChain(
  //         1,
  //         POOL_NAME.HumaCreditLine,
  //         POOL_TYPE.CreditLine,
  //         'account',
  //         [],
  //       ),
  //     )

  //     await waitFor(() => {
  //       expect(result.current[0]).toEqual({
  //         creditRecord: mockCreditRecord1,
  //         creditRecordStatic: mockCreditRecordStatic,
  //         receivableInfo: mockReceivableInfo,
  //         isApproved: true,
  //         payoffAmount: '305.0',
  //         principalAmount: '280.0',
  //         creditAvailableAmount: '220.0',
  //         totalDueAmount: '200.0',
  //       })
  //     })

  //     act(() => {
  //       result.current[1]()
  //     })

  //     await waitFor(() => {
  //       expect(result.current[0]).toEqual({
  //         creditRecord: mockCreditRecord2,
  //         creditRecordStatic: mockCreditRecordStatic,
  //         receivableInfo: mockReceivableInfo,
  //         isApproved: false,
  //         payoffAmount: '305.0',
  //         principalAmount: '280.0',
  //         creditAvailableAmount: '220.0',
  //         totalDueAmount: '200.0',
  //       })
  //     })
  //   })
})

// describe('usePoolAllowanceCrossChain', () => {
//   it('returns initial state if contract is not valid', async () => {
//     ;(getPoolInfo as jest.Mock).mockReturnValue({
//       pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//       poolAbi: [],
//     })
//     ;(useERC20Contract as jest.Mock).mockReturnValue(null)

//     const { result } = renderHook(() =>
//       usePoolAllowanceCrossChain(
//         1,
//         POOL_NAME.HumaCreditLine,
//         POOL_TYPE.CreditLine,
//         'account',
//         [],
//       ),
//     )

//     await waitFor(() => {
//       expect(result.current).toEqual({
//         approved: false,
//         allowance: BigNumber.from(0),
//         loaded: false,
//         refresh: expect.any(Function),
//       })
//     })
//   })

//   it('returns initial state if poolInfo is not valid', async () => {
//     ;(getPoolInfo as jest.Mock).mockReturnValue(null)
//     ;(useERC20Contract as jest.Mock).mockReturnValue({
//       allowance: jest.fn().mockResolvedValue(BigNumber.from(100)),
//     })

//     const { result } = renderHook(() =>
//       usePoolAllowanceCrossChain(
//         1,
//         POOL_NAME.HumaCreditLine,
//         POOL_TYPE.CreditLine,
//         'account',
//         [],
//       ),
//     )

//     await waitFor(() => {
//       expect(result.current).toEqual({
//         approved: false,
//         allowance: BigNumber.from(0),
//         loaded: false,
//         refresh: expect.any(Function),
//       })
//     })
//   })

//   it('returns initial state if account is not valid', async () => {
//     ;(getPoolInfo as jest.Mock).mockReturnValue({
//       pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//       poolAbi: [],
//     })
//     ;(useERC20Contract as jest.Mock).mockReturnValue({
//       allowance: jest
//         .fn()
//         .mockResolvedValueOnce(BigNumber.from(100))
//         .mockResolvedValueOnce(BigNumber.from(MaxUint256)),
//     })

//     const { result } = renderHook(() =>
//       usePoolAllowanceCrossChain(
//         1,
//         POOL_NAME.HumaCreditLine,
//         POOL_TYPE.CreditLine,
//         'account',
//         [],
//       ),
//     )

//     await waitFor(() => {
//       expect(result.current).toEqual({
//         approved: false,
//         allowance: BigNumber.from(0),
//         loaded: false,
//         refresh: expect.any(Function),
//       })
//     })
//   })

//   it('returns correct state', async () => {
//     ;(getPoolInfo as jest.Mock).mockReturnValue({
//       pool: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//       poolAbi: [],
//     })
//     ;(useERC20Contract as jest.Mock).mockReturnValue({
//       allowance: jest
//         .fn()
//         .mockResolvedValueOnce(BigNumber.from(100))
//         .mockResolvedValueOnce(BigNumber.from(MaxUint256)),
//     })

//     const { result } = renderHook(() =>
//       usePoolAllowanceCrossChain(
//         1,
//         POOL_NAME.HumaCreditLine,
//         POOL_TYPE.CreditLine,
//         'account',
//         [],
//       ),
//     )

//     await waitFor(() => {
//       expect(result.current).toEqual({
//         approved: false,
//         allowance: BigNumber.from(100),
//         loaded: true,
//         refresh: expect.any(Function),
//       })
//     })

//     result.current.refresh()

//     await waitFor(() => {
//       expect(result.current).toEqual({
//         approved: true,
//         allowance: BigNumber.from(MaxUint256),
//         loaded: true,
//         refresh: expect.any(Function),
//       })
//     })
//   })
// })

// describe('usePoolTotalSupplyCrossChain', () => {
//   it('returns undefined if chainId is not valid', async () => {
//     ;(getPoolInfo as jest.Mock).mockReturnValue({
//       HDT: {
//         address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//       },
//       poolAbi: [],
//     })
//     ;(getContract as jest.Mock).mockReturnValue({
//       totalSupply: jest.fn().mockResolvedValue(BigNumber.from(100)),
//     })

//     const { result } = renderHook(() =>
//       usePoolTotalSupplyCrossChain(
//         1,
//         POOL_NAME.HumaCreditLine,
//         POOL_TYPE.CreditLine,
//         [],
//       ),
//     )

//     await waitFor(() => {
//       expect(result.current[0]).toBeUndefined()
//     })
//   })

//   it('returns undefined if HDTContract is not valid', async () => {
//     ;(getPoolInfo as jest.Mock).mockReturnValue({
//       HDT: {
//         address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//       },
//       poolAbi: [],
//     })
//     ;(getContract as jest.Mock).mockReturnValue(null)

//     const { result } = renderHook(() =>
//       usePoolTotalSupplyCrossChain(
//         1,
//         POOL_NAME.HumaCreditLine,
//         POOL_TYPE.CreditLine,
//         [],
//       ),
//     )

//     await waitFor(() => {
//       expect(result.current[0]).toBeUndefined()
//     })
//   })

//   it('returns the total supply', async () => {
//     ;(getPoolInfo as jest.Mock).mockReturnValue({
//       HDT: {
//         address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
//       },
//       poolAbi: [],
//     })
//     ;(getContract as jest.Mock).mockReturnValue({
//       totalSupply: jest
//         .fn()
//         .mockResolvedValueOnce(BigNumber.from(100))
//         .mockResolvedValueOnce(BigNumber.from(200)),
//     })

//     const { result } = renderHook(() =>
//       usePoolTotalSupplyCrossChain(
//         1,
//         POOL_NAME.HumaCreditLine,
//         POOL_TYPE.CreditLine,
//         [],
//       ),
//     )

//     await waitFor(() => {
//       expect(result.current[0]).toEqual(BigNumber.from(100))
//     })

//     act(() => {
//       result.current[1]()
//     })

//     await waitFor(() => {
//       expect(result.current[0]).toEqual(BigNumber.from(200))
//     })
//   })
// })
