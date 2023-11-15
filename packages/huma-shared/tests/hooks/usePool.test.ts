import { renderHook } from '@testing-library/react'

import { usePoolInfo } from '../../src/hooks/usePool'
import { POOL_NAME, POOL_TYPE } from '../../src/utils/pool'

jest.mock('react-router', () => ({
  useHistory: jest.fn(),
}))

jest.mock('../../src/hooks/useParamsSearch', () => ({
  useParamsSearch: jest.fn(),
}))

jest.mock('../../src/utils/pool', () => ({
  POOL_NAME: {
    RequestNetwork: 'RequestNetwork',
    HumaCreditLine: 'HumaCreditLine',
  },
  POOL_TYPE: {
    Invoice: 'Invoice',
  },
  PoolContractMap: {
    1: {
      Invoice: {
        RequestNetwork: {
          assetAddress: '0x0',
        },
      },
    },
  },
}))

describe('usePoolInfo', () => {
  it('returns undefined if chainId is not provided', () => {
    const { result } = renderHook(() =>
      usePoolInfo(POOL_NAME.RequestNetwork, POOL_TYPE.Invoice, undefined),
    )

    expect(result.current).toBeUndefined()
  })

  it('returns undefined if poolType is not matched', () => {
    const { result } = renderHook(() =>
      usePoolInfo(POOL_NAME.RequestNetwork, POOL_TYPE.CreditLine, 1),
    )

    expect(result.current).toBeUndefined()
  })

  it('returns undefined if poolName is not matched', () => {
    const { result } = renderHook(() =>
      usePoolInfo(POOL_NAME.HumaCreditLine, POOL_TYPE.Invoice, 1),
    )

    expect(result.current).toBeUndefined()
  })

  it('returns the pool info if info is provided', () => {
    const { result } = renderHook(() =>
      usePoolInfo(POOL_NAME.RequestNetwork, POOL_TYPE.Invoice, 1),
    )

    expect(result.current).toEqual({
      assetAddress: '0x0',
    })
  })
})
