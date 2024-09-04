import { SolanaPoolInfo, TrancheType } from '@huma-finance/shared'
import {
  SolanaPoolState,
  useLenderAccounts,
  useTokenAccount,
} from '@huma-finance/web-shared'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WidgetWrapper } from '../../WidgetWrapper'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseTranche } from './1-ChooseTranche'
import { ChooseAmount } from './3-ChooseAmount'
import { setStep } from '../../../store/widgets.reducers'
import { ErrorModal } from '../../ErrorModal'
import { ApproveAllowance } from './4-ApproveAllowance'

/**
 * Lend pool supply props
 * @typedef {Object} SolanaLendSupplyProps
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface SolanaLendSupplyProps {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  handleClose: () => void
  handleSuccess?: () => void
}

export function SolanaLendSupply({
  poolInfo,
  poolState,
  handleClose,
  handleSuccess,
}: SolanaLendSupplyProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const [
    seniorLenderApproved,
    juniorLenderApproved,
    ,
    ,
    isLoadingLenderAccounts,
  ] = useLenderAccounts(poolInfo.chainId, poolInfo.poolName)
  const [tokenAccount, isLoadingTokenAccount] = useTokenAccount(poolInfo)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const isUniTranche = poolState.maxSeniorJuniorRatio === 0
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()

  useEffect(() => {
    if (!step && !isLoadingLenderAccounts && !isLoadingTokenAccount) {
      if (juniorLenderApproved && !seniorLenderApproved) {
        setSelectedTranche('junior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (seniorLenderApproved && !juniorLenderApproved) {
        setSelectedTranche('senior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (juniorLenderApproved && seniorLenderApproved) {
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
        // return
      }

      //   if (poolInfo.supplyLink) {
      //     openInNewTab(poolInfo.supplyLink)
      //     handleClose()
      //   }
    }
  }, [
    dispatch,
    handleClose,
    poolInfo,
    step,
    isLoadingLenderAccounts,
    juniorLenderApproved,
    seniorLenderApproved,
    isLoadingTokenAccount,
  ])

  if (isLoadingLenderAccounts || isLoadingTokenAccount) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Supply'
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={`Supply ${poolInfo.underlyingMint.symbol}`}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          poolUnderlyingToken={poolInfo.underlyingMint}
          selectedTranche={selectedTranche}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolState={poolState}
          tokenAccount={tokenAccount!}
          selectedTranche={selectedTranche}
          isUniTranche={isUniTranche}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} tokenAccount={tokenAccount!} />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Supply'
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
