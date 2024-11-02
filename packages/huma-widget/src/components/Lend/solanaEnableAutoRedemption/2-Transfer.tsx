import {
  convertToShares,
  getSentinelAddress,
  getTokenAccounts,
  SolanaPoolInfo,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useState } from 'react'

import {
  SolanaPoolState,
  useHumaProgram,
  useLenderAccounts,
  useTrancheTokenAccounts,
} from '@huma-finance/web-shared'
import {
  createApproveCheckedInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setError, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
}

export function Transfer({
  poolInfo,
  poolState,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const sentinel = getSentinelAddress(poolInfo.chainId)
  const [transaction, setTransaction] = useState<Transaction>()
  const {
    juniorLenderApprovedAccountPDA,
    seniorLenderApprovedAccountPDA,
    seniorLenderStateAccount,
    juniorLenderStateAccount,
    seniorTrancheMintSupply,
    juniorTrancheMintSupply,
    loading: isLoadingLenderAccounts,
  } = useLenderAccounts(poolInfo.chainId, poolInfo.poolName)
  const {
    seniorTokenAccount,
    juniorTokenAccount,
    loading: isLoadingTrancheTokenAccounts,
  } = useTrancheTokenAccounts(poolInfo)
  const program = useHumaProgram(poolInfo.chainId)

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (
        !publicKey ||
        transaction ||
        isLoadingLenderAccounts ||
        isLoadingTrancheTokenAccounts
      ) {
        return
      }

      const tx = new Transaction()

      const { seniorTrancheATA, juniorTrancheATA } = getTokenAccounts(
        poolInfo,
        publicKey,
      )
      const sentinelPubKey = new PublicKey(sentinel)

      if (!seniorTokenAccount?.amount && !juniorTokenAccount?.amount) {
        dispatch(
          setError({ errorMessage: 'Error reading tranche token balance' }),
        )
        return
      }
      if (
        seniorTokenAccount &&
        seniorTokenAccount.amount > 0 &&
        (seniorTokenAccount.delegate == null ||
          !sentinelPubKey.equals(seniorTokenAccount.delegate) ||
          seniorTokenAccount.delegatedAmount < seniorTokenAccount.amount)
      ) {
        const sharesAmount = convertToShares(
          new BN(poolState.seniorTrancheAssets ?? 0),
          seniorTrancheMintSupply ?? new BN(0),
          new BN(seniorTokenAccount.amount.toString()),
        )
        tx.add(
          createApproveCheckedInstruction(
            seniorTrancheATA,
            new PublicKey(poolInfo.seniorTrancheMint),
            new PublicKey(sentinel), // delegate
            publicKey, // owner of the wallet
            BigInt(sharesAmount.muln(1.1).toString()), // amount
            poolInfo.trancheDecimals,
            undefined, // multiSigners
            TOKEN_2022_PROGRAM_ID,
          ),
        )
      }
      if (
        juniorTokenAccount &&
        juniorTokenAccount.amount > 0 &&
        (juniorTokenAccount.delegate == null ||
          !sentinelPubKey.equals(juniorTokenAccount.delegate) ||
          juniorTokenAccount.delegatedAmount < juniorTokenAccount.amount)
      ) {
        const sharesAmount = convertToShares(
          new BN(poolState.juniorTrancheAssets ?? 0),
          juniorTrancheMintSupply ?? new BN(0),
          new BN(juniorTokenAccount.amount.toString()),
        )
        tx.add(
          createApproveCheckedInstruction(
            juniorTrancheATA,
            new PublicKey(poolInfo.juniorTrancheMint),
            new PublicKey(sentinel), // delegate
            publicKey, // owner of the wallet
            BigInt(sharesAmount.muln(1.1).toString()), // amount
            poolInfo.trancheDecimals,
            undefined, // multiSigners
            TOKEN_2022_PROGRAM_ID,
          ),
        )
      }
      if (!tx.instructions.length) {
        dispatch(
          setError({ errorMessage: 'No tranches require Auto-Redemption' }),
        )
        return
      }

      setTransaction(tx)
    }
    getTx()
  }, [
    dispatch,
    isLoadingLenderAccounts,
    isLoadingTrancheTokenAccounts,
    juniorLenderApprovedAccountPDA,
    juniorLenderStateAccount,
    juniorTokenAccount,
    juniorTrancheMintSupply,
    poolInfo,
    poolState.juniorTrancheAssets,
    poolState.seniorTrancheAssets,
    program.methods,
    publicKey,
    seniorLenderApprovedAccountPDA,
    seniorLenderStateAccount,
    seniorTokenAccount,
    seniorTrancheMintSupply,
    sentinel,
    transaction,
  ])

  if (isLoadingLenderAccounts || isLoadingTrancheTokenAccounts) {
    return <LoadingModal title='Auto-Redeem' />
  }

  return (
    <SolanaTxSendModal
      tx={transaction}
      chainId={poolInfo.chainId}
      handleSuccess={handleSuccess}
    />
  )
}
