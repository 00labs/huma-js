/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jest/no-conditional-expect */
import { ChainEnum, getCreditRecordV2, POOL_NAME } from '@huma-finance/shared'
import { BigNumber, ethers } from 'ethers'

import { getTotalDueV2 } from '../../../src/helpers/v2/ReceivableBackedCreditLineContractHelper'

const provider = new ethers.providers.JsonRpcProvider(
  `https://polygon-mainnet.g.alchemy.com/v2/asdfasdfasdfasdf`,
  {
    name: 'matic',
    chainId: ChainEnum.Polygon,
  },
)

jest.mock('@huma-finance/shared', () => ({
  ...jest.requireActual('@huma-finance/shared'),
  getCreditRecordV2: jest.fn(),
}))

describe('getReceivableBackedCreditLineNextDueV2', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return null if creditRecord is not found', async () => {
    ;(getCreditRecordV2 as jest.Mock).mockReturnValue(null)

    const nextDue = await getTotalDueV2(
      POOL_NAME.ArfCreditPool1,
      'account',
      provider,
    )

    expect(nextDue).toBeNull()
  })

  it('should return next due', async () => {
    ;(getCreditRecordV2 as jest.Mock).mockReturnValue({
      nextDue: BigNumber.from('100'),
      totalPastDue: BigNumber.from('200'),
    })

    const nextDue = await getTotalDueV2(
      POOL_NAME.ArfCreditPool1,
      'account',
      provider,
    )

    expect(nextDue).toEqual(BigNumber.from('300'))
  })
})
