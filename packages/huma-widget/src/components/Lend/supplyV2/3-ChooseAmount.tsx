import {
  CampaignService,
  formatNumber,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
  useDebouncedValue,
  usePoolSafeAllowanceV2,
  usePoolUnderlyingTokenBalanceV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'
import { Campaign } from '.'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedTranche: TrancheType | undefined
  isUniTranche: boolean
  campaign?: Campaign
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  selectedTranche,
  isUniTranche,
  campaign,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const debouncedValue = useDebouncedValue(currentAmount)
  const [campaignPoints, setCampaignPoints] = useState<number>(0)
  const [lockupPeriodMonths, setLockupPeriodMonths] = useState<number>(0)
  const { allowance = BigNumber.from(0) } = usePoolSafeAllowanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const [balance] = usePoolUnderlyingTokenBalanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const maxAmountFormatted = ethers.utils.formatUnits(
    balance,
    poolUnderlyingToken.decimals,
  )

  useEffect(() => {
    const getBasePoints = async () => {
      if (campaign && selectedTranche && Number(debouncedValue) > 0) {
        const estimatedPoints = await CampaignService.getEstimatedPoints(
          campaign.campaignGroupId,
          String(debouncedValue),
        )
        const campaignPoints = estimatedPoints.find(
          (item) => item.campaignId === campaign.id,
        )
        if (campaignPoints) {
          setCampaignPoints(campaignPoints[`${selectedTranche}TranchePoints`])
          setLockupPeriodMonths(campaignPoints.lockupPeriodMonths)
        }
      }
    }
    getBasePoints()
  }, [
    campaign,
    debouncedValue,
    poolInfo.poolUnderlyingToken.decimals,
    selectedTranche,
  ])

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
    dispatch(setSupplyAmount(Number(newAmount)))
  }

  const handleAction = () => {
    const currentAmountBN = ethers.utils.parseUnits(
      String(currentAmount),
      decimals,
    )
    const step = currentAmountBN.gt(allowance)
      ? WIDGET_STEP.ApproveAllowance
      : WIDGET_STEP.Transfer
    dispatch(setStep(step))
  }

  let info = `${formatNumber(maxAmountFormatted)} Available`
  if (campaign && campaignPoints > 0) {
    info = `You will earn ${formatNumber(
      campaignPoints,
    )} points for the entire ${lockupPeriodMonths} months right away.`
  }

  return (
    <InputAmountModal
      title='Enter Amount'
      subTitle={`Supplying ${symbol} with ${
        isUniTranche ? 'uni tranche' : selectedTranche
      }`}
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={maxAmountFormatted}
      info={info}
      handleAction={handleAction}
      actionText='SUPPLY'
    />
  )
}
