import { useState, useEffect } from 'react'
import { StellarChainInfo } from '@huma-finance/shared'
import { fetchStellarTokenBalance } from '../utils'

export const useStellarTokenBalance = (
  chainMetadata: StellarChainInfo,
  tokenAddress: string,
  accountAddress: string,
  sourceAddress?: string,
): {
  tokenBalance: number | null
  isLoadingTokenBalance: boolean
} => {
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)
  const [isLoadingTokenBalance, setIsLoadingTokenBalance] =
    useState<boolean>(true)

  useEffect(() => {
    const getTokenBalance = async () => {
      setIsLoadingTokenBalance(true)
      try {
        const fetchedBalance = await fetchStellarTokenBalance(
          chainMetadata,
          tokenAddress,
          accountAddress,
          sourceAddress,
        )
        setTokenBalance(fetchedBalance)
      } catch (error) {
        console.error('Error fetching token balance:', error)
      } finally {
        setIsLoadingTokenBalance(false)
      }
    }

    getTokenBalance()
  }, [chainMetadata, tokenAddress, accountAddress, sourceAddress])

  return { tokenBalance, isLoadingTokenBalance }
}
