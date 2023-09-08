import { useWeb3React } from '@web3-react/core'
import { PoolInfoType, toBigNumber } from '@huma-finance/shared'
import React, { useEffect } from 'react'

import useEA from '../../hooks/useEA'
import { LoadingModal } from '../LoadingModal'
import { WIDGET_STEP } from '../../store/widgets.store'
import { SignIn } from '../SignIn'

type Props = {
  poolInfo: PoolInfoType
  tokenId: string
}

export function Evaluation({ poolInfo, tokenId }: Props): React.ReactElement {
  const {
    checkingEA,
    isWalletOwnershipVerificationRequired,
    isWalletOwnershipVerified,
  } = useEA()
  const { account, chainId } = useWeb3React()

  useEffect(() => {
    if (account && chainId) {
      checkingEA(
        {
          poolAddress: poolInfo.pool,
          borrowerWalletAddress: account,
          context: {
            receivable: {
              address: poolInfo.assetAddress!,
              param: toBigNumber(tokenId).toHexString(),
            },
          },
        },
        WIDGET_STEP.ChooseAmount,
      )
    }
  }, [
    account,
    chainId,
    checkingEA,
    poolInfo.assetAddress,
    poolInfo.pool,
    tokenId,
    isWalletOwnershipVerified,
  ])

  if (isWalletOwnershipVerificationRequired) {
    return <SignIn />
  }
  return (
    <LoadingModal
      title='Checking Invoice'
      description='Checking if the invoice qualifies for factoring...'
    />
  )
}
