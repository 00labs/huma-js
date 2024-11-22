import { CHAIN_TYPE, CloseModalOptions, PoolInfoV2 } from '@huma-finance/shared'
import React from 'react'

import { Campaign } from '.'
import { PersonaEvaluation } from '../components/PersonaEvaluation'
import { SecuritizeEvaluation } from '../components/SecuritizeEvaluation'

type Props = {
  poolInfo: PoolInfoV2
  pointsTestnetExperience: boolean
  campaign?: Campaign
  handleClose: (options?: CloseModalOptions) => void
}

export function Evaluation({
  poolInfo,
  campaign,
  pointsTestnetExperience,
  handleClose,
}: Props): React.ReactElement | null {
  if (poolInfo.KYC?.Securitize) {
    return (
      <SecuritizeEvaluation poolInfo={poolInfo} handleClose={handleClose} />
    )
  }
  if (poolInfo.KYC?.Persona) {
    return (
      <PersonaEvaluation
        poolInfo={poolInfo}
        handleClose={handleClose}
        pointsTestnetExperience={pointsTestnetExperience}
        campaign={campaign}
        chainType={CHAIN_TYPE.EVM}
      />
    )
  }

  return null
}
