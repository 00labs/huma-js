import { ethers } from 'ethers'

import { useContract } from '../../src/hooks/useContract'
import { useRealWorldReceivableContract } from '../../src/hooks/useRealWorldReceivableContract'

jest.mock('../../src/hooks/useContract', () => ({
  useContract: jest.fn(),
}))

describe('useRealWorldReceivableContract', () => {
  it('should return the RealWorldReceivable contract instance', () => {
    ;(useContract as jest.Mock).mockReturnValue({})

    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 1

    const contract = useRealWorldReceivableContract(
      mockSignerOrProvider,
      mockChainId,
    )

    expect(contract).toBeDefined()
  })

  it('should return null if the ERC20TransferableReceivable contract is not found', () => {
    ;(useContract as jest.Mock).mockImplementation(() => null)

    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 2

    const contract = useRealWorldReceivableContract(
      mockSignerOrProvider,
      mockChainId,
    )

    expect(contract).toBeNull()
  })
})
