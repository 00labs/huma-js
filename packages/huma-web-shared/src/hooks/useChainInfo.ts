import { Web3Provider } from '@ethersproject/providers'
import {
  CHAIN_TYPE,
  SolanaChainEnum,
  StellarChainEnum,
} from '@huma-finance/shared'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import { useContext, useEffect, useState } from 'react'
import { StellarConnectionContext } from '../stellar'

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
  const { address: stellarAccount } = useContext(StellarConnectionContext)

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

    if (chainType === CHAIN_TYPE.STELLAR) {
      setAccount(stellarAccount?.toString())
      setChainId(
        isDev
          ? StellarChainEnum.StellarTestnet
          : StellarChainEnum.StellarMainnet,
      )
    }
  }, [
    chainType,
    evmAccount,
    evmChainId,
    evmProvider,
    isDev,
    solanaPublicKey,
    stellarAccount,
  ])

  return {
    account,
    chainId,
    provider,
  }
}

export const useChainsInfo = (isDev: boolean) => {
  const { account: evmAccount, chainId: evmChainId } = useChainInfo(
    isDev,
    CHAIN_TYPE.EVM,
  )
  const { account: solanaAccount, chainId: solanaChainId } = useChainInfo(
    isDev,
    CHAIN_TYPE.SOLANA,
  )
  const { account: stellarAccount, chainId: stellarChainId } = useChainInfo(
    isDev,
    CHAIN_TYPE.STELLAR,
  )

  return {
    evmAccount,
    evmChainId,
    solanaAccount,
    solanaChainId,
    stellarAccount,
    stellarChainId,
  }
}

export const useActiveChainInfo = (
  isDev: boolean,
  activeNetwork: CHAIN_TYPE,
) => {
  const evmChainInfo = useChainInfo(isDev, CHAIN_TYPE.EVM)
  const solanaChainInfo = useChainInfo(isDev, CHAIN_TYPE.SOLANA)
  const stellarChainInfo = useChainInfo(isDev, CHAIN_TYPE.STELLAR)

  switch (activeNetwork) {
    case CHAIN_TYPE.EVM:
      return evmChainInfo
    case CHAIN_TYPE.SOLANA:
      return solanaChainInfo
    case CHAIN_TYPE.STELLAR:
      return stellarChainInfo
    default:
      return null
  }
}

export const useActiveAccountChain = (isDev: boolean): CHAIN_TYPE | null => {
  const evmChainInfo = useChainInfo(isDev, CHAIN_TYPE.EVM)
  const solanaChainInfo = useChainInfo(isDev, CHAIN_TYPE.SOLANA)
  const stellarChainInfo = useChainInfo(isDev, CHAIN_TYPE.STELLAR)

  if (evmChainInfo.account) {
    return CHAIN_TYPE.EVM
  }
  if (solanaChainInfo.account) {
    return CHAIN_TYPE.SOLANA
  }
  if (stellarChainInfo.account) {
    return CHAIN_TYPE.STELLAR
  }

  return null
}
