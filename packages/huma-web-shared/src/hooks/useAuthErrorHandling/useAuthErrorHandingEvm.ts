/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonRpcProvider } from '@ethersproject/providers'
import { AuthService, CHAIN_TYPE } from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { SiweMessage } from 'siwe'
import { ErrorType } from '.'

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
) => {
  const { nonce, expiresAt } = await AuthService.createSession(chainId, isDev)
  const message = createSiweMessage(address, chainId, nonce, expiresAt)
  const signer = await provider.getSigner()
  const signature = await signer.signMessage(message)
  await AuthService.verifySignature(message, signature, chainId, isDev)
  onVerificationComplete()
}

export const useAuthErrorHandingEvm = (
  chainType: CHAIN_TYPE,
  isDev: boolean,
  error: any,
  getErrorInfo: (error: any) => {
    isUnauthorizedError: boolean
    isWalletNotCreatedError: boolean
    isWalletNotSignInError: boolean
  },
  setError: (error: any) => void,
  setErrorType: (errorType: ErrorType) => void,
  setIsVerificationRequired: (isVerificationRequired: boolean) => void,
  handleVerificationCompletion: () => void,
) => {
  const { account, chainId, provider } = useWeb3React()

  useEffect(() => {
    if (chainType === CHAIN_TYPE.EVM) {
      if (!account || !chainId || !error || !provider) {
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
        setErrorType('NotSignedIn')
        setIsVerificationRequired(true)
        verifyOwnershipEvm(
          account,
          chainId,
          isDev,
          provider,
          handleVerificationCompletion,
        ).catch((e) => setError(e))
      } else if ([4001, 'ACTION_REJECTED'].includes((error as any).code)) {
        setErrorType('UserRejected')
      } else {
        setErrorType('Other')
      }
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
    setError,
    setErrorType,
    setIsVerificationRequired,
  ])
}
