import { PoolInfoV2 } from '@huma-finance/shared'
import React from 'react'

import { PersonaEvaluation } from './components/PersonaEvaluation'
import { SecuritizeEvaluation } from './components/SecuritizeEvaluation'

type Props = {
  poolInfo: PoolInfoV2
  handleClose: () => void
}

export function Evaluation({
  poolInfo,
  handleClose,
}: Props): React.ReactElement | null {
  if (poolInfo.KYC?.Securitize) {
    return (
      <SecuritizeEvaluation poolInfo={poolInfo} handleClose={handleClose} />
    )
  }
  if (poolInfo.KYC?.Persona) {
    return <PersonaEvaluation poolInfo={poolInfo} handleClose={handleClose} />
  }

  return null
}
