import { Web3Provider } from '@ethersproject/providers'
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
  const [provider, setProvider] = useState<Web3Provider>()

  const {
    account: evmAccount,
    chainId: evmChainId,
    provider: evmProvider,
  } = useWeb3React()
  const { publicKey: solanaPublicKey } = useWallet()

  useEffect(() => {
    if (chainType === CHAIN_TYPE.EVM) {
      setAccount(evmAccount)
      setChainId(evmChainId)
      setProvider(evmProvider)
      return
    }

    if (chainType === CHAIN_TYPE.SOLANA) {
      setAccount(solanaPublicKey?.toString())
      setChainId(
        isDev ? SolanaChainEnum.SolanaDevnet : SolanaChainEnum.SolanaMainnet,
      )
    }
  }, [chainType, evmAccount, evmChainId, evmProvider, isDev, solanaPublicKey])

  return {
    account,
    chainId,
    provider,
  }
}

export const useActiveChainInfo = (
  isDev: boolean,
  activeNetwork: CHAIN_TYPE,
) => {
  const evmChainInfo = useChainInfo(isDev, CHAIN_TYPE.EVM)
  const solanaChainInfo = useChainInfo(isDev, CHAIN_TYPE.SOLANA)

  if (activeNetwork === CHAIN_TYPE.EVM) {
    return evmChainInfo
  }
  if (activeNetwork === CHAIN_TYPE.SOLANA) {
    return solanaChainInfo
  }
  return null
}
