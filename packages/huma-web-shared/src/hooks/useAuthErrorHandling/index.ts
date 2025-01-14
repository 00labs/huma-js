/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHAIN_TYPE, HUMA_ACCOUNT_EXCEPTION } from '@huma-finance/shared'
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
  loading: boolean
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
  const [loading, setLoading] = useState<boolean>(false)

  const handleVerificationCompletion = useCallback(() => {
    setIsVerified(true)
  }, [])

  const getErrorInfo = useCallback((error: any) => {
    const isUnauthorizedError =
      axios.isAxiosError(error) &&
      error.response?.status === HttpStatusCode.Unauthorized &&
      [
        HUMA_ACCOUNT_EXCEPTION.AccountTokenNotFoundException,
        HUMA_ACCOUNT_EXCEPTION.InvalidAccountTokenException,
      ].includes(error.response?.data?.detail?.type)

    const isWalletNotCreatedError =
      error === HUMA_ACCOUNT_EXCEPTION.WalletNotCreatedException
    const isWalletNotSignInError =
      error === HUMA_ACCOUNT_EXCEPTION.WalletNotSignedInException

    return {
      isUnauthorizedError,
      isWalletNotCreatedError,
      isWalletNotSignInError,
    }
  }, [])

  const reset = useCallback(() => {
    setIsVerificationRequired(false)
    setIsVerified(false)
    setError(null)
    setErrorType(undefined)
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
    setLoading,
    reset,
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
    setLoading,
    reset,
  )

  return {
    isWalletOwnershipVerificationRequired: isVerificationRequired,
    isWalletOwnershipVerified: isVerified,
    errorType,
    error,
    loading,
    setError,
    reset,
  }
}
