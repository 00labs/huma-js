import {
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
  tokenDecimalUtils,
} from '@huma-finance/shared'
import AssembledTransaction from '@stellar/stellar-sdk'
import { Client as PoolCreditClient } from '@huma-finance/soroban-pool-credit'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import {
  getClientCommonParams,
  StellarConnectionContext,
} from '@huma-finance/web-shared'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { StellarTxSendModal } from '../../StellarTxSendModal'

type Props = {
  poolInfo: StellarPoolInfo
}

export function Transfer({ poolInfo }: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const [tx, setTx] = useState<typeof AssembledTransaction | null>(null)
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.underlyingToken
  const supplyBigNumber = tokenDecimalUtils.parseUnits(
    String(supplyAmount),
    decimals,
  )

  const handleSuccess = useCallback(async () => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!stellarAddress) {
        return
      }

      const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
      const poolClient = new PoolCreditClient({
        publicKey: stellarAddress,
        contractId: poolInfo.poolCredit,
        ...getClientCommonParams(chainMetadata, stellarAddress),
      })
      const tx = await poolClient.drawdown({
        borrower: stellarAddress,
        amount: supplyBigNumber,
      })
      setTx(tx)
    }
    getTx()
  }, [poolInfo, stellarAddress, supplyBigNumber])

  return <StellarTxSendModal tx={tx} handleSuccess={handleSuccess} />
}
