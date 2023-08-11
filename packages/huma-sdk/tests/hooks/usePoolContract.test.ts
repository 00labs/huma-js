import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { renderHook, waitFor } from '@testing-library/react'
import { ethers } from 'ethers'

import { useContract } from '../../src/hooks/useContract'
import {
  useCreditRecordDetails,
  usePoolContract,
} from '../../src/hooks/usePoolContract'

jest.mock('../../src/hooks/useContract', () => ({
  useContract: jest.fn(),
}))

describe('usePoolContract', () => {
  it('should return the pool contract instance', () => {
    ;(useContract as jest.Mock).mockReturnValue({})
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()

    const contract = usePoolContract(
      mockSignerOrProvider,
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )

    expect(contract).toBeDefined()
  })

  it('should return null if the pool contract is not found', () => {
    ;(useContract as jest.Mock).mockReturnValue(null)
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 2

    const contract = usePoolContract(
      mockSignerOrProvider,
      mockChainId,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )

    expect(contract).toBeNull()
  })
})

describe('useCreditRecordDetails', () => {
  it('should return the credit record details and refresh function', async () => {
    ;(useContract as jest.Mock).mockReturnValue({
      creditRecordMapping: jest.fn().mockResolvedValue({
        creditLimit: '100',
      }),
      creditRecordStaticMapping: jest.fn().mockResolvedValue({
        aprInBps: 100,
      }),
    })

    const mockUserAddress = '0x123'
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 1

    const { result } = renderHook(() =>
      useCreditRecordDetails(
        mockUserAddress,
        mockSignerOrProvider,
        mockChainId,
        POOL_NAME.HumaCreditLine,
        POOL_TYPE.CreditLine,
      ),
    )

    await waitFor(() => {
      expect(result.current[0]?.creditLimit).toBe('100')
    })
    await waitFor(() => {
      expect(result.current[0]?.aprInBps).toBe(100)
    })
  })
})
