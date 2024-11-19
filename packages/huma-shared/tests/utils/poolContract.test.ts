/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from 'ethers'

import { getChainIdFromSignerOrProvider } from '../../src/evm/utils/chain'
import { getPoolInfo } from '../../src/evm/utils/pool'
import { getPoolApr } from '../../src/evm/utils/poolContract'
import { getContract } from '../../src/evm/utils/web3'

jest.mock('../../src/evm/utils/pool', () => ({
  PoolContractMap: {
    5: {
      CreditLine: {
        HumaCreditLine: {
          pool: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
          HDT: {
            address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
            abi: [],
          },
          estAPY: '10-20%',
          poolUnderlyingToken: {
            address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
            symbol: 'USDC',
            decimals: 6,
            icon: 'USDC',
          },
        },
      },
    },
  },
}))

jest.mock('../../src/evm/utils/chain', () => ({
  getContract: jest.fn(),
  getERC20Contract: jest.fn(),
  getChainIdFromSignerOrProvider: jest.fn(),
}))

jest.mock('../../src/evm/utils/web3', () => ({
  getContract: jest.fn(),
  getERC20Contract: jest.fn(),
}))

jest.mock('../../src/evm/utils/pool', () => ({
  getPoolInfo: jest.fn(),
}))

describe('getPoolApr', () => {
  it('should return undefined if poolInfo is invalid', async () => {
    const invalidChainId = -1
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(
      invalidChainId,
    )

    const result = await getPoolApr(
      'invalidPoolName' as any,
      'CreditLine' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(undefined)
  })

  it('should return undefined if contract is invalid', async () => {
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(5)
    ;(getContract as jest.Mock).mockReturnValue(undefined)

    const result = await getPoolApr(
      'HumaCreditLine' as any,
      'CreditLine' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(undefined)
  })

  it('should return the correct pool apr', async () => {
    ;(getPoolInfo as jest.Mock).mockReturnValue({})
    ;(getContract as jest.Mock).mockReturnValue({
      poolAprInBps: jest.fn().mockResolvedValue(BigNumber.from('50000')),
    })
    ;(getChainIdFromSignerOrProvider as jest.Mock).mockResolvedValue(5)

    const result = await getPoolApr(
      'HumaCreditLine' as any,
      'CreditLine' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(5)
  })
})
