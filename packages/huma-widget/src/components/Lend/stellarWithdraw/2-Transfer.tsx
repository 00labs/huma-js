import {
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import { Client as TrancheVaultClient } from '@huma-finance/soroban-tranche-vault'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import {
  getClientCommonParams,
  StellarConnectionContext,
} from '@huma-finance/web-shared'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { StellarTxSendModal } from '../../StellarTxSendModal'

type Props = {
  poolInfo: StellarPoolInfo
  tranche: TrancheType
  poolIsClosed: boolean
}

export function Transfer({
  poolInfo,
  tranche,
  poolIsClosed,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const [tx, setTx] = useState<Awaited<
    ReturnType<TrancheVaultClient['disburse']>
  > | null>(null)

  const handleSuccess = useCallback(async () => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!stellarAddress) {
        return
      }

      const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
      const contractId =
        tranche === 'senior' ? poolInfo.seniorTranche! : poolInfo.juniorTranche
      const trancheVaultClient = new TrancheVaultClient({
        publicKey: stellarAddress,
        contractId,
        ...getClientCommonParams(chainMetadata, stellarAddress),
      })

      const assembledTx = poolIsClosed
        ? await trancheVaultClient.withdraw_after_pool_closure({
            lender: stellarAddress,
          })
        : await trancheVaultClient.disburse({
            lender: stellarAddress,
          })
      setTx(assembledTx)
    }
    getTx()
  }, [poolInfo, tranche, poolIsClosed, stellarAddress])

  return <StellarTxSendModal tx={tx} handleSuccess={handleSuccess} />
}
