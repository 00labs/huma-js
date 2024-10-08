import {
  formatNumber,
  PoolInfoV2,
  timestampToLL,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import {
  useLenderDepositRecordV2,
  useLPConfigV2,
  useNextEpochStartTimeV2,
} from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { TrancheInfo } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import {
  setError,
  setRedeemAmount,
  setRedeemShares,
  setStep,
} from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  trancheInfo: TrancheInfo
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  trancheInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { symbol } = poolUnderlyingToken
  const { account, provider } = useWeb3React()
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const [currentShares, setCurrentShares] = useState<number>(0)
  const maxSharesFormatted = ethers.utils.formatUnits(
    trancheInfo.shares,
    poolUnderlyingToken.decimals,
  )
  const sharePrice =
    trancheInfo.assets.toNumber() / trancheInfo.shares.toNumber()
  const [depositRecord] = useLenderDepositRecordV2(
    poolInfo.poolName,
    trancheInfo.tranche,
    account,
    provider,
  )
  const lpConfig = useLPConfigV2(poolInfo.poolName, provider)
  const nextEpochStartTime = useNextEpochStartTimeV2(
    poolInfo.poolName,
    provider,
  )

  useEffect(() => {
    if (depositRecord && lpConfig && nextEpochStartTime) {
      const SECONDS_IN_A_DAY = 24 * 60 * 60
      const lockupEndTime =
        depositRecord.lastDepositTime.toNumber() +
        lpConfig.withdrawalLockoutPeriodInDays * SECONDS_IN_A_DAY
      if (nextEpochStartTime < lockupEndTime) {
        const lockupEndTimeDayjs = dayjs.unix(lockupEndTime).date(1)
        const withdrawTime = lockupEndTimeDayjs.add(1, 'month')
        dispatch(setStep(WIDGET_STEP.Error))
        dispatch(
          setError({
            errorReason: 'Redemption too soon',
            errorMessage: `Your last deposit was on ${timestampToLL(
              depositRecord!.lastDepositTime.toNumber(),
            )}. You can begin submitting redemption requests on ${timestampToLL(
              lockupEndTimeDayjs.unix(),
            )}, which can be redeemed starting ${timestampToLL(
              withdrawTime.unix(),
            )}.`,
          }),
        )
      }
    }
  }, [depositRecord, dispatch, lpConfig, nextEpochStartTime])

  const handleChangeShares = (newShares: number) => {
    const amount = Number(newShares) * sharePrice
    setCurrentShares(Number(newShares))
    setCurrentAmount(amount)
    dispatch(setRedeemShares(Number(newShares)))
    dispatch(setRedeemAmount(amount))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  if (!depositRecord || !lpConfig || !nextEpochStartTime) {
    return <LoadingModal title='Redemption' />
  }

  return (
    <InputAmountModal
      title='Redemption'
      subTitle={`Enter number of shares to redeem from ${trancheInfo.tranche} tranche`}
      tokenSymbol={symbol}
      currentAmount={currentShares}
      handleChangeAmount={handleChangeShares}
      maxAmount={maxSharesFormatted}
      infos={[`${String(formatNumber(currentAmount))} ${symbol}`]}
      maxAmountTitle={`${formatNumber(maxSharesFormatted)} Shares`}
      suffix='Shares'
      handleAction={handleAction}
      actionText='REQUEST'
    />
  )
}
