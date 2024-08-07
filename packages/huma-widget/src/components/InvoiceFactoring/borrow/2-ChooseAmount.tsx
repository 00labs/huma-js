import { AccountStats, PoolInfoType } from '@huma-finance/core'
import { useFeeManager } from '@huma-finance/web-core'
import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'

import { useWeb3React } from '@web3-react/core'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setBorrowInfo } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'

type Props = {
  poolInfo: PoolInfoType
  accountStats: AccountStats
}

export function ChooseAmount({
  poolInfo,
  accountStats,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { creditRecord } = accountStats
  const { chainId, provider } = useWeb3React()
  const [chargedFees, setChargedFees] = useState(0)
  const [currentAmount, setCurrentAmount] = useState(0)
  const { approval } = useAppSelector(selectWidgetState)
  const { getFeesCharged } = useFeeManager(
    poolInfo.poolName,
    poolInfo.poolType,
    chainId,
    provider,
  )
  const [remainder, setRemainder] = useState<string | number | undefined>(
    approval!.receivable?.amountFormatted,
  )

  const getAvailableCreditLimit = () => {
    if (approval && creditRecord) {
      const principal = creditRecord.unbilledPrincipal
        .add(creditRecord.totalDue)
        .sub(creditRecord.feesAndInterestDue)
        .toNumber()
      return Number(approval.terms.creditLimitFormatted) - principal
    }
    return 0
  }

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      if (approval) {
        setCurrentAmount(newAmount)
        setChargedFees(getFeesCharged(newAmount))
        setRemainder(Number(approval.receivable!.amountFormatted) - newAmount)
      }
    },
    [approval, getFeesCharged],
  )

  const handleAction = useCallback(() => {
    dispatch(
      setBorrowInfo({
        borrowAmount: currentAmount,
        borrowAmountBN: ethers.utils
          .parseUnits(currentAmount.toString(), approval?.token.decimal)
          .toJSON(),
        chargedFees,
        remainder: Number(remainder!),
        nextStep: WIDGET_STEP.ConfirmTransfer,
      }),
    )
  }, [approval?.token.decimal, chargedFees, currentAmount, dispatch, remainder])

  if (!approval) {
    return null
  }

  return (
    <ChooseAmountModal
      title='Choose Amount'
      description1='Access up to 80% of your invoice value'
      description2='The remainder will be sent to your wallet when the invoice is paid'
      sliderMax={getAvailableCreditLimit()}
      currentAmount={currentAmount}
      tokenSymbol={approval.token.symbol}
      topLeft='Fees'
      topRight={`${chargedFees} ${approval.token.symbol}`}
      downLeft='Remainder'
      downRight={`${remainder} ${approval.token.symbol}`}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
    />
  )
}
