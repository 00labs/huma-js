import {
  CHAIN_TYPE,
  getSolanaNetworkType,
  SOLANA_CHAIN_INFO,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import React from 'react'

import { ApproveLenderBase } from '../components/ApproveLenderBase'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'

type Props = {
  poolInfo: SolanaPoolInfo
  isUniTranche: boolean
  documentHash: string
  changeTranche: (tranche: TrancheType) => void
}

export function ApproveLender({
  poolInfo,
  isUniTranche,
  documentHash,
  changeTranche,
}: Props): React.ReactElement | null {
  useLogOnFirstMount('ApproveLender', {})

  const solanaChainInfo = SOLANA_CHAIN_INFO[poolInfo.chainId]

  return (
    <ApproveLenderBase
      juniorTrancheVault={poolInfo.juniorTrancheMint}
      seniorTrancheVault={poolInfo.seniorTrancheMint}
      isUniTranche={isUniTranche}
      chainType={CHAIN_TYPE.SOLANA}
      networkType={getSolanaNetworkType(poolInfo.chainId)}
      chainSpecificData={{
        huma_program_id: solanaChainInfo.poolProgram,
        pool_id: poolInfo.poolId,
      }}
      documentHash={documentHash}
      changeTranche={changeTranche}
    />
  )
}
