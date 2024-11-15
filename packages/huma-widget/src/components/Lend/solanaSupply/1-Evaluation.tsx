import { CHAIN_TYPE, NETWORK_TYPE, SolanaPoolInfo } from '@huma-finance/shared'
import React from 'react'

import { PersonaEvaluation } from '../components/PersonaEvaluation'
import { Campaign } from '../supplyV2'

type Props = {
  poolInfo: SolanaPoolInfo
  campaign?: Campaign
  networkType: NETWORK_TYPE
  handleClose: () => void
}

export function Evaluation({
  poolInfo,
  campaign,
  networkType,
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
        campaign={campaign}
        networkType={networkType}
        chainType={CHAIN_TYPE.SOLANA}
      />
    )
  }

  return null
}
