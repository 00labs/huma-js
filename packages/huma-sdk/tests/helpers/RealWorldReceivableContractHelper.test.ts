import { ethers } from 'ethers'

import { getRealWorldReceivableContract } from '../../src/helpers/RealWorldReceivableContractHelper'

jest.mock('ethers')

describe('getRealWorldReceivableContract', () => {
  it('should return the RealWorldReceivable contract instance', () => {
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 1

    const contract = getRealWorldReceivableContract(
      mockSignerOrProvider,
      mockChainId,
    )

    expect(contract).toBeDefined()
  })

  it('should return null if the RealWorldReceivable contract is not found', () => {
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 2

    const contract = getRealWorldReceivableContract(
      mockSignerOrProvider,
      mockChainId,
    )

    expect(contract).toBeNull()
  })
})
