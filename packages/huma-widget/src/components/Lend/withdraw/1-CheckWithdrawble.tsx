import { useWeb3React } from '@web3-react/core'
import {
  isEmpty,
  PoolInfoType,
  timeUtil,
  useLastDepositTime,
  useWithdrawlLockoutInSeconds,
} from '@huma-finance/shared'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../hooks/useRedux'
import { ErrorModal } from '../../ErrorModal'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoType
  handleClose: () => void
}

export function CheckWithdrawable({
  poolInfo,
  handleClose,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const withdrawlLockoutSeconds = useWithdrawlLockoutInSeconds(
    poolInfo.poolName,
    poolInfo.poolType,
  )
  const lastDepositTime = useLastDepositTime(
    poolInfo.poolName,
    poolInfo.poolType,
    account,
  )

  const { symbol } = poolInfo.poolUnderlyingToken
  const [status, setStatus] = useState<'checking' | 'error'>('checking')

  useEffect(() => {
    if (!isEmpty(withdrawlLockoutSeconds) && !isEmpty(lastDepositTime)) {
      const currentTimestamp = timeUtil.getUnixTimestamp()
      if (lastDepositTime! + withdrawlLockoutSeconds! > currentTimestamp) {
        setStatus('error')
      } else {
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
      }
    }
  }, [dispatch, lastDepositTime, withdrawlLockoutSeconds])

  if (status === 'error') {
    const errorMessage = `Your last deposit was on ${timeUtil.timestampToLL(
      lastDepositTime,
    )}. Depositors need to wait for ${timeUtil
      .secondsToDays(withdrawlLockoutSeconds)
      .toFixed(0)} days before withdrawal.`
    return (
      <ErrorModal
        title={`Withdraw ${symbol}`}
        errorReason='Withdraw too soon'
        errorMessage={errorMessage}
        handleOk={handleClose}
      />
    )
  }

  return (
    <LoadingModal
      title={`Withdraw ${symbol}`}
      description='Checking withdrawable amount...'
    />
  )
}
