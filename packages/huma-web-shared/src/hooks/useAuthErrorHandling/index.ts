/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHAIN_TYPE } from '@huma-finance/shared'
import axios, { HttpStatusCode } from 'axios'
import { useCallback, useState } from 'react'
import { useAuthErrorHandlingEvm } from './useAuthErrorHandlingEvm'
import { useAuthErrorHandlingSolana } from './useAuthErrorHandlingSolana'

export type ErrorType = 'NotSignedIn' | 'UserRejected' | 'Other'

export type AuthState = {
  isWalletOwnershipVerificationRequired: boolean
  isWalletOwnershipVerified: boolean
  errorType?: ErrorType
  error: unknown
  setError: React.Dispatch<React.SetStateAction<unknown>>
  reset: () => void
}

export const useAuthErrorHandling = (
  isDev: boolean,
  chainType: CHAIN_TYPE = CHAIN_TYPE.EVM,
): AuthState => {
  const [error, setError] = useState<unknown>(null)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [errorType, setErrorType] = useState<ErrorType | undefined>()
  const [isVerificationRequired, setIsVerificationRequired] =
    useState<boolean>(false)

  const handleVerificationCompletion = useCallback(() => {
    setIsVerified(true)
  }, [])

  const getErrorInfo = useCallback((error: any) => {
    const isUnauthorizedError =
      axios.isAxiosError(error) &&
      error.response?.status === HttpStatusCode.Unauthorized &&
      [
        'IdTokenNotFoundException',
        'InvalidIdTokenException',
        'WalletMismatchException',
        'AccountTokenNotFoundException',
        'InvalidAccountTokenException',
      ].includes(error.response?.data?.detail?.type)

    const isWalletNotCreatedError = error === 'WalletNotCreatedException'
    const isWalletNotSignInError = error === 'WalletNotSignedInException'

    return {
      isUnauthorizedError,
      isWalletNotCreatedError,
      isWalletNotSignInError,
    }
  }, [])

  useAuthErrorHandlingEvm(
    chainType,
    isDev,
    error,
    getErrorInfo,
    setError,
    setErrorType,
    setIsVerificationRequired,
    handleVerificationCompletion,
  )
  useAuthErrorHandlingSolana(
    chainType,
    isDev,
    error,
    getErrorInfo,
    setError,
    setErrorType,
    setIsVerificationRequired,
    handleVerificationCompletion,
  )

  const reset = useCallback(() => {
    setIsVerificationRequired(false)
    setIsVerified(false)
    setError(null)
    setErrorType(undefined)
  }, [])

  return {
    isWalletOwnershipVerificationRequired: isVerificationRequired,
    isWalletOwnershipVerified: isVerified,
    errorType,
    error,
    setError,
    reset,
  }
}
