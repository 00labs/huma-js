import { renderHook } from '@testing-library/react'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router'

import { useParamsSearch } from '../../src/hooks/useParamsSearch'
import {
  usePoolChainCheck,
  usePoolInfo,
  usePoolName,
} from '../../src/hooks/usePool'
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

describe('usePoolName', () => {
  it('returns the pool name if it is valid', () => {
    ;(useParamsSearch as jest.Mock).mockReturnValue({
      poolName: POOL_NAME.HumaCreditLine,
    })
    ;(useHistory as jest.Mock).mockReturnValue({ push: jest.fn() })

    const { result } = renderHook(() => usePoolName())

    expect(result.current).toBe(POOL_NAME.HumaCreditLine)
  })

  it('redirects to the home page if the pool name is not valid', () => {
    const mockPush = jest.fn()
    ;(useParamsSearch as jest.Mock).mockReturnValue({ poolName: 'invalid' })
    ;(useHistory as jest.Mock).mockReturnValue({ push: mockPush })

    renderHook(() => usePoolName())

    expect(mockPush).toHaveBeenCalledWith('/')
  })
})

describe('usePoolChainCheck', () => {
  it('returns the pool name if it is valid and exists in the config', () => {
    const chainId = 1
    const mockPush = jest.fn()
    ;(useParamsSearch as jest.Mock).mockReturnValue({
      poolName: POOL_NAME.RequestNetwork,
    })
    ;(useWeb3React as jest.Mock).mockReturnValue({ chainId })
    ;(useHistory as jest.Mock).mockReturnValue({ push: mockPush })

    const { result } = renderHook(() => usePoolChainCheck())

    expect(result.current).toBe(POOL_NAME.RequestNetwork)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('redirects to the home page if the pool name is not valid or does not exist in the config', () => {
    const chainId = 1
    const mockPush = jest.fn()
    ;(useParamsSearch as jest.Mock).mockReturnValue({ poolName: 'invalid' })
    ;(useWeb3React as jest.Mock).mockReturnValue({ chainId })
    ;(useHistory as jest.Mock).mockReturnValue({ push: mockPush })

    renderHook(() => usePoolChainCheck())

    expect(mockPush).toHaveBeenCalledWith('/')
  })
})

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
