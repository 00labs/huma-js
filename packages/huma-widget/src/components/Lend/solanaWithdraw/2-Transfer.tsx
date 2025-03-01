import {
  getTokenAccounts,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import { useHumaProgram, useLenderAccounts } from '@huma-finance/web-shared'
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import React, { useCallback, useEffect, useState } from 'react'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'

type Props = {
  poolInfo: SolanaPoolInfo
  selectedTranche: TrancheType
  poolIsClosed: boolean
}

export function Transfer({
  poolInfo,
  selectedTranche,
  poolIsClosed,
}: Props): React.ReactElement | null {
  useLogOnFirstMount('Transaction')
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const program = useHumaProgram(poolInfo.chainId)
  const [transaction, setTransaction] = useState<Transaction>()
  const {
    juniorLenderApprovedAccountPDA,
    seniorLenderApprovedAccountPDA,
    seniorLenderStateAccount,
    juniorLenderStateAccount,
    loading: isLoadingLenderAccounts,
  } = useLenderAccounts(poolInfo.chainId, poolInfo.poolName)

  useEffect(() => {
    async function getTx() {
      if (!publicKey || transaction || isLoadingLenderAccounts) {
        return
      }

      const tx = new Transaction()
      const { underlyingTokenATA, seniorTrancheATA, juniorTrancheATA } =
        getTokenAccounts(poolInfo, publicKey)
      const trancheMint =
        selectedTranche === 'senior'
          ? poolInfo.seniorTrancheMint
          : poolInfo.juniorTrancheMint
      const lenderTrancheToken =
        selectedTranche === 'senior' ? seniorTrancheATA : juniorTrancheATA

      const approvedLender =
        selectedTranche === 'senior'
          ? seniorLenderApprovedAccountPDA!
          : juniorLenderApprovedAccountPDA!

      if (
        (selectedTranche === 'senior' && !seniorLenderStateAccount) ||
        (selectedTranche === 'junior' && !juniorLenderStateAccount)
      ) {
        const createLenderAccountsTx = await program.methods
          .createLenderAccounts()
          .accountsPartial({
            lender: publicKey,
            humaConfig: poolInfo.humaConfig,
            poolConfig: poolInfo.poolConfig,
            approvedLender,
            trancheMint:
              selectedTranche === 'senior'
                ? poolInfo.seniorTrancheMint
                : poolInfo.juniorTrancheMint,
            lenderTrancheToken,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .transaction()
        tx.add(createLenderAccountsTx)
      }

      if (!poolIsClosed) {
        const disburseTx = await program.methods
          .disburse()
          .accountsPartial({
            lender: publicKey,
            humaConfig: poolInfo.humaConfig,
            poolConfig: poolInfo.poolConfig,
            underlyingMint: poolInfo.underlyingMint.address,
            trancheMint,
            poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
            lenderUnderlyingToken: underlyingTokenATA,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .transaction()
        tx.add(disburseTx)
      } else {
        const withdrawAfterPoolClosureTx = await program.methods
          .withdrawAfterPoolClosure()
          .accountsPartial({
            lender: publicKey,
            humaConfig: poolInfo.humaConfig,
            poolConfig: poolInfo.poolConfig,
            underlyingMint: poolInfo.underlyingMint.address,
            trancheMint,
            poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
            lenderUnderlyingToken: underlyingTokenATA,
            lenderTrancheToken,
            underlyingTokenProgram: TOKEN_PROGRAM_ID,
            trancheTokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .transaction()
        tx.add(withdrawAfterPoolClosureTx)
      }

      setTransaction(tx)
    }
    getTx()
  }, [
    isLoadingLenderAccounts,
    juniorLenderApprovedAccountPDA,
    juniorLenderStateAccount,
    poolInfo,
    poolIsClosed,
    program.methods,
    publicKey,
    selectedTranche,
    seniorLenderApprovedAccountPDA,
    seniorLenderStateAccount,
    transaction,
  ])

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  return (
    <SolanaTxSendModal
      tx={transaction}
      chainId={poolInfo.chainId}
      handleSuccess={handleSuccess}
    />
  )
}
