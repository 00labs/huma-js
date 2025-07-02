import {
  getTokenAccounts,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import { useHumaProgram } from '@huma-finance/web-shared'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ComputeBudgetProgram, PublicKey, Transaction } from '@solana/web3.js'
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
  const { connection } = useConnection()
  const program = useHumaProgram(poolInfo.chainId)
  const [transaction, setTransaction] = useState<Transaction>()

  useEffect(() => {
    async function getTx() {
      if (!publicKey || transaction || !connection) {
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

      // Create user token account if it doesn't exist
      let createdAccounts = false
      try {
        await getAccount(
          connection,
          underlyingTokenATA,
          undefined,
          TOKEN_PROGRAM_ID,
        )
      } catch (error: unknown) {
        // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
        // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
        // TokenInvalidAccountOwnerError in this code path.
        // Source: https://solana.stackexchange.com/questions/802/checking-to-see-if-a-token-account-exists-using-anchor-ts
        if (
          error instanceof TokenAccountNotFoundError ||
          error instanceof TokenInvalidAccountOwnerError
        ) {
          // As this isn't atomic, it's possible others can create associated accounts meanwhile.
          createdAccounts = true
          tx.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              underlyingTokenATA,
              publicKey,
              new PublicKey(poolInfo.underlyingMint.address),
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID,
            ),
          )
        }
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

        tx.instructions.unshift(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: createdAccounts ? 105_000 : 80_000,
          }),
        )
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

        tx.instructions.unshift(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: createdAccounts ? 145_000 : 120_000,
          }),
        )
      }

      setTransaction(tx)
    }
    getTx()
  }, [
    connection,
    poolInfo,
    poolIsClosed,
    program.methods,
    publicKey,
    selectedTranche,
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
