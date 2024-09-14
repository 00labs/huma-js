import {
  formatNumber,
  SolanaPoolInfo,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import React from 'react'

import {
  LenderStateAccount,
  useTrancheMintAccounts,
} from '@huma-finance/web-shared'
import { SolanaTxDoneModal } from '../../SolanaTxDoneModal'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'

type Props = {
  poolInfo: SolanaPoolInfo
  lenderState: LenderStateAccount | null | undefined
  selectedTranche: TrancheType
  handleAction: () => void
}

export function Done({
  poolInfo,
  lenderState,
  selectedTranche,
  handleAction,
}: Props): React.ReactElement | null {
  const { mintAccount, loading: isLoadingTrancheMintAccounts } =
    useTrancheMintAccounts(poolInfo, selectedTranche)
  const { solanaSignature } = useAppSelector(selectWidgetState)

  const content =
    !lenderState || isLoadingTrancheMintAccounts || !mintAccount
      ? ['']
      : [
          `Your request to cancel the redemption of ${formatNumber(
            SolanaTokenUtils.formatUnits(
              lenderState.redemptionRecord.numSharesRequested,
              mintAccount.decimals,
            ),
          )} shares has been successfully processed.`,
        ]

  return (
    <SolanaTxDoneModal
      handleAction={handleAction}
      content={content}
      chainId={poolInfo.chainId}
      solanaSignature={solanaSignature}
      buttonText='DONE'
    />
  )
}
