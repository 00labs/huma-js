import { useState, useEffect } from 'react'
import axios, { HttpStatusCode } from 'axios'
import { SiweMessage } from 'siwe'
import { useWeb3React } from '@web3-react/core'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useAsyncError } from './useAsyncError'
import { AuthService } from '../services'

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

const verifyOwnership = async (
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

export type AuthState = {
  isWalletOwnershipVerificationRequired: boolean
  isWalletOwnershipVerified: boolean
  setError: React.Dispatch<React.SetStateAction<unknown>>
}

export const useAuthErrorHandling = (isDev: boolean): AuthState => {
  const [error, setError] = useState<unknown>(null)
  const [isVerificationRequired, setIsVerificationRequired] =
    useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const { account, chainId, provider } = useWeb3React()
  const throwError = useAsyncError()
  const handleVerificationCompletion = () => {
    setIsVerified(true)
  }

  useEffect(() => {
    if (!account || !chainId || !error || !provider) {
      return
    }
    if (
      axios.isAxiosError(error) &&
      error.response?.status === HttpStatusCode.Unauthorized &&
      [
        'IdTokenNotFoundException',
        'InvalidIdTokenException',
        'WalletMismatchException',
      ].includes(error.response?.data?.detail?.type)
    ) {
      setIsVerificationRequired(true)
      verifyOwnership(
        account,
        chainId,
        isDev,
        provider,
        handleVerificationCompletion,
      ).catch((e) => throwError(e))
    } else {
      throwError(error)
    }
  }, [chainId, isDev, error, throwError, account, provider])

  return {
    isWalletOwnershipVerificationRequired: isVerificationRequired,
    isWalletOwnershipVerified: isVerified,
    setError,
  }
}
