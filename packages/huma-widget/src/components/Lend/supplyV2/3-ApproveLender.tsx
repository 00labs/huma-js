import {
  CHAIN_TYPE,
  getEvmNetworkType,
  PoolInfoV2,
  TrancheType,
} from '@huma-finance/shared'
import React from 'react'

import { ApproveLenderBase } from '../components/ApproveLenderBase'

type Props = {
  poolInfo: PoolInfoV2
  isUniTranche: boolean
  documentHash?: string
  changeTranche: (tranche: TrancheType) => void
}

export function ApproveLender({
  poolInfo,
  isUniTranche,
  documentHash,
  changeTranche,
}: Props): React.ReactElement {
  return (
    <ApproveLenderBase
      juniorTrancheVault={poolInfo.juniorTrancheVault}
      seniorTrancheVault={poolInfo.seniorTrancheVault}
      isUniTranche={isUniTranche}
      documentHash={documentHash}
      chainType={CHAIN_TYPE.EVM}
      networkType={getEvmNetworkType(poolInfo.chainId)}
      changeTranche={changeTranche}
    />
  )
}
