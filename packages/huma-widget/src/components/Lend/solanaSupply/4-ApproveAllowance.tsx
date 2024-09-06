import {
  SOLANA_CHAIN_INFO,
  SolanaPoolInfo,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useMemo } from 'react'

import {
  Account,
  createApproveCheckedInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  PublicKey,
  SimulateTransactionConfig,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setError, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: SolanaPoolInfo
  tokenAccount: Account
}

export function ApproveAllowance({
  poolInfo,
  tokenAccount,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { wallet, publicKey, sendTransaction, signTransaction } = useWallet()
  const sentinel = useMemo(
    () => SOLANA_CHAIN_INFO[poolInfo.chainId].sentinel,
    [poolInfo.chainId],
  )
  const { connection } = useConnection()

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  useEffect(() => {
    async function approveDelegate() {
      if (!wallet || !publicKey || !connection || !signTransaction) {
        return
      }

      try {
        console.log(tokenAccount.address.toString())
        console.log(poolInfo.underlyingMint.address)
        console.log(sentinel)
        console.log(publicKey.toString())
        const tx = new Transaction().add(
          createApproveCheckedInstruction(
            tokenAccount.address,
            new PublicKey(poolInfo.underlyingMint.address),
            new PublicKey(sentinel), // delegate
            publicKey, // owner of the wallet
            SolanaTokenUtils.parseUnits(
              '100000000000', // 100 billion
              poolInfo.underlyingMint.decimals,
            ), // amount
            poolInfo.underlyingMint.decimals,
            undefined, // multiSigners
            TOKEN_2022_PROGRAM_ID,
          ),
        )
        tx.feePayer = publicKey
        const latestBlockHash = await connection.getLatestBlockhash()
        tx.recentBlockhash = latestBlockHash.blockhash
        signTransaction(tx)

        const versionedTx = new VersionedTransaction(tx.compileMessage())

        // Set up simulation configuration
        const simulateConfig: SimulateTransactionConfig = {
          sigVerify: false, // Don't verify signatures during simulation
          replaceRecentBlockhash: true, // Replace the blockhash with the latest one
        }

        const simulationResult = await connection.simulateTransaction(
          versionedTx,
          simulateConfig,
        )

        if (simulationResult.value.err) {
          console.error(
            'Transaction simulation failed:',
            simulationResult.value.logs,
          )
        }

        // const signature = await sendTransaction(tx, connection)

        // const result = await connection.confirmTransaction({
        //   blockhash: latestBlockHash.blockhash,
        //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        //   signature,
        // })

        // console.log(result)
      } catch (error: unknown) {
        const err = error as Error
        dispatch(setError({ errorMessage: err?.message || '' }))
      }
    }
    approveDelegate()
  }, [
    connection,
    dispatch,
    poolInfo.underlyingMint.address,
    poolInfo.underlyingMint.decimals,
    publicKey,
    sendTransaction,
    sentinel,
    tokenAccount.address,
    wallet,
  ])

  return (
    <LoadingModal
      title='Approve Delegate'
      description='Waiting for approval confirmation...'
    >
      Loading...
    </LoadingModal>
  )
}
