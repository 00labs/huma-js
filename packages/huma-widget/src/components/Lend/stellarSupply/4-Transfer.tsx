import {
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
  tokenDecimalUtils,
  TrancheType,
} from '@huma-finance/shared'
import { signTransaction } from '@stellar/freighter-api'
import { Client as TrancheVaultClient } from '@huma-finance/soroban-tranche-vault'
import React, { useCallback, useContext, useEffect } from 'react'

import {
  StellarConnectionContext,
  StellarPoolState,
} from '@huma-finance/web-shared'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  selectedTranche: TrancheType
}

export function Transfer({
  poolInfo,
  poolState,
  selectedTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.underlyingToken
  const supplyBigNumber = tokenDecimalUtils.parseUnits(
    String(supplyAmount),
    decimals,
  )
  //
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
        networkPassphrase: chainMetadata.networkPassphrase,
        contractId:
          selectedTranche === 'senior'
            ? poolInfo.seniorTranche!
            : poolInfo.juniorTranche!,
        rpcUrl: chainMetadata.rpc,
        signTransaction,
      })
      const tx = await trancheVaultClient.deposit({
        lender: stellarAddress,
        assets: supplyBigNumber,
      })
      console.log(tx)
      await tx.signAndSend()
    }
    getTx()
  }, [poolInfo, selectedTranche, stellarAddress, supplyBigNumber])

  return <LoadingModal title='Test' />
}
