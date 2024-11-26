import {
  CHAIN_TYPE,
  CloseModalOptions,
  NETWORK_TYPE,
  PoolInfoV2,
  TrancheType,
} from '@huma-finance/shared'
import React from 'react'

import { Campaign } from '.'
import { PersonaEvaluation } from '../components/PersonaEvaluation'
import { SecuritizeEvaluation } from '../components/SecuritizeEvaluation'

type Props = {
  poolInfo: PoolInfoV2
  isUniTranche: boolean
  campaign?: Campaign
  networkType: NETWORK_TYPE
  changeTranche: (tranche: TrancheType) => void
  handleClose: (options?: CloseModalOptions) => void
}

export function Evaluation({
  poolInfo,
  isUniTranche,
  campaign,
  networkType,
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
        campaign={campaign}
        networkType={networkType}
        chainType={CHAIN_TYPE.EVM}
        changeTranche={changeTranche}
      />
    )
  }

  return null
}
