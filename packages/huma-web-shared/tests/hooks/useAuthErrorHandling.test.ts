import { JsonRpcProvider } from '@ethersproject/providers'
import { AuthService } from '@huma-finance/shared'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useWeb3React } from '@web3-react/core'

import { useAuthErrorHandling } from '../../src/hooks/useAuthErrorHandling'

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(),
}))
jest.mock('@huma-finance/shared', () => ({
  AuthService: {
    createSession: jest.fn(),
    verifySignature: jest.fn(),
  },
}))
jest.mock('@ethersproject/providers', () => ({
  JsonRpcProvider: jest.fn().mockImplementation(() => ({
    getSigner: jest.fn().mockReturnValue({
      signMessage: jest.fn().mockResolvedValue('signature'),
    }),
  })),
}))
jest.mock('siwe', () => ({
  ...jest.requireActual('siwe'),
  SiweMessage: jest.fn().mockImplementation(() => ({
    prepareMessage: jest.fn().mockReturnValue('mockedMessage'),
  })),
}))

const authError = {
  isAxiosError: true,
  response: {
    status: 401,
    data: {
      detail: {
        type: 'IdTokenNotFoundException',
      },
    },
  },
}
const otherError = new Error()

describe.skip('useAuthErrorHandling', () => {
  afterEach(() => {
    ;(AuthService.createSession as jest.Mock).mockClear()
    ;(AuthService.verifySignature as jest.Mock).mockClear()
  })

  it('verifies wallet ownership when receiving an unauthorized axios error', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      account: 'account',
      chainId: 1,
      provider: new JsonRpcProvider(),
    })
    ;(AuthService.createSession as jest.Mock).mockResolvedValue({
      nonce: 'abcde',
      expiresAt: '2023-08-23T12:04:00+00:00',
    })
    ;(AuthService.verifySignature as jest.Mock).mockResolvedValue(null)

    const { result } = renderHook(() => useAuthErrorHandling(true))
    act(() => {
      result.current.setAuthError(authError)
    })
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerificationRequired).toBeTruthy(),
    )
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerified).toBeTruthy(),
    )
  })

  it('does not do anything if the account is undefined', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      account: undefined,
      chainId: 1,
      provider: 'provider',
    })

    const { result } = renderHook(() => useAuthErrorHandling(true))
    act(() => {
      result.current.setAuthError(otherError)
    })
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerificationRequired).toBeFalsy(),
    )
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerified).toBeFalsy(),
    )
  })

  it('does not do anything if the chain ID is undefined', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      account: 'account',
      chainId: undefined,
      provider: 'provider',
    })

    const { result } = renderHook(() => useAuthErrorHandling(true))
    act(() => {
      result.current.setAuthError(otherError)
    })
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerificationRequired).toBeFalsy(),
    )
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerified).toBeFalsy(),
    )
  })

  it('does not do anything if the provider is undefined', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      account: 'account',
      chainId: 1,
      provider: undefined,
    })

    const { result } = renderHook(() => useAuthErrorHandling(true))
    act(() => {
      result.current.setAuthError(otherError)
    })
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerificationRequired).toBeFalsy(),
    )
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerified).toBeFalsy(),
    )
  })

  it('does not do anything if the error is null', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      account: 'account',
      chainId: 1,
      provider: 'provider',
    })

    const { result } = renderHook(() => useAuthErrorHandling(true))
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerificationRequired).toBeFalsy(),
    )
    await waitFor(() =>
      expect(result.current.isWalletOwnershipVerified).toBeFalsy(),
    )
  })

  it('re-throws the error if it is not an auth error', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      account: 'account',
      chainId: 1,
      provider: 'provider',
    })

    try {
      const { result } = renderHook(() => useAuthErrorHandling(true))
      act(() => {
        result.current.setAuthError(otherError)
      })
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toBe(otherError)
    }
  })

  it('re-throws the error if an error occurred while verifying the signature', async () => {
    const verifySignatureError = new Error('Signature verification failed')
    ;(useWeb3React as jest.Mock).mockReturnValue({
      account: 'account',
      chainId: 1,
      provider: new JsonRpcProvider(),
    })
    ;(AuthService.createSession as jest.Mock).mockResolvedValue({
      nonce: 'abcde',
      expiresAt: '2023-08-23T12:04:00+00:00',
    })
    ;(AuthService.verifySignature as jest.Mock).mockRejectedValue(
      verifySignatureError,
    )

    try {
      const { result } = renderHook(() => useAuthErrorHandling(true))
      act(() => {
        result.current.setAuthError(authError)
      })
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toBe(verifySignatureError)
    }
  })
})
