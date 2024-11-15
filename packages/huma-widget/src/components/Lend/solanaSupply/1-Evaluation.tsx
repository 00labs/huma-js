import { CHAIN_TYPE, SolanaPoolInfo } from '@huma-finance/shared'
import React from 'react'

import { PersonaEvaluation } from '../components/PersonaEvaluation'
import { Campaign } from '../supplyV2'

type Props = {
  poolInfo: SolanaPoolInfo
  pointsTestnetExperience: boolean
  campaign?: Campaign
  handleClose: () => void
}

export function Evaluation({
  poolInfo,
  pointsTestnetExperience,
  campaign,
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
        pointsTestnetExperience={pointsTestnetExperience}
        campaign={campaign}
        chainType={CHAIN_TYPE.SOLANA}
      />
    )
  }

  return null
}
