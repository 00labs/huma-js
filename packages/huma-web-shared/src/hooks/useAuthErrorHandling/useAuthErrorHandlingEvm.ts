/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonRpcProvider } from '@ethersproject/providers'
import { AuthService, CHAIN_TYPE, CHAINS } from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { SiweMessage } from 'siwe'
import { AUTH_ERROR_TYPE, AUTH_STATUS } from '.'

const createSiweMessage = (
  address: string,
  chainId: number,
  nonce: string,
  expiresAt: string,
) => {
  const domain = window.location.hostname
  const message = new SiweMessage({
    domain,
    address,
    statement: 'Please sign in to verify your ownership of this wallet',
    uri: window.location.origin,
    version: '1',
    chainId,
    nonce,
    expirationTime: expiresAt,
  })
  return message.prepareMessage()
}

export const verifyOwnershipEvm = async (
  address: string,
  chainId: number,
  isDev: boolean,
  provider: JsonRpcProvider,
  onVerificationComplete: () => void,
  setAuthStatus: (authStatus?: AUTH_STATUS) => void,
  setLoading: (loading: boolean) => void,
  reset: () => void,
) => {
  try {
    setLoading(true)
    setAuthStatus(AUTH_STATUS.SignMessage)
    const { nonce, expiresAt } = await AuthService.createSession(chainId, isDev)
    const message = createSiweMessage(address, chainId, nonce, expiresAt)
    const signer = await provider.getSigner()
    const signature = await signer.signMessage(message)
    setAuthStatus(undefined)
    await AuthService.verifySignature(message, signature, chainId, isDev)
    onVerificationComplete()
  } catch (e) {
    console.error(e)
    reset()
    throw e
  } finally {
    setLoading(false)
    setAuthStatus(undefined)
  }
}

export const useAuthErrorHandlingEvm = (
  chainType: CHAIN_TYPE,
  isDev: boolean,
  error: any,
  getErrorInfo: (error: any) => {
    isUnauthorizedError: boolean
    isWalletNotCreatedError: boolean
    isWalletNotSignInError: boolean
  },
  setAuthStatus: (authStatus?: AUTH_STATUS) => void,
  setAuthErrorType: (authErrorType: AUTH_ERROR_TYPE) => void,
  setServerReturnedError: (serverReturnedError: any) => void,
  setIsVerificationRequired: (isVerificationRequired: boolean) => void,
  handleVerificationCompletion: () => void,
  setLoading: (loading: boolean) => void,
  reset: () => void,
) => {
  const { account, chainId, provider } = useWeb3React()

  useEffect(() => {
    if (
      chainType !== CHAIN_TYPE.EVM ||
      !account ||
      !chainId ||
      !error ||
      !provider
    ) {
      return
    }

    const isChainSupported = Object.values(CHAINS).some(
      (chain) => chain.id === chainId,
    )

    if (!isChainSupported) {
      return
    }

    const {
      isUnauthorizedError,
      isWalletNotCreatedError,
      isWalletNotSignInError,
    } = getErrorInfo(error)

    if (
      isUnauthorizedError ||
      isWalletNotCreatedError ||
      isWalletNotSignInError
    ) {
      setAuthErrorType(AUTH_ERROR_TYPE.NotSignedIn)
      setIsVerificationRequired(true)
      verifyOwnershipEvm(
        account,
        chainId,
        isDev,
        provider,
        handleVerificationCompletion,
        setAuthStatus,
        setLoading,
        reset,
      ).catch((e) => {
        setServerReturnedError(e)
      })
    } else if ([4001, 'ACTION_REJECTED'].includes((error as any).code)) {
      setAuthErrorType(AUTH_ERROR_TYPE.UserRejected)
    } else {
      setAuthErrorType(AUTH_ERROR_TYPE.Other)
    }
  }, [
    account,
    chainId,
    chainType,
    error,
    getErrorInfo,
    handleVerificationCompletion,
    isDev,
    provider,
    reset,
    setAuthErrorType,
    setIsVerificationRequired,
    setAuthStatus,
    setServerReturnedError,
    setLoading,
  ])
}
