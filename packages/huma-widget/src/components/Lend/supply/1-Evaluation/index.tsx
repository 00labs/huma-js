import { PoolInfoType } from '@huma-finance/core'
import React from 'react'

import { EvaluationEA } from './EvaluationEA'
import { EvaluationKYC } from './EvaluationKYC'

type Props = {
  poolInfo: PoolInfoType
  handleClose: () => void
  handleApproveSuccess: () => void
}

export function Evaluation({
  poolInfo,
  handleClose,
  handleApproveSuccess,
}: Props): React.ReactElement | null {
  const lenderApprovalProvider = poolInfo.extra?.lenderApprovalProvider
  const isKYC = lenderApprovalProvider?.type === 'KYC'

  if (isKYC) {
    return <EvaluationKYC poolInfo={poolInfo} handleClose={handleClose} />
  }

  return (
    <EvaluationEA
      poolInfo={poolInfo}
      handleApproveSuccess={handleApproveSuccess}
    />
  )
}
