import { CHAIN_TYPE, PoolInfoV2, TrancheType } from '@huma-finance/shared'
import React from 'react'

import { ApproveLenderBase } from '../components/ApproveLenderBase'

type Props = {
  poolInfo: PoolInfoV2
  isUniTranche: boolean
  changeTranche: (tranche: TrancheType) => void
}

export function ApproveLender({
  poolInfo,
  isUniTranche,
  changeTranche,
}: Props): React.ReactElement {
  return (
    <ApproveLenderBase
      juniorTrancheVault={poolInfo.juniorTrancheVault}
      seniorTrancheVault={poolInfo.seniorTrancheVault}
      isUniTranche={isUniTranche}
      chainType={CHAIN_TYPE.EVM}
      changeTranche={changeTranche}
    />
  )
}
