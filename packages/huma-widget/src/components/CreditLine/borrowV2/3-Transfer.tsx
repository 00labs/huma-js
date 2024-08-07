import { PoolInfoV2 } from '@huma-finance/core'
import { txAtom, useCreditContractV2 } from '@huma-finance/web-core'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
}

export function Transfer({ poolInfo }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider, account } = useWeb3React()
  const reset = useResetAtom(txAtom)
  const { borrowAmountBN: borrowAmountBNJson } =
    useAppSelector(selectWidgetState)
  const borrowAmountBN = BigNumber.from(borrowAmountBNJson)
  const creditContract = useCreditContractV2(
    poolInfo.poolName,
    provider,
    account,
  )

  const handleSuccess = useCallback(() => {
    reset()
    const nextStep = WIDGET_STEP.Done
    dispatch(setStep(nextStep))
  }, [dispatch, reset])

  if (!account || !creditContract) {
    return <LoadingModal title='Borrow' />
  }

  return (
    <TxSendModalV2
      title='Borrow'
      contract={creditContract}
      method='drawdown'
      params={[borrowAmountBN]}
      handleSuccess={handleSuccess}
    />
  )
}
