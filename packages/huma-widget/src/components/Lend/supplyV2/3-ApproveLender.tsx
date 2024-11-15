import {
  CHAIN_TYPE,
  NETWORK_TYPE,
  PoolInfoV2,
  TrancheType,
} from '@huma-finance/shared'
import React from 'react'

import { ApproveLenderBase } from '../components/ApproveLenderBase'

type Props = {
  poolInfo: PoolInfoV2
  isUniTranche: boolean
  networkType: NETWORK_TYPE
  changeTranche: (tranche: TrancheType) => void
}

export function ApproveLender({
  poolInfo,
  isUniTranche,
  networkType,
  changeTranche,
}: Props): React.ReactElement {
  return (
    <ApproveLenderBase
      juniorTrancheVault={poolInfo.juniorTrancheVault}
      seniorTrancheVault={poolInfo.seniorTrancheVault}
      isUniTranche={isUniTranche}
      chainType={CHAIN_TYPE.EVM}
      networkType={networkType}
      changeTranche={changeTranche}
    />
  )
}
