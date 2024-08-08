import { PoolInfoV2, TrancheType } from '@huma-finance/shared'
import { BigNumber } from 'ethers'
import React from 'react'

import { Campaign } from '.'
import { PersonaEvaluation } from './components/PersonaEvaluation'
import { SecuritizeEvaluation } from './components/SecuritizeEvaluation'

type Props = {
  poolInfo: PoolInfoV2
  isUniTranche: boolean
  minDepositAmount: BigNumber
  pointsTestnetExperience: boolean
  campaign?: Campaign
  changeTranche: (tranche: TrancheType) => void
  handleClose: () => void
}

export function Evaluation({
  poolInfo,
  isUniTranche,
  minDepositAmount,
  campaign,
  pointsTestnetExperience,
  changeTranche,
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
        isUniTranche={isUniTranche}
        pointsTestnetExperience={pointsTestnetExperience}
        campaign={campaign}
        minDepositAmount={minDepositAmount}
        changeTranche={changeTranche}
      />
    )
  }

  return null
}
