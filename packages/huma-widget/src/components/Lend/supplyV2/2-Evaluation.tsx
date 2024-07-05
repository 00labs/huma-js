import { PoolInfoV2, TrancheType } from '@huma-finance/shared'
import React from 'react'

import { PersonaEvaluation } from './components/PersonaEvaluation'
import { SecuritizeEvaluation } from './components/SecuritizeEvaluation'

type Props = {
  poolInfo: PoolInfoV2
  isUniTranche: boolean
  changeTranche: (tranche: TrancheType) => void
  handleClose: () => void
}

export function Evaluation({
  poolInfo,
  isUniTranche,
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
        changeTranche={changeTranche}
      />
    )
  }

  return null
}
