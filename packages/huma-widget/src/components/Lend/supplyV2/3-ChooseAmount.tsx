import { formatNumber, PoolInfoV2, TrancheType } from '@huma-finance/shared'
import { LPConfigStructOutput } from '@huma-finance/shared/src/v2/abis/types/PoolConfig'
import {
  usePoolSafeAllowanceV2,
  usePoolUnderlyingTokenBalanceV2,
} from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useMemo, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: PoolInfoV2
  lpConfig: LPConfigStructOutput
  juniorAssets: BigNumber
  seniorAssets: BigNumber
  selectedTranche: TrancheType | undefined
  isUniTranche: boolean
}

export function ChooseAmount({
  poolInfo,
  lpConfig,
  juniorAssets: juniorAssetsBN,
  seniorAssets: seniorAssetsBN,
  selectedTranche,
  isUniTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolInfo.poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
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

  const { juniorAvailableCapBN, seniorAvailableCapBN } = useMemo(() => {
    const { maxSeniorJuniorRatio, liquidityCap: liquidityCapBN } = lpConfig
    const totalDeployedBN = seniorAssetsBN.add(juniorAssetsBN)
    const totalAvailableCapBN = liquidityCapBN.sub(totalDeployedBN)
    const maxSeniorAssetsBN = juniorAssetsBN.mul(maxSeniorJuniorRatio)
    let seniorAvailableCapBN = maxSeniorAssetsBN.sub(seniorAssetsBN)
    seniorAvailableCapBN = seniorAvailableCapBN.gt(totalAvailableCapBN)
      ? totalAvailableCapBN
      : seniorAvailableCapBN

    return {
      juniorAvailableCapBN: totalAvailableCapBN.sub(seniorAvailableCapBN),
      seniorAvailableCapBN,
    }
  }, [juniorAssetsBN, lpConfig, seniorAssetsBN])

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

  const getTrancheCap = () => {
    if (selectedTranche === 'junior') {
      return juniorAvailableCapBN
    }
    return seniorAvailableCapBN
  }

  const getMaxAmount = () => {
    const trancheCap = getTrancheCap()
    return balance.gt(trancheCap) ? trancheCap : balance
  }

  const getInfos = () => {
    const trancheCap = getTrancheCap()
    const currentAmountBN = ethers.utils.parseUnits(
      String(currentAmount),
      decimals,
    )
    const remainingCap = trancheCap.sub(currentAmountBN)

    if (remainingCap.lt(0)) {
      return ['0 remaining capacity']
    }
    return [
      `${formatNumber(
        ethers.utils.formatUnits(remainingCap, decimals),
      )} remaining capacity`,
    ]
  }

  return (
    <InputAmountModal
      title='Enter Amount'
      subTitle={`Depositing to ${
        isUniTranche ? 'uni tranche' : selectedTranche
      } tranche`}
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={Number(ethers.utils.formatUnits(getMaxAmount(), decimals))}
      maxAmountTitle={`${formatNumber(
        ethers.utils.formatUnits(balance, decimals),
      )} balance`}
      infos={getInfos()}
      handleAction={handleAction}
      actionText='SUPPLY'
    />
  )
}
