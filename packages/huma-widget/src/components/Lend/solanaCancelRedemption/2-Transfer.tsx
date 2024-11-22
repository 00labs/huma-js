import {
  getTokenAccounts,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useState } from 'react'

import { LenderStateAccount, useHumaProgram } from '@huma-finance/web-shared'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'

type Props = {
  poolInfo: SolanaPoolInfo
  lenderState: LenderStateAccount | null | undefined
  lenderStatePDA: string | null | undefined
  selectedTranche: TrancheType
}

export function Transfer({
  poolInfo,
  lenderState,
  lenderStatePDA,
  selectedTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const [transaction, setTransaction] = useState<Transaction>()
  const program = useHumaProgram(poolInfo.chainId)

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!publicKey || !lenderState || !lenderStatePDA || transaction) {
        return
      }

      const {
        seniorTrancheATA,
        juniorTrancheATA,
        poolSeniorTrancheATA,
        poolJuniorTrancheATA,
      } = getTokenAccounts(poolInfo, publicKey)
      const tx = await program.methods
        .cancelRedemptionRequest(
          lenderState.redemptionRecord.numSharesRequested,
        )
        .accountsPartial({
          lender: publicKey,
          humaConfig: poolInfo.humaConfig,
          poolConfig: poolInfo.poolConfig,
          trancheMint:
            selectedTranche === 'senior'
              ? poolInfo.seniorTrancheMint
              : poolInfo.juniorTrancheMint,
          trancheState:
            selectedTranche === 'senior'
              ? poolInfo.seniorTrancheState
              : poolInfo.juniorTrancheState,
          lenderState: lenderStatePDA,
          poolAuthority: poolInfo.poolAuthority,
          poolTrancheToken:
            selectedTranche === 'senior'
              ? poolSeniorTrancheATA
              : poolJuniorTrancheATA,
          lenderTrancheToken:
            selectedTranche === 'senior' ? seniorTrancheATA : juniorTrancheATA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .transaction()

      setTransaction(tx)
    }
    getTx()
  }, [
    lenderState,
    lenderStatePDA,
    poolInfo,
    program.methods,
    publicKey,
    selectedTranche,
    transaction,
  ])

  return (
    <SolanaTxSendModal
      tx={transaction}
      chainId={poolInfo.chainId}
      handleSuccess={handleSuccess}
    />
  )
}
