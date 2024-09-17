import {
  getCreditAccounts,
  getTokenAccounts,
  SolanaPoolInfo,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useState } from 'react'

import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useHumaProgram } from '@huma-finance/web-shared'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { selectWidgetState } from '../../../store/widgets.selectors'

type Props = {
  poolInfo: SolanaPoolInfo
}

export function Transfer({ poolInfo }: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { wallet, publicKey } = useWallet()
  const { connection } = useConnection()
  const [transaction, setTransaction] = useState<Transaction>()
  const program = useHumaProgram(poolInfo.chainId)
  const { paymentAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.underlyingMint

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  useEffect(() => {
    async function getTx() {
      if (!wallet || !publicKey || !connection || !paymentAmount) {
        return
      }

      const { underlyingTokenATA } = getTokenAccounts(poolInfo, publicKey)

      const { creditConfigAccount, creditStateAccount } = getCreditAccounts(
        poolInfo,
        publicKey,
      )
      const paymentAmountBN = SolanaTokenUtils.parseUnits(
        paymentAmount.toString(),
        decimals,
      )
      const tx = await program.methods
        .makePayment(paymentAmountBN)
        .accountsPartial({
          signer: publicKey,
          humaConfig: poolInfo.humaConfig,
          poolConfig: poolInfo.poolConfig,
          poolState: poolInfo.poolState,
          creditConfig: creditConfigAccount,
          creditState: creditStateAccount,
          poolAuthority: poolInfo.poolAuthority,
          underlyingMint: poolInfo.underlyingMint.address,
          poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
          borrowerUnderlyingToken: underlyingTokenATA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .transaction()

      setTransaction(tx)
    }
    getTx()
  }, [
    connection,
    decimals,
    dispatch,
    paymentAmount,
    poolInfo,
    poolInfo.underlyingMint.address,
    poolInfo.underlyingMint.decimals,
    program.methods,
    publicKey,
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
