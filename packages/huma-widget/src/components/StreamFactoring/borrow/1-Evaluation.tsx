import { getAddress } from '@ethersproject/address'
import { PoolInfoType } from '@huma-shan/core'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'

import useEA from '../../../hooks/useEA'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { SignIn } from '../../SignIn'

type Props = {
  poolInfo: PoolInfoType
  payerAddress: string
  superToken: string
}

export function Evaluation({
  poolInfo,
  payerAddress,
  superToken,
}: Props): React.ReactElement {
  const {
    checkingEA,
    isWalletOwnershipVerificationRequired,
    isWalletOwnershipVerified,
  } = useEA()
  const { account } = useWeb3React()

  useEffect(() => {
    if (account) {
      checkingEA(
        {
          poolAddress: poolInfo.pool,
          borrowerWalletAddress: account,
          context: {
            receivable: {
              address: poolInfo.assetAddress!,
            },
            payerWalletAddress: getAddress(payerAddress),
            superToken,
          },
        },
        WIDGET_STEP.ChooseAmount,
      )
    }
  }, [
    account,
    checkingEA,
    payerAddress,
    poolInfo.assetAddress,
    poolInfo.pool,
    superToken,
    isWalletOwnershipVerified,
  ])

  if (isWalletOwnershipVerificationRequired) {
    return <SignIn />
  }
  return (
    <LoadingModal
      title='Checking Stream'
      description='Checking if the stream qualifies for factoring...'
    />
  )
}
