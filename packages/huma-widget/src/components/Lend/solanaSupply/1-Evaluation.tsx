import { CHAIN_TYPE, NETWORK_TYPE, SolanaPoolInfo } from '@huma-finance/shared'
import React from 'react'

import { PersonaEvaluation } from '../components/PersonaEvaluation'
import { Campaign } from '../supplyV2'

type Props = {
  poolInfo: SolanaPoolInfo
  networkType: NETWORK_TYPE
  campaign?: Campaign
  documentHash?: string
  handleClose: () => void
}

export function Evaluation({
  poolInfo,
  networkType,
  campaign,
  documentHash,
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
        networkType={networkType}
        chainType={CHAIN_TYPE.SOLANA}
        campaign={campaign}
        documentHash={documentHash}
      />
    )
  }

  return null
}
