import { useState, useEffect } from 'react'
import axios from 'axios'
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
  isWalletOwnershipVerified: boolean
  setError: React.Dispatch<React.SetStateAction<unknown>>
}

export const useAuthErrorHandling = (
  address: string | undefined,
  chainId: number | undefined,
  isDev: boolean,
): AuthState => {
  const [error, setError] = useState<unknown>(null)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const { provider } = useWeb3React()
  const throwError = useAsyncError()

  useEffect(() => {
    if (
      address === undefined ||
      chainId === undefined ||
      error === null ||
      provider === undefined
    ) {
      return
    }
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      [
        'IdTokenNotFoundException',
        'InvalidIdTokenException',
        'WalletMismatchException',
      ].includes(error.response?.data?.detail?.type)
    ) {
      verifyOwnership(address, chainId, isDev, provider, () =>
        setIsVerified(true),
      ).catch((e) => throwError(e))
    } else {
      throwError(error)
    }
  }, [chainId, isDev, error, throwError, address, provider])

  return {
    isWalletOwnershipVerified: isVerified,
    setError,
  }
}
