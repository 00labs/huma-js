import { ethers } from 'ethers'
import { ChainEnum } from '@huma-finance/shared'
import { getERC20TransferableReceivableContract } from '../../src/helpers/ERC20TransferableReceivableContractHelper'
import { getContract } from '../../src/utils/web3'

jest.mock('../../src/utils/web3', () => ({
  getContract: jest.fn(),
  getERC20Contract: jest.fn(),
}))

describe('getERC20TransferableReceivableContract', () => {
  it('should return null if the ERC20TransferableReceivable contract is not found', () => {
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()
    const mockChainId = 2

    const contract = getERC20TransferableReceivableContract(
      mockSignerOrProvider,
      mockChainId,
    )

    expect(contract).toBeNull()
  })

  it('should return the contract instance for the ERC20TransferableReceivable contract', () => {
    ;(getContract as jest.Mock).mockReturnValue({
      approve: jest.fn().mockResolvedValue({
        wait: () => Promise.resolve(100),
      }),
    })

    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()

    const contract = getERC20TransferableReceivableContract(
      mockSignerOrProvider,
      ChainEnum.Goerli,
    )

    expect(contract?.approve).toBeDefined()
  })
})
