import { POOL_NAME } from '@huma-finance/shared'
import { ethers } from 'ethers'

import { useContract } from '../../src/hooks/useContract'
import { useERC20TransferableReceivableContract } from '../../src/hooks/useERC20TransferableReceivableContract'

jest.mock('../../src/hooks/useContract', () => ({
  useContract: jest.fn(),
}))

describe('useERC20TransferableReceivableContract', () => {
  it('should return the ERC20TransferableReceivable contract instance', () => {
    ;(useContract as jest.Mock).mockReturnValue({})

    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 1

    const contract = useERC20TransferableReceivableContract(
      mockSignerOrProvider,
      mockChainId,
      POOL_NAME.HumaCreditLine,
    )

    expect(contract).toBeDefined()
  })

  it('should return null if the ERC20TransferableReceivable contract is not found', () => {
    ;(useContract as jest.Mock).mockImplementation(() => null)

    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 2

    const contract = useERC20TransferableReceivableContract(
      mockSignerOrProvider,
      mockChainId,
      POOL_NAME.HumaCreditLine,
    )

    expect(contract).toBeNull()
  })
})
