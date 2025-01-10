import {
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
  tokenDecimalUtils,
  TrancheType,
} from '@huma-finance/shared'
import AssembledTransaction from '@stellar/stellar-sdk'
import { Client as TrancheVaultClient } from '@huma-finance/soroban-tranche-vault'
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
  selectedTranche: TrancheType
}

export function Transfer({
  poolInfo,
  selectedTranche,
}: Props): React.ReactElement | null {
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
      const trancheVaultClient = new TrancheVaultClient({
        publicKey: stellarAddress,
        contractId:
          selectedTranche === 'senior'
            ? poolInfo.seniorTranche!
            : poolInfo.juniorTranche,
        ...getClientCommonParams(chainMetadata, stellarAddress),
      })
      const tx = await trancheVaultClient.deposit({
        lender: stellarAddress,
        assets: supplyBigNumber,
      })
      setTx(tx)
    }
    getTx()
  }, [poolInfo, selectedTranche, stellarAddress, supplyBigNumber])

  return <StellarTxSendModal tx={tx} handleSuccess={handleSuccess} />
}
