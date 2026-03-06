import {
  CloseModalOptions,
  formatNumberFixed,
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
  tokenDecimalUtils,
  TrancheType,
} from '@huma-finance/shared'
import { Client as TrancheVaultClient } from '@huma-finance/soroban-tranche-vault'
import {
  StellarConnectionContext,
  StellarPoolState,
} from '@huma-finance/web-shared'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep, setWithdrawAmount } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { Confirm } from './1-Confirm'
import { Transfer } from './2-Transfer'
import { Done } from './3-Done'

/**
 * Stellar lend pool withdraw props – disburse (pool open) or withdraw after pool closure.
 * @property {StellarPoolInfo} poolInfo The metadata of the pool.
 * @property {StellarPoolState} poolState The current state config of the pool.
 * @property {TrancheType} tranche The tranche to withdraw from (junior or senior).
 * @property {function((CloseModalOptions|undefined)):void} handleClose Function to close the widget modal.
 * @property {function():void|undefined} handleSuccess Optional callback when withdraw succeeds.
 */
export interface StellarLendWithdrawProps {
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  tranche: TrancheType
  handleClose: (options?: CloseModalOptions) => void
  handleSuccess?: () => void
}

export function StellarLendWithdraw({
  poolInfo,
  poolState,
  tranche,
  handleClose,
  handleSuccess,
}: StellarLendWithdrawProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const { step, errorMessage, withdrawAmount } =
    useAppSelector(selectWidgetState)
  const [withdrawableAmount, setWithdrawableAmount] = useState<bigint>(
    BigInt(0),
  )
  const [isLoadingWithdrawable, setIsLoadingWithdrawable] = useState(true)

  const { symbol, decimals } = poolInfo.underlyingToken
  const title = `Withdraw ${symbol}`
  const poolIsClosed = poolState?.status === 'closed'
  const withdrawableAmountFormatted = formatNumberFixed(
    tokenDecimalUtils.formatUnits(withdrawableAmount, decimals),
    2,
  )

  useEffect(() => {
    if (!step && stellarAddress) {
      dispatch(setStep(WIDGET_STEP.ConfirmWithdrawOnly))
    }
  }, [dispatch, step, stellarAddress])

  useEffect(() => {
    async function fetchWithdrawable() {
      if (!stellarAddress || !poolInfo) {
        setIsLoadingWithdrawable(false)
        return
      }
      setIsLoadingWithdrawable(true)
      try {
        const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
        const contractId =
          tranche === 'senior'
            ? poolInfo.seniorTranche!
            : poolInfo.juniorTranche
        const client = new TrancheVaultClient({
          publicKey: stellarAddress,
          contractId,
          networkPassphrase: chainMetadata.networkPassphrase,
          rpcUrl: chainMetadata.rpc,
        })
        const res = await client.get_latest_redemption_record({
          lender: stellarAddress,
        })
        const record = res.result
        const withdrawable =
          BigInt(record.total_amount_processed) -
          BigInt(record.total_amount_withdrawn)
        setWithdrawableAmount(withdrawable)
      } catch (err) {
        console.error('Failed to fetch withdrawable amount:', err)
        setWithdrawableAmount(BigInt(0))
      } finally {
        setIsLoadingWithdrawable(false)
      }
    }
    fetchWithdrawable()
  }, [stellarAddress, poolInfo, tranche])

  const handleConfirmWithdraw = useCallback(() => {
    dispatch(setWithdrawAmount(Number(withdrawableAmountFormatted)))
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch, withdrawableAmountFormatted])

  const handleWithdrawSuccess = useCallback(() => {
    handleSuccess?.()
  }, [handleSuccess])

  if (isLoadingWithdrawable && step === WIDGET_STEP.ConfirmWithdrawOnly) {
    return (
      <WidgetWrapper
        isOpen
        loadingTitle={title}
        handleClose={handleClose}
        handleSuccess={handleWithdrawSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={title}
      handleClose={handleClose}
      handleSuccess={handleWithdrawSuccess}
    >
      {step === WIDGET_STEP.ConfirmWithdrawOnly && (
        <Confirm
          poolInfo={poolInfo}
          withdrawableAmountFormatted={String(
            withdrawableAmountFormatted ?? '0',
          )}
          onConfirm={handleConfirmWithdraw}
        />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer
          poolInfo={poolInfo}
          tranche={tranche}
          poolIsClosed={poolIsClosed}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Done
          poolInfo={poolInfo}
          withdrawAmount={withdrawAmount}
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
