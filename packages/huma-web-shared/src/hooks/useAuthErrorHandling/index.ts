/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHAIN_TYPE, HUMA_ACCOUNT_EXCEPTION } from '@huma-finance/shared'
import axios, { HttpStatusCode } from 'axios'
import { useCallback, useState } from 'react'
import { useAuthErrorHandlingEvm } from './useAuthErrorHandlingEvm'
import { useAuthErrorHandlingSolana } from './useAuthErrorHandlingSolana'

export enum AUTH_ERROR_TYPE {
  NotSignedIn = 'NotSignedIn',
  UserRejected = 'UserRejected',
  Other = 'Other',
}

export type AuthState = {
  isWalletOwnershipVerificationRequired: boolean
  isWalletOwnershipVerified: boolean
  authErrorType?: AUTH_ERROR_TYPE
  authError: unknown
  serverError: unknown
  loading: boolean
  setAuthError: React.Dispatch<React.SetStateAction<unknown>>
  reset: () => void
}

export const useAuthErrorHandling = (
  isDev: boolean,
  chainType: CHAIN_TYPE = CHAIN_TYPE.EVM,
): AuthState => {
  const [authError, setAuthError] = useState<unknown>(null)
  const [authErrorType, setAuthErrorType] = useState<
    AUTH_ERROR_TYPE | undefined
  >()
  const [serverError, setServerError] = useState<unknown>(null)
  const [isVerified, setIsVerified] = useState<boolean>(false)
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
    setAuthError(null)
    setAuthErrorType(undefined)
    setServerError(undefined)
  }, [])

  useAuthErrorHandlingEvm(
    chainType,
    isDev,
    authError,
    getErrorInfo,
    setAuthError,
    setAuthErrorType,
    setServerError,
    setIsVerificationRequired,
    handleVerificationCompletion,
    setLoading,
    reset,
  )
  useAuthErrorHandlingSolana(
    chainType,
    isDev,
    authError,
    getErrorInfo,
    setAuthError,
    setAuthErrorType,
    setServerError,
    setIsVerificationRequired,
    handleVerificationCompletion,
    setLoading,
    reset,
  )

  return {
    isWalletOwnershipVerificationRequired: isVerificationRequired,
    isWalletOwnershipVerified: isVerified,
    authErrorType,
    authError,
    serverError,
    loading,
    setAuthError,
    reset,
  }
}
