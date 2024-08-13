import { arrayify } from '@ethersproject/bytes'
import { ChainEnum, getBlockchainConfigFromChain } from '@huma-finance/shared'
import { NotifiContextProvider } from '@notifi-network/notifi-react'
import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import React, { useMemo } from 'react'

type Props = {
  chainId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any
}

export function NotifiContextWrapper({
  chainId,
  children,
}: Props): React.ReactElement | null {
  const { account, provider } = useWeb3React()
  const signer = useMemo(() => {
    if (provider instanceof providers.JsonRpcProvider) {
      return provider.getSigner()
    }
    return undefined
  }, [provider])

  if (account == null || signer == null || chainId == null) {
    return null
  }

  let cardId = ''
  if (chainId === ChainEnum.Celo || chainId === ChainEnum.Alfajores) {
    cardId = process.env.REACT_APP_NOTIFI_CONFIG_ID_CELO ?? ''
  } else if (chainId === ChainEnum.Polygon || chainId === ChainEnum.Amoy) {
    cardId = process.env.REACT_APP_NOTIFI_CONFIG_ID_POLYGON ?? ''
  } else if (
    chainId === ChainEnum.Scroll ||
    chainId === ChainEnum.ScrollSepolia
  ) {
    cardId = process.env.REACT_APP_NOTIFI_CONFIG_ID_SCROLL ?? ''
  }

  return (
    <NotifiContextProvider
      tenantId='humafinanceprod'
      env='Production'
      signMessage={async (message: Uint8Array) => {
        const result = await signer.signMessage(message)
        return arrayify(result)
      }}
      walletPublicKey={account}
      walletBlockchain={getBlockchainConfigFromChain(chainId)}
      cardId={cardId}
    >
      {children}
    </NotifiContextProvider>
  )
}
