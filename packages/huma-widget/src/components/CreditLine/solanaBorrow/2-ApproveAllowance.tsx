import {
  getSentinelAddress,
  SolanaPoolInfo,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import {
  Account,
  createApproveCheckedInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useAppDispatch } from '../../../hooks/useRedux'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'

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
    () => getSentinelAddress(poolInfo.chainId),
    [poolInfo.chainId],
  )
  const { connection } = useConnection()
  const [transaction, setTransaction] = useState<Transaction>()

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!wallet || !publicKey || !connection || !signTransaction) {
        return
      }

      const tx = new Transaction().add(
        createApproveCheckedInstruction(
          tokenAccount.address,
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
          TOKEN_2022_PROGRAM_ID,
        ),
      )

      setTransaction(tx)
    }
    getTx()
  }, [
    connection,
    dispatch,
    poolInfo.underlyingMint.address,
    poolInfo.underlyingMint.decimals,
    publicKey,
    sendTransaction,
    sentinel,
    signTransaction,
    tokenAccount.address,
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
