import {
  downScale,
  PoolInfoType,
  toBigNumber,
  upScale,
  useFeeManager,
} from '@huma-finance/shared'
import { BigNumber } from 'ethers'
import React, { useCallback, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setBorrowInfo, setStream } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'

type Props = {
  poolInfo: PoolInfoType
  currentFlowRate: string
}

export function ChooseAmount({
  poolInfo,
  currentFlowRate,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { approval } = useAppSelector(selectWidgetState)
  const { getFeesCharged } = useFeeManager(poolInfo.poolName, poolInfo.poolType)
  const [chargedFees, setChargedFees] = useState(0)
  const [currentAmount, setCurrentAmount] = useState(0)
  const borrowPeriodInSeconds = approval!.terms.intervalInDays * 24 * 60 * 60
  const superTokenDecimals = poolInfo.extra?.superToken?.decimals!
  const underlyingTokenDecimals = poolInfo.poolUnderlyingToken.decimals!

  const getBorrowFlowrateAndAmount = useCallback(
    (borrowAmount: number) => {
      const currentFlowRateBN = toBigNumber(currentFlowRate)
      const borrowAmountSuperTokenBN = toBigNumber(
        upScale(borrowAmount, superTokenDecimals),
      )

      const totalAmountSuperTokenInBorrowPeriod = currentFlowRateBN.mul(
        borrowPeriodInSeconds,
      )
      let borrowFlowrate = borrowAmountSuperTokenBN
        .mul(currentFlowRateBN)
        .div(totalAmountSuperTokenInBorrowPeriod)
        // To ensure enough flowRate due to round down when convert to string
        .add(1)

      // Can not borrow all the available flowrate
      if (borrowFlowrate.gte(currentFlowRateBN)) {
        borrowFlowrate = currentFlowRateBN.sub(1)
      }
      const creditLimitSuperTokenBN = BigNumber.from(
        approval!.terms.creditLimit,
      )
        .mul(BigNumber.from(10).pow(BigNumber.from(superTokenDecimals)))
        .div(BigNumber.from(10).pow(BigNumber.from(underlyingTokenDecimals)))
      if (borrowAmountSuperTokenBN.gte(creditLimitSuperTokenBN)) {
        borrowFlowrate = borrowFlowrate.sub(1)
      }

      // As borrowFlowrate adds 1, need to calculate the new accurate borrow amount
      const newBorrowAmountBN = borrowFlowrate
        .mul(totalAmountSuperTokenInBorrowPeriod)
        .div(currentFlowRateBN)
      const newBorrowAmount = downScale(newBorrowAmountBN, superTokenDecimals)
      const newBorrowAmountUnderlyingTokenBN = toBigNumber(
        upScale(newBorrowAmount, underlyingTokenDecimals),
      )

      return {
        borrowFlowrate: borrowFlowrate.toString(),
        borrowAmount: Number(newBorrowAmount),
        borrowAmountBN: newBorrowAmountUnderlyingTokenBN,
      }
    },
    [
      approval,
      borrowPeriodInSeconds,
      currentFlowRate,
      superTokenDecimals,
      underlyingTokenDecimals,
    ],
  )

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      if (approval) {
        setCurrentAmount(newAmount)
        setChargedFees(getFeesCharged(newAmount))
      }
    },
    [approval, getFeesCharged],
  )
  const handleAction = useCallback(() => {
    const { borrowFlowrate, borrowAmount, borrowAmountBN } =
      getBorrowFlowrateAndAmount(currentAmount)

    dispatch(
      setStream({
        borrowFlowrate,
        durationInSeconds: borrowPeriodInSeconds,
      }),
    )
    dispatch(
      setBorrowInfo({
        borrowAmount,
        borrowAmountBN: borrowAmountBN.toJSON(),
        chargedFees,
        nextStep: WIDGET_STEP.ConfirmTransfer,
      }),
    )
  }, [
    borrowPeriodInSeconds,
    chargedFees,
    currentAmount,
    dispatch,
    getBorrowFlowrateAndAmount,
  ])

  if (!approval) {
    return null
  }

  return (
    <ChooseAmountModal
      title='Choose Amount'
      description1='Access up to 100% of your stream flowrate'
      sliderMax={Number(approval.terms.creditLimitFormatted)}
      currentAmount={currentAmount}
      tokenSymbol={approval.token.symbol}
      topLeft='Fees'
      topRight={`${chargedFees} ${approval.token.symbol}`}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='Confirm Transfer'
    />
  )
}
