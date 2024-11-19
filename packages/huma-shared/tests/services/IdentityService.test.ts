import { IdentityService } from '../../src/common/services/IdentityService'
import { requestPut } from '../../src/common/utils/request'

jest.mock('../../src/common/utils/request', () => ({
  requestPut: jest.fn(),
}))

jest.mock('../../src/common/utils/config', () => ({
  configUtil: {
    getIdentityAPIUrl: jest.fn().mockReturnValue('http://localhost'),
  },
}))

describe('getVerificationStatus', () => {
  it('returns the verification status', async () => {
    const mockResult = {
      walletAddress: '0x0',
      verificationStatus: 'ACCREDITED',
    }
    ;(requestPut as jest.Mock).mockResolvedValue(mockResult)

    const result = await IdentityService.getVerificationStatus('0x0', '0x0', 1)

    expect(result).toEqual({
      ...mockResult,
      isVerified: true,
      isNotOnboarded: false,
    })
  })

  it('sets isVerified to false if the verification status is not ACCREDITED', async () => {
    const mockResult = {
      walletAddress: '0x0',
      verificationStatus: 'NOT_ACCREDITED',
    }
    ;(requestPut as jest.Mock).mockResolvedValue(mockResult)

    const result = await IdentityService.getVerificationStatus('0x0', '0x0', 1)

    expect(result).toEqual({
      ...mockResult,
      isVerified: false,
      isNotOnboarded: false,
    })
  })

  it('sets isNotOnboarded to true if the verification status is USER_NOT_ONBOARDED', async () => {
    const mockResult = {
      walletAddress: '0x0',
      verificationStatus: 'USER_NOT_ONBOARDED',
    }
    ;(requestPut as jest.Mock).mockResolvedValue(mockResult)

    const result = await IdentityService.getVerificationStatus('0x0', '0x0', 1)

    expect(result).toEqual({
      ...mockResult,
      isVerified: false,
      isNotOnboarded: true,
    })
  })
})
