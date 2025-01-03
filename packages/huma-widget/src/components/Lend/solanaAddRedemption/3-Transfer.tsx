import {
  getTokenAccounts,
  SolanaPoolInfo,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import {
  useHumaProgram,
  useTrancheMintAccounts,
} from '@huma-finance/web-shared'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
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
  const { redeemShares } = useAppSelector(selectWidgetState)
  const { mintAccount } = useTrancheMintAccounts(poolInfo, selectedTranche)
  const [transaction, setTransaction] = useState<Transaction>()
  const program = useHumaProgram(poolInfo.chainId)
  const redeemBN = useMemo(() => {
    if (!mintAccount) {
      return null
    }
    return SolanaTokenUtils.parseUnits(
      String(redeemShares),
      mintAccount?.decimals,
    )
  }, [mintAccount, redeemShares])

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!publicKey || !redeemBN || transaction) {
        return
      }

      const {
        seniorTrancheATA,
        juniorTrancheATA,
        poolSeniorTrancheATA,
        poolJuniorTrancheATA,
      } = getTokenAccounts(poolInfo, publicKey)
      const tx = await program.methods
        .addRedemptionRequest(publicKey, redeemBN)
        .accountsPartial({
          signer: publicKey,
          humaConfig: poolInfo.humaConfig,
          poolConfig: poolInfo.poolConfig,
          trancheMint:
            selectedTranche === 'senior'
              ? poolInfo.seniorTrancheMint
              : poolInfo.juniorTrancheMint,
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
    poolInfo,
    program.methods,
    publicKey,
    redeemBN,
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
