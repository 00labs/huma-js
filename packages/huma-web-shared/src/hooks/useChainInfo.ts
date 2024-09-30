import { CHAIN_TYPE, SolanaChainEnum } from '@huma-finance/shared'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

export const useChainInfo = (
  isDev: boolean,
  chainType: CHAIN_TYPE = CHAIN_TYPE.EVM,
) => {
  const [account, setAccount] = useState<string>()
  const [chainId, setChainId] = useState<number>()

  const { account: evmAccount, chainId: evmChainId } = useWeb3React()
  const { publicKey: solanaPublicKey } = useWallet()

  useEffect(() => {
    const setChainInfo = async () => {
      if (chainType === CHAIN_TYPE.EVM) {
        setAccount(evmAccount)
        setChainId(evmChainId)
        return
      }

      if (chainType === CHAIN_TYPE.SOLANA) {
        setAccount(solanaPublicKey?.toString())
        setChainId(
          isDev ? SolanaChainEnum.SolanaDevnet : SolanaChainEnum.SolanaMainnet,
        )
      }
    }
    setChainInfo()
  }, [chainType, evmAccount, evmChainId, isDev, solanaPublicKey])

  return {
    account,
    chainId,
  }
}
