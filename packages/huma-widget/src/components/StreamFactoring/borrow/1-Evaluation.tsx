import { useWeb3React } from '@web3-react/core'
import { PoolInfoType } from '@huma-finance/shared'
import React, { useEffect } from 'react'

import useEA from '../../../hooks/useEA'
import { LoadingModal } from '../../LoadingModal'
import { WIDGET_STEP } from '../../../store/widgets.store'

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
  const { account } = useWeb3React()
  const { checkingEA } = useEA()

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
            payerWalletAddress: payerAddress,
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
  ])

  return (
    <LoadingModal
      title='Checking Stream'
      description='Checking if the stream qualifies for factoring...'
    />
  )
}
