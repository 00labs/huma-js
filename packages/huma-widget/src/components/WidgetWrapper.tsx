import { isTxFailed } from '@huma-finance/shared'
import { sendTxAtom, txAtom } from '@huma-finance/web-shared'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useEffect } from 'react'

import { useTheme } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { resetState, setError } from '../store/widgets.reducers'
import { selectWidgetState } from '../store/widgets.selectors'
import { WIDGET_STEP } from '../store/widgets.store'
import { WCProps } from '../utilTypes'
import { HumaModal, HumaModalHeader } from './humaModal'
import { LoadingModal } from './LoadingModal'

type Props = {
  isOpen: boolean
  isLoading?: boolean
  loadingTitle?: string
  handleClose: () => void
  handleSuccess?: (blockNumber: number) => void
}

export function WidgetWrapper({
  isOpen,
  isLoading = false,
  loadingTitle = '',
  handleClose,
  handleSuccess,
  children,
}: WCProps<Props>): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { step } = useAppSelector(selectWidgetState)
  const [{ state, failReason, txReceipt }] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)

  useEffect(() => {
    if (isTxFailed(state) && failReason) {
      dispatch(setError({ errorMessage: failReason }))
    }
  }, [dispatch, failReason, state])

  useEffect(() => {
    if (step === WIDGET_STEP.Done && txReceipt) {
      if (handleSuccess) {
        handleSuccess(txReceipt.blockNumber)
      }
    }
  }, [handleSuccess, step, txReceipt])

  const handleCloseModal = useCallback(() => {
    reset()
    dispatch(resetState())
    handleClose()
  }, [dispatch, handleClose, reset])

  // when close modal, return null to make sure all the states are reset
  if (!isOpen) {
    return null
  }

  return (
    <HumaModal
      isOpen={isOpen}
      overflowY='auto'
      onClose={handleCloseModal}
      width='480px'
      padding={theme.spacing(4, 5)}
      disableBackdropClick
    >
      <HumaModalHeader onClose={handleCloseModal} height={0} />
      {isLoading && <LoadingModal title={loadingTitle} />}
      {!isLoading && children}
    </HumaModal>
  )
}
