import { SolanaPoolInfo } from '@huma-finance/shared'
import { useBorrowerAccounts } from '@huma-finance/web-shared'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WidgetWrapper } from '../../WidgetWrapper'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { setStep } from '../../../store/widgets.reducers'
import { ChooseAmount } from './1-ChooseAmount'
import { Transfer } from './2-Transfer'
import { Done } from './3-Done'
import { SolanaErrorModal } from '../../SolanaErrorModal'

/**
 * Lend pool supply props
 * @typedef {Object} SolanaPaymentProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface SolanaPaymentProps {
  poolInfo: SolanaPoolInfo
  handleClose: () => void
  handleSuccess?: () => void
}

export function SolanaPayment({
  poolInfo,
  handleClose,
  handleSuccess,
}: SolanaPaymentProps): React.ReactElement | null {
  const title = 'Make Payment'
  const dispatch = useDispatch()
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const { creditStateAccount } = useBorrowerAccounts(
    poolInfo.chainId,
    poolInfo.poolName,
  )

  useEffect(() => {
    if (!step && creditStateAccount) {
      dispatch(setStep(WIDGET_STEP.ChooseAmount))
    }
  }, [creditStateAccount, dispatch, step])

  if (!creditStateAccount) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle={title}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={title}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseAmount && creditStateAccount && (
        <ChooseAmount
          poolInfo={poolInfo}
          creditStateAccount={creditStateAccount}
        />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Done poolInfo={poolInfo} handleAction={handleClose} />
      )}
      {step === WIDGET_STEP.Error && (
        <SolanaErrorModal
          chainId={poolInfo.chainId}
          title={title}
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
