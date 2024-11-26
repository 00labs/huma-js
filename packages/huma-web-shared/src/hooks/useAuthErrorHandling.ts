/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonRpcProvider } from '@ethersproject/providers'
import {
  AuthService,
  CHAIN_TYPE,
  SiwsMessage,
  SOLANA_CHAINS,
  SolanaChainEnum,
} from '@huma-finance/shared'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import axios, { HttpStatusCode } from 'axios'
import bs58 from 'bs58'
import { useCallback, useEffect, useState } from 'react'
import { SiweMessage } from 'siwe'
import { useAsyncError } from './useAsyncError'

type ErrorType = 'NotSignedIn' | 'UserRejected' | 'Other'

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

const createSiwsMessage = (
  address: string,
  chainId: SolanaChainEnum,
  nonce: string,
  expiresAt: string,
) => {
  const domain = window.location.hostname
  const message = new SiwsMessage({
    domain,
    address,
    statement: 'Please sign in to verify your ownership of this wallet',
    uri: window.location.origin,
    version: '1',
    chainId: SOLANA_CHAINS[chainId].name,
    nonce,
    expirationTime: expiresAt,
  })
  return message.prepareMessage()
}

const verifyEvmOwnership = async (
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

const verifySolanaOwnership = async (
  address: string,
  chainId: number,
  isDev: boolean,
  solanaSignMessage: (message: Uint8Array) => Promise<Uint8Array>,
  onVerificationComplete: () => void,
) => {
  try {
    const { nonce, expiresAt } = await AuthService.createSession(chainId, isDev)
    const message = createSiwsMessage(address, chainId, nonce, expiresAt)
    const encodedMessage = new TextEncoder().encode(message)
    const signedMessage = await solanaSignMessage(encodedMessage)
    const signatureEncoded = bs58.encode(signedMessage as Uint8Array)

    await AuthService.verifySignature(message, signatureEncoded, chainId, isDev)
    onVerificationComplete()
  } catch (error) {
    console.error(error)
  }
}

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
  defaultChainId?: number,
): AuthState => {
  const [error, setError] = useState<unknown>(null)
  const [isVerificationRequired, setIsVerificationRequired] =
    useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const throwError = useAsyncError()
  const handleVerificationCompletion = () => {
    setIsVerified(true)
  }
  const [errorType, setErrorType] = useState<ErrorType | undefined>()

  const {
    account: evmAccount,
    chainId: evmChainId,
    provider: evmProvider,
  } = useWeb3React()
  const { publicKey: solanaPublicKey, signMessage: solanaSignMessage } =
    useWallet()
  const solanaAccount = solanaPublicKey?.toString() ?? ''

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
    const isWalletNotSignInError = error === 'WalletNotSignInException'

    return {
      isUnauthorizedError,
      isWalletNotCreatedError,
      isWalletNotSignInError,
    }
  }, [])

  useEffect(() => {
    if (chainType === CHAIN_TYPE.EVM) {
      if (!evmAccount || !evmChainId || !error || !evmProvider) {
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
        if (chainType === CHAIN_TYPE.EVM) {
          verifyEvmOwnership(
            evmAccount!,
            defaultChainId ?? evmChainId!,
            isDev,
            evmProvider!,
            handleVerificationCompletion,
          ).catch((e) => setError(e))
        }
      } else if ([4001, 'ACTION_REJECTED'].includes((error as any).code)) {
        setErrorType('UserRejected')
      } else {
        setErrorType('Other')
      }
    }
  }, [
    evmChainId,
    isDev,
    error,
    throwError,
    evmAccount,
    evmProvider,
    getErrorInfo,
    chainType,
    defaultChainId,
  ])

  useEffect(() => {
    if (chainType === CHAIN_TYPE.SOLANA) {
      if (!solanaAccount || !error || !solanaSignMessage) {
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
        verifySolanaOwnership(
          solanaAccount,
          isDev ? SolanaChainEnum.SolanaDevnet : SolanaChainEnum.SolanaMainnet,
          isDev,
          solanaSignMessage,
          handleVerificationCompletion,
        ).catch((e) => setError(e))
      } else if ([4001, 'ACTION_REJECTED'].includes((error as any).code)) {
        setErrorType('UserRejected')
      } else {
        setErrorType('Other')
      }
    }
  }, [
    isDev,
    error,
    throwError,
    chainType,
    solanaAccount,
    getErrorInfo,
    solanaSignMessage,
  ])

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
