import { CHAIN_TYPE, SolanaPoolInfo, TrancheType } from '@huma-finance/shared'
import React from 'react'

import { PersonaEvaluation } from '../components/PersonaEvaluation'
import { Campaign } from '../supplyV2'

type Props = {
  poolInfo: SolanaPoolInfo
  isUniTranche: boolean
  pointsTestnetExperience: boolean
  campaign?: Campaign
  changeTranche: (tranche: TrancheType) => void
  handleClose: () => void
}

export function Evaluation({
  poolInfo,
  isUniTranche,
  pointsTestnetExperience,
  campaign,
  changeTranche,
  handleClose,
}: Props): React.ReactElement | null {
  if (poolInfo.KYC?.Persona) {
    return (
      <PersonaEvaluation
        poolInfo={{
          KYC: poolInfo.KYC,
          juniorTrancheVault: poolInfo.juniorTrancheMint,
          seniorTrancheVault: poolInfo.seniorTrancheMint,
        }}
        handleClose={handleClose}
        isUniTranche={isUniTranche}
        pointsTestnetExperience={pointsTestnetExperience}
        campaign={campaign}
        chainType={CHAIN_TYPE.SOLANA}
        changeTranche={changeTranche}
      />
    )
  }

  return null
}
