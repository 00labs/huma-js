import {
  formatNumberFixed,
  SolanaPoolInfo,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import { LenderStateAccount, SolanaPoolState } from '@huma-finance/web-shared'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { BN } from '@coral-xyz/anchor'
import { Mint } from '@solana/spl-token'
import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ConfirmTransfer } from './1-ConfirmTransfer'
import { Transfer } from './2-Transfer'
import { Done } from './3-Done'

/**
 * Solana lend pool withdraw props
 * @typedef {Object} SolanaLendWithdrawProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {SolanaPoolState} poolState The current state config of the pool.
 * @property {LenderStateAccount} lenderStateAccount The lender state account of the user.
 * @property {Mint} trancheMintAccount The mint account of the tranche.
 * @property {TrancheType} trancheType The type of the tranche.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type SolanaLendWithdrawProps = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  lenderStateAccount: LenderStateAccount
  trancheMintAccount: Mint
  trancheType: TrancheType
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function SolanaLendWithdraw({
  poolInfo,
  poolState,
  lenderStateAccount,
  trancheMintAccount,
  trancheType,
  handleClose,
  handleSuccess,
}: SolanaLendWithdrawProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const { symbol, decimals } = poolInfo.underlyingMint
  const title = `Withdraw ${symbol}`
  const poolIsClosed = poolState.status === 'closed'
  const [sharePrice, setSharePrice] = useState(0)
  const { totalAmountProcessed, totalAmountWithdrawn } =
    lenderStateAccount.redemptionRecord
  const withdrawableAmount = totalAmountProcessed.sub(totalAmountWithdrawn)
  const withdrawableAmountFormatted = formatNumberFixed(
    SolanaTokenUtils.formatUnits(withdrawableAmount, decimals),
    2,
  )

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.ConfirmTransfer))
    }
  }, [dispatch, step])

  useEffect(() => {
    const trancheAssets =
      trancheType === 'senior'
        ? poolState.seniorTrancheAssets
        : poolState.juniorTrancheAssets

    const trancheAssetsVal = new BN(trancheAssets ?? 1)
    const trancheSupplyVal = new BN(trancheMintAccount.supply.toString() ?? 1)
    const sharePrice =
      trancheAssetsVal.muln(100000).div(trancheSupplyVal).toNumber() / 100000
    setSharePrice(sharePrice)
  }, [
    poolState.juniorTrancheAssets,
    poolState.seniorTrancheAssets,
    trancheMintAccount.supply,
    trancheType,
  ])

  const handleWithdrawSuccess = useCallback(
    (blockNumber: number) => {
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess],
  )

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={title}
      handleClose={handleClose}
      handleSuccess={handleWithdrawSuccess}
    >
      {step === WIDGET_STEP.ConfirmTransfer && (
        <ConfirmTransfer
          poolUnderlyingToken={poolInfo.underlyingMint}
          withdrawableAmountFormatted={withdrawableAmountFormatted ?? '--'}
          sharePrice={sharePrice}
        />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer
          poolInfo={poolInfo}
          selectedTranche={trancheType}
          poolIsClosed={poolIsClosed}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Done
          poolUnderlyingToken={poolInfo.underlyingMint}
          withdrawAmount={withdrawableAmount}
          handleAction={handleClose}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title={title}
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}