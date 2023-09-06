import { renderHook } from '@testing-library/react'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router'

import { useParamsSearch } from '../../src/hooks/useParamsSearch'
import { usePoolInfo } from '../../src/hooks/usePool'
import { POOL_NAME, POOL_TYPE } from '../../src/utils/pool'

jest.mock('react-router', () => ({
  useHistory: jest.fn(),
}))

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(),
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
    ;(useWeb3React as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() =>
      usePoolInfo(POOL_NAME.RequestNetwork, POOL_TYPE.Invoice),
    )

    expect(result.current).toBeUndefined()
  })

  it('returns undefined if poolType is not matched', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 1,
    })

    const { result } = renderHook(() =>
      usePoolInfo(POOL_NAME.RequestNetwork, POOL_TYPE.CreditLine),
    )

    expect(result.current).toBeUndefined()
  })

  it('returns undefined if poolName is not matched', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 1,
    })

    const { result } = renderHook(() =>
      usePoolInfo(POOL_NAME.HumaCreditLine, POOL_TYPE.Invoice),
    )

    expect(result.current).toBeUndefined()
  })

  it('returns the pool info if info is provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({ chainId: 1 })

    const { result } = renderHook(() =>
      usePoolInfo(POOL_NAME.RequestNetwork, POOL_TYPE.Invoice),
    )

    expect(result.current).toEqual({
      assetAddress: '0x0',
    })
  })
})
