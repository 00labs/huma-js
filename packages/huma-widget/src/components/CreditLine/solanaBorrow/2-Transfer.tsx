import {
  getCreditAccounts,
  getSentinelAddress,
  getTokenAccounts,
  SolanaPoolInfo,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useState } from 'react'

import { BN } from '@coral-xyz/anchor'
import { useHumaProgram } from '@huma-finance/web-shared'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createApproveCheckedInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'

type Props = {
  poolInfo: SolanaPoolInfo
}

export function Transfer({ poolInfo }: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { wallet, publicKey } = useWallet()
  const sentinel = getSentinelAddress(poolInfo.chainId)
  const { connection } = useConnection()
  const [transaction, setTransaction] = useState<Transaction>()
  const program = useHumaProgram(poolInfo.chainId)
  const { borrowAmountBN: borrowAmountBNJson } =
    useAppSelector(selectWidgetState)

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!wallet || !publicKey || !connection) {
        return
      }

      const { underlyingTokenATA } = getTokenAccounts(poolInfo, publicKey)
      const tx = new Transaction()

      // Create user token account if it doesn't exist
      let tokenAccount
      try {
        tokenAccount = await getAccount(
          connection,
          underlyingTokenATA,
          undefined,
          TOKEN_PROGRAM_ID,
        )
      } catch (error: unknown) {
        // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
        // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
        // TokenInvalidAccountOwnerError in this code path.
        if (
          error instanceof TokenAccountNotFoundError ||
          error instanceof TokenInvalidAccountOwnerError
        ) {
          // As this isn't atomic, it's possible others can create associated accounts meanwhile.
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

      // Approve allowance to the sentinel if the account is new or delegated amount is not enough
      const borrowAmountBN = new BN(borrowAmountBNJson?.toString() ?? '0')
      if (
        !tokenAccount ||
        borrowAmountBN.gt(new BN(tokenAccount.delegatedAmount.toString())) ||
        tokenAccount.delegate?.toString() !== sentinel
      ) {
        tx.add(
          createApproveCheckedInstruction(
            underlyingTokenATA,
            new PublicKey(poolInfo.underlyingMint.address),
            new PublicKey(sentinel), // delegate
            publicKey, // owner of the wallet
            BigInt(
              SolanaTokenUtils.parseUnits(
                '100000000000', // 100 billion
                poolInfo.underlyingMint.decimals,
              ).toString(),
            ), // amount
            poolInfo.underlyingMint.decimals,
            undefined, // multiSigners
            TOKEN_PROGRAM_ID,
          ),
        )
      }

      const { creditConfigAccount, creditStateAccount } = getCreditAccounts(
        poolInfo,
        publicKey,
      )
      // borrowAmountBNJson is stored as a raw number string in this flow
      const programTx = await program.methods
        .drawdown(borrowAmountBN)
        .accountsPartial({
          borrower: publicKey,
          humaConfig: poolInfo.humaConfig,
          poolConfig: poolInfo.poolConfig,
          poolState: poolInfo.poolState,
          creditConfig: creditConfigAccount,
          creditState: creditStateAccount,
          poolAuthority: poolInfo.poolAuthority,
          underlyingMint: poolInfo.underlyingMint.address,
          poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
          borrowerUnderlyingToken: underlyingTokenATA,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction()
      tx.add(programTx)

      setTransaction(tx)
    }
    getTx()
  }, [
    borrowAmountBNJson,
    connection,
    dispatch,
    poolInfo,
    poolInfo.underlyingMint.address,
    poolInfo.underlyingMint.decimals,
    program.methods,
    publicKey,
    sentinel,
    wallet,
  ])

  return (
    <SolanaTxSendModal
      tx={transaction}
      chainId={poolInfo.chainId}
      handleSuccess={handleSuccess}
    />
  )
}
