import {
  getTrancheVaultContractV2,
  PoolInfoV2,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { REDEMPTION_TYPE, RedemptionActionInfo } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import {
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
  redemptionType: REDEMPTION_TYPE
  maxAmount: BigNumber
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  redemptionType,
  maxAmount,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { provider } = useWeb3React()
  const { symbol } = poolUnderlyingToken
  const [sharePrice, setSharePrice] = useState(0)
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const [currentShares, setCurrentShares] = useState<number>(0)
  const redemptionActionInfo = RedemptionActionInfo[redemptionType]
  const maxAmountFormatted = ethers.utils.formatUnits(
    maxAmount,
    poolUnderlyingToken.decimals,
  )

  useEffect(() => {
    if (maxAmount.gt(0)) {
      const fetchData = async () => {
        const vaultContract = await getTrancheVaultContractV2(
          poolInfo.poolName,
          redemptionActionInfo.tranche,
          provider,
        )
        if (vaultContract) {
          const shares = await vaultContract.convertToShares(maxAmount)
          const price = maxAmount.div(shares)
          setSharePrice(price.toNumber())
        }
      }
      fetchData()
    }
  }, [maxAmount, poolInfo.poolName, provider, redemptionActionInfo.tranche])

  const handleChangeAmount = (newAmount: number) => {
    const shares = Number(newAmount) / sharePrice
    setCurrentShares(shares)
    setCurrentAmount(Number(newAmount))
    dispatch(setRedeemAmount(Number(newAmount)))
    dispatch(setRedeemShares(shares))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  if (sharePrice === 0) {
    return (
      <LoadingModal
        title={`${redemptionActionInfo.action} Redemption Request`}
      />
    )
  }

  return (
    <InputAmountModal
      title={`${redemptionActionInfo.action} Redemption Request`}
      subTitle={
        redemptionActionInfo.action === 'Create'
          ? `Input ${symbol} amount to redeem from ${redemptionActionInfo.tranche} tranche`
          : `Input the amount of the redemption request in ${symbol} that you wish to cancel from the ${redemptionActionInfo.tranche} tranche`
      }
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={maxAmountFormatted}
      info={`${currentShares.toFixed(1)} Shares`}
      handleAction={handleAction}
      actionText='SUBMIT'
    />
  )
}
