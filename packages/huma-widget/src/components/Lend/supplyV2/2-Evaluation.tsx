import {
  CHAIN_TYPE,
  CloseModalOptions,
  NETWORK_TYPE,
  PoolInfoV2,
} from '@huma-finance/shared'
import React from 'react'

import { Campaign } from '.'
import { PersonaEvaluation } from '../components/PersonaEvaluation'
import { SecuritizeEvaluation } from '../components/SecuritizeEvaluation'

type Props = {
  poolInfo: PoolInfoV2
  networkType: NETWORK_TYPE
  campaign?: Campaign
  documentHash: string
  handleClose: (options?: CloseModalOptions) => void
}

export function Evaluation({
  poolInfo,
  networkType,
  campaign,
  documentHash,
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
        campaign={campaign}
        networkType={networkType}
        chainType={CHAIN_TYPE.EVM}
        documentHash={documentHash}
      />
    )
  }

  return null
}
