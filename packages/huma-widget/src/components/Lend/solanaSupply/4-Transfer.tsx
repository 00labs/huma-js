import {
  getTokenAccounts,
  SolanaPoolInfo,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useState } from 'react'

import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHumaProgram } from '@huma-finance/web-shared'
import { Transaction } from '@solana/web3.js'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'

type Props = {
  poolInfo: SolanaPoolInfo
  selectedTranche: TrancheType
}

export function Transfer({
  poolInfo,
  selectedTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.underlyingMint
  const supplyBigNumber = SolanaTokenUtils.parseUnits(
    String(supplyAmount),
    decimals,
  )
  const [transaction, setTransaction] = useState<Transaction>()
  const program = useHumaProgram(poolInfo.chainId)

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!publicKey || transaction) {
        return
      }

      const [depositorUnderlyingATA, juniorTrancheATA, seniorTrancheATA] =
        getTokenAccounts(poolInfo, publicKey)
      const tx = await program.methods
        .deposit(supplyBigNumber)
        .accountsPartial({
          depositor: publicKey,
          poolConfig: poolInfo.poolConfig,
          underlyingMint: poolInfo.underlyingMint.address,
          trancheMint:
            selectedTranche === 'senior'
              ? poolInfo.seniorTrancheMint
              : poolInfo.juniorTrancheMint,
          poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
          depositorUnderlyingToken: depositorUnderlyingATA,
          depositorTrancheToken:
            selectedTranche === 'senior' ? seniorTrancheATA : juniorTrancheATA,
          humaConfig: poolInfo.humaConfig,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .transaction()

      setTransaction(tx)
    }
    getTx()
  }, [
    poolInfo,
    program.methods,
    publicKey,
    selectedTranche,
    supplyBigNumber,
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
