import {
  CHAIN_TYPE,
  NETWORK_TYPE,
  SOLANA_CHAIN_INFO,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import React from 'react'

import { ApproveLenderBase } from '../components/ApproveLenderBase'

type Props = {
  poolInfo: SolanaPoolInfo
  isUniTranche: boolean
  networkType: NETWORK_TYPE
  changeTranche: (tranche: TrancheType) => void
}

export function ApproveLender({
  poolInfo,
  isUniTranche,
  networkType,
  changeTranche,
}: Props): React.ReactElement | null {
  const solanaChainInfo = SOLANA_CHAIN_INFO[poolInfo.chainId]

  return (
    <ApproveLenderBase
      juniorTrancheVault={poolInfo.juniorTrancheMint}
      seniorTrancheVault={poolInfo.seniorTrancheMint}
      isUniTranche={isUniTranche}
      chainType={CHAIN_TYPE.SOLANA}
      chainSpecificData={{
        huma_program_id: solanaChainInfo.poolProgram,
        pool_id: poolInfo.poolId,
      }}
      networkType={networkType}
      changeTranche={changeTranche}
    />
  )
}