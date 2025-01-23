import React from 'react'

import { getSolanaExplorerUrl, SolanaChainEnum } from '@huma-finance/shared'
import { useAppSelector } from '../hooks/useRedux'
import { ErrorModal } from './ErrorModal'
import { selectWidgetState } from '../store/widgets.selectors'

type Props = {
  chainId: SolanaChainEnum
  title: string
  errorReason?: string
  errorMessage?: string
  handleOk: () => void
  okText?: string
  shouldResetState?: boolean
}

export function SolanaErrorModal({
  chainId,
  title,
  errorReason,
  errorMessage,
  handleOk,
  okText = 'OKAY',
  shouldResetState = true,
}: Props): React.ReactElement {
  const { solanaSignature } = useAppSelector(selectWidgetState)
  const errorUrl = solanaSignature
    ? getSolanaExplorerUrl(chainId, solanaSignature, 'tx')
    : undefined

  return (
    <ErrorModal
      title={title}
      errorReason={errorReason}
      errorMessage={errorMessage}
      errorUrl={errorUrl ?? undefined}
      handleOk={handleOk}
      okText={okText}
      shouldResetState={shouldResetState}
    />
  )
}
