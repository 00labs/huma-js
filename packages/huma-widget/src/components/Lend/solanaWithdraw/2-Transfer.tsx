import {
  getTokenAccounts,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import { useHumaProgram } from '@huma-finance/web-shared'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ComputeBudgetProgram, PublicKey, Transaction } from '@solana/web3.js'
import React, { useCallback, useEffect, useState } from 'react'
import { BN } from '@coral-xyz/anchor'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'
import { selectWidgetState } from '../../../store/widgets.selectors'

type Props = {
  poolInfo: SolanaPoolInfo
  withdrawableAmount: BN
  selectedTranche: TrancheType
  poolIsClosed: boolean
}

export function Transfer({
  poolInfo,
  withdrawableAmount,
  selectedTranche,
  poolIsClosed,
}: Props): React.ReactElement | null {
  useLogOnFirstMount('Transaction')
  const { decimals } = poolInfo.underlyingMint
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const { connection } = useConnection()
  const program = useHumaProgram(poolInfo.chainId)
  const [transaction, setTransaction] = useState<Transaction>()
  const { withdrawDestination } = useAppSelector(selectWidgetState)

  useEffect(() => {
    async function getTx() {
      if (!publicKey || transaction || !connection || !withdrawDestination) {
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

      const withdrawalDestinationTokenATA = getAssociatedTokenAddressSync(
        new PublicKey(poolInfo.underlyingMint.address),
        new PublicKey(withdrawDestination),
        true, // allowOwnerOffCurve
        TOKEN_PROGRAM_ID,
      )
      // Create user token account if it doesn't exist
      let createdWithdrawalTokenAccounts = false
      try {
        await getAccount(
          connection,
          withdrawalDestinationTokenATA,
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
          createdWithdrawalTokenAccounts = true
          tx.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              withdrawalDestinationTokenATA,
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
        const transferTx = await createTransferCheckedInstruction(
          underlyingTokenATA,
          new PublicKey(poolInfo.underlyingMint.address),
          withdrawalDestinationTokenATA,
          publicKey,
          BigInt(withdrawableAmount.toString()),
          decimals,
        )
        tx.add(transferTx)

        let txFee = 70_000
        if (createdAccounts) {
          txFee += 25_000
        }
        if (createdWithdrawalTokenAccounts) {
          txFee += 25_000
        }

        tx.instructions.unshift(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: txFee,
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
    decimals,
    poolInfo,
    poolIsClosed,
    program.methods,
    publicKey,
    selectedTranche,
    transaction,
    withdrawDestination,
    withdrawableAmount,
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
