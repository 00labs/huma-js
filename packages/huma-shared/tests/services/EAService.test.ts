import {
  ApprovalResult,
  EAPayload,
  EAService,
} from '../../src/services/EAService'
import { EARejectionError } from '../../src/utils/errors'
import { requestPost } from '../../src/utils/request'

jest.mock('../../src/utils/request', () => ({
  requestPost: jest.fn(),
}))

jest.mock('../../src/utils/config', () => ({
  configUtil: {
    getEAVerseUrl: jest.fn().mockReturnValue('http://localhost'),
    getEABaseUrlV1: jest.fn().mockReturnValue('http://localhost'),
  },
}))

describe('approve', () => {
  it('throws an error if the approval is rejected', async () => {
    const mockPayload: EAPayload = {
      poolAddress: '0x0',
      borrowerWalletAddress: '0x0',
    }
    const mockResult: ApprovalResult = {
      result: {
        reasons: ['reject reason'],
      },
    }
    ;(requestPost as jest.Mock).mockResolvedValue(mockResult)
    await expect(EAService.approve(mockPayload, 1)).rejects.toThrow(
      EARejectionError,
    )
  })

  it('throws an error if the approval result is empty', async () => {
    const mockPayload: EAPayload = {
      poolAddress: '0x0',
      borrowerWalletAddress: '0x0',
    }
    const mockResult = {
      result: null,
    }
    ;(requestPost as jest.Mock).mockResolvedValue(mockResult)
    await expect(EAService.approve(mockPayload, 1)).rejects.toThrow(
      'Sorry, there was an error approving your wallet',
    )
  })

  it('returns the approval if the approval is accepted', async () => {
    const mockPayload: EAPayload = {
      poolAddress: '0x0',
      borrowerWalletAddress: '0x0',
    }
    const mockResult = {
      result: {
        token: {
          symbol: 'USDC',
          name: 'USDC',
          decimal: 6,
        },
        receivable: {
          amount: 1000000000,
        },
        terms: {
          creditLimit: 1000000000,
          amount: 1000000000,
          intervalInDays: 30,
          remainingPeriods: 12,
          aprInBps: 500,
        },
      },
    }
    ;(requestPost as jest.Mock).mockResolvedValue(mockResult)

    const result = await EAService.approve(mockPayload, 1)

    console.log(JSON.stringify(result))

    expect(result).toEqual({
      token: { symbol: 'USDC', name: 'USDC', decimal: 6 },
      receivable: { amount: '1000000000', amountFormatted: '1000.0' },
      terms: {
        creditLimit: '1000000000',
        creditLimitFormatted: '1000.0',
        amount: 1000000000,
        intervalInDays: 30,
        remainingPeriods: 12,
        aprInBps: 500,
      },
    })
  })
})

describe('approveLender', () => {
  it('throws an error if the request returns error', async () => {
    const mockPayload = {
      poolAddress: '0x0',
      lenderWalletAddress: '0x0',
    }
    ;(requestPost as jest.Mock)
      .mockRejectedValueOnce({})
      .mockRejectedValueOnce({
        message: 'Something is wrong',
      })

    await expect(EAService.approveLender(mockPayload, 1)).rejects.toThrow(
      'Sorry, there was an error approving your wallet as a lender.',
    )
    await expect(EAService.approveLender(mockPayload, 1)).rejects.toThrow(
      'Something is wrong',
    )
  })

  it('throws an error if the approval is rejected', async () => {
    const mockPayload = {
      poolAddress: '0x0',
      lenderWalletAddress: '0x0',
    }
    ;(requestPost as jest.Mock)
      .mockResolvedValueOnce({
        statusCode: 500,
      })
      .mockResolvedValueOnce({
        statusCode: 500,
        errorMessage: ['Insufficient tx activities'],
      })
      .mockResolvedValueOnce({
        status: 500,
        reason: ['Insufficient balance'],
      })
      .mockResolvedValueOnce({
        rejectionReason: ['Insufficient allowance'],
      })

    await expect(EAService.approveLender(mockPayload, 1)).rejects.toThrow(
      'Sorry, there was an error approving your wallet as a lender.',
    )
    await expect(EAService.approveLender(mockPayload, 1)).rejects.toThrow(
      'Insufficient tx activities',
    )
    await expect(EAService.approveLender(mockPayload, 1)).rejects.toThrow(
      'Insufficient balance',
    )
    await expect(EAService.approveLender(mockPayload, 1)).rejects.toThrow(
      'Insufficient allowance',
    )
  })

  it('returns the approval if the approval is accepted', async () => {
    const mockPayload = {
      poolAddress: '0x0',
      lenderWalletAddress: '0x0',
    }
    const mockResult = {
      result: true,
    }
    ;(requestPost as jest.Mock).mockResolvedValue(mockResult)

    const result = await EAService.approveLender(mockPayload, 1)

    expect(result).toEqual(mockResult)
  })
})
