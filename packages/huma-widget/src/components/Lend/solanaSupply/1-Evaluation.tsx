import {
  CHAIN_TYPE,
  NETWORK_TYPE,
  SOLANA_CHAIN_INFO,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import React from 'react'

import { PersonaEvaluation } from '../components/PersonaEvaluation'
import { Campaign } from '../supplyV2'

type Props = {
  poolInfo: SolanaPoolInfo
  isUniTranche: boolean
  campaign?: Campaign
  networkType: NETWORK_TYPE
  changeTranche: (tranche: TrancheType) => void
  handleClose: () => void
}

export function Evaluation({
  poolInfo,
  isUniTranche,
  campaign,
  networkType,
  changeTranche,
  handleClose,
}: Props): React.ReactElement | null {
  if (poolInfo.KYC?.Persona) {
    const solanChainInfo = SOLANA_CHAIN_INFO[poolInfo.chainId]

    return (
      <PersonaEvaluation
        poolInfo={{
          KYC: poolInfo.KYC,
          juniorTrancheVault: poolInfo.juniorTrancheMint,
          seniorTrancheVault: poolInfo.seniorTrancheMint,
        }}
        handleClose={handleClose}
        isUniTranche={isUniTranche}
        campaign={campaign}
        networkType={networkType}
        chainSpecificData={{
          huma_program_id: solanChainInfo.poolProgram,
          pool_id: poolInfo.poolId,
        }}
        chainType={CHAIN_TYPE.SOLANA}
        changeTranche={changeTranche}
      />
    )
  }

  return null
}
