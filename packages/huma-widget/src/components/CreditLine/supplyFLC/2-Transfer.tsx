import {
  FirstLossCoverIndex,
  PoolInfoV2,
  useFirstLossCoverContractV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import React, { useCallback } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  amountToDeposit: BigNumber
}

export function Transfer({
  poolInfo,
  amountToDeposit,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { provider, account } = useWeb3React()
  const firstLossCoverContract = useFirstLossCoverContractV2(
    poolInfo.poolName,
    FirstLossCoverIndex.borrower,
    provider,
    account,
  )

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!firstLossCoverContract) {
    return <LoadingModal title='Enable Pool' />
  }

  return (
    <TxSendModalV2
      title='Enable Pool'
      contract={firstLossCoverContract}
      method='depositCover'
      params={[amountToDeposit]}
      handleSuccess={handleSuccess}
    />
  )
}
