import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'

import { signERC2612Permit, signTradableStreamPermit } from './ethPermit'

export type ERC2612SignResult = Awaited<ReturnType<typeof signERC2612Permit>>

export const useERC2612Permit = () => {
  const { account, provider, chainId } = useWeb3React()

  const getDeadline = useCallback(async () => {
    const FIVE_MINUTES = 5 * 60
    const latestBlock = await provider!.getBlock('latest')
    return latestBlock.timestamp + FIVE_MINUTES
  }, [provider])

  const getERC2612PermitMessage = useCallback(
    async (tokenAddress: string, spender: string, amount: string) => {
      const deadline = await getDeadline()
      const result = await signERC2612Permit(
        provider,
        tokenAddress,
        account!,
        spender,
        amount,
        deadline,
      )
      return result
    },
    [account, getDeadline, provider],
  )

  const getTradableStreamPermitMessage = useCallback(
    async (
      NFT: string,
      receiver: string,
      tokenAddress: string,
      origin: string,
      owner: string,
      flowrate: string,
      durationInSeconds: number,
    ) => {
      const domain = {
        name: 'TradableStream',
        version: '1',
        chainId: chainId!,
        verifyingContract: NFT,
      }
      const deadline = await getDeadline()
      const result = await signTradableStreamPermit(
        provider,
        domain,
        receiver,
        tokenAddress,
        origin,
        owner,
        flowrate,
        durationInSeconds,
        deadline,
      )
      return result
    },
    [chainId, getDeadline, provider],
  )

  return {
    getERC2612PermitMessage,
    getTradableStreamPermitMessage,
  }
}
