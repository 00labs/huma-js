import {
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
  tokenDecimalUtils,
  TrancheType,
} from '@huma-finance/shared'
import { Client as TrancheVaultClient } from '@huma-finance/soroban-tranche-vault'
import AssembledTransaction from '@stellar/stellar-sdk'
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
  const { redeemShares } = useAppSelector(selectWidgetState)
  const decimals = poolInfo.trancheDecimals
  const sharesBN = tokenDecimalUtils.parseUnits(
    String(redeemShares ?? 0),
    decimals,
  )

  const handleSuccess = useCallback(async () => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!stellarAddress || sharesBN <= BigInt(0)) {
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
      const assembledTx = await trancheVaultClient.add_redemption_request({
        caller: stellarAddress,
        lender: stellarAddress,
        shares: sharesBN,
      })
      setTx(assembledTx)
    }
    getTx()
  }, [poolInfo, selectedTranche, stellarAddress, sharesBN])

  return <StellarTxSendModal tx={tx} handleSuccess={handleSuccess} />
}
