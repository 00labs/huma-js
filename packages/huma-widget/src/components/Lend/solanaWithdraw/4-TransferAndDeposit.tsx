import { BN } from '@coral-xyz/anchor'
import {
  getSolanaNetworkType,
  getTokenAccounts,
  PermissionlessDepositCommitment,
  PermissionlessDepositMode,
  PermissionlessService,
  SOLANA_CHAIN_INFO_PERMISSIONLESS,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import {
  checkIsDev,
  useHumaProgram,
  usePermissionlessLenderModeATA,
  usePermissionlessLenderStateAccount,
  usePermissionlessProgram,
} from '@huma-finance/web-shared'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
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
  permissionlessMode: PermissionlessDepositMode
  withdrawableAmount: BN
  depositCommitment: PermissionlessDepositCommitment
}

export function TransferAndDeposit({
  poolInfo,
  selectedTranche,
  poolIsClosed,
  permissionlessMode,
  withdrawableAmount,
  depositCommitment,
}: Props): React.ReactElement | null {
  useLogOnFirstMount('RedepositTransaction')
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const { connection } = useConnection()
  const program = useHumaProgram(poolInfo.chainId)
  const programPermissionless = usePermissionlessProgram()
  const [transaction, setTransaction] = useState<Transaction>()
  const { lenderStateAccount, isLoaded: isLoadedLenderStateAccount } =
    usePermissionlessLenderStateAccount(poolInfo.chainId, permissionlessMode)
  const solanaChainInfoPermissionless =
    SOLANA_CHAIN_INFO_PERMISSIONLESS[poolInfo.chainId]
  const { lenderClassicModeTokenATA, lenderMaxiModeTokenATA } =
    usePermissionlessLenderModeATA(poolInfo.chainId)

  useEffect(() => {
    async function getTx() {
      if (
        !publicKey ||
        transaction ||
        !connection ||
        !isLoadedLenderStateAccount ||
        !lenderClassicModeTokenATA ||
        !lenderMaxiModeTokenATA
      ) {
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

      const permissionlessModeConfig =
        permissionlessMode === PermissionlessDepositMode.CLASSIC
          ? solanaChainInfoPermissionless.classicModeConfig
          : solanaChainInfoPermissionless.maxiModeConfig
      const permissonlessLenderModeTokenATA =
        permissionlessMode === PermissionlessDepositMode.CLASSIC
          ? lenderClassicModeTokenATA
          : lenderMaxiModeTokenATA

      if (!lenderStateAccount) {
        const createLenderAccountInstruction =
          await programPermissionless.methods
            .createLenderAccounts()
            .accountsPartial({
              lender: publicKey,
              humaConfig: solanaChainInfoPermissionless.humaConfig,
              poolConfig: solanaChainInfoPermissionless.poolConfig,
              modeConfig: permissionlessModeConfig,
              lenderModeToken: permissonlessLenderModeTokenATA,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .transaction()
        tx.add(createLenderAccountInstruction)
      }

      tx.add(
        createAssociatedTokenAccountIdempotentInstruction(
          publicKey,
          permissonlessLenderModeTokenATA,
          publicKey,
          new PublicKey(
            permissionlessMode === PermissionlessDepositMode.CLASSIC
              ? solanaChainInfoPermissionless.classicModeMint
              : solanaChainInfoPermissionless.maxiModeMint,
          ),
          TOKEN_PROGRAM_ID,
        ),
      )

      const depositTx = await programPermissionless.methods
        .deposit(withdrawableAmount, depositCommitment, false)
        .accountsPartial({
          depositor: publicKey,
          humaConfig: solanaChainInfoPermissionless.humaConfig,
          poolConfig: solanaChainInfoPermissionless.poolConfig,
          modeConfig: permissionlessModeConfig,
          underlyingMint: solanaChainInfoPermissionless.underlyingMint,
          underlyingTokenProgram: TOKEN_PROGRAM_ID,
          modeTokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction()
      tx.add(depositTx)

      if (createdAccounts) {
        tx.instructions.unshift(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: poolIsClosed ? 145_000 : 105_000,
          }),
        )
      }

      setTransaction(tx)
    }
    getTx()
  }, [
    connection,
    depositCommitment,
    isLoadedLenderStateAccount,
    lenderClassicModeTokenATA,
    lenderMaxiModeTokenATA,
    lenderStateAccount,
    permissionlessMode,
    poolInfo,
    poolIsClosed,
    program.methods,
    programPermissionless.methods,
    publicKey,
    selectedTranche,
    solanaChainInfoPermissionless,
    transaction,
    withdrawableAmount,
  ])

  const handleSuccess = useCallback(
    async (options?: { signature: string }) => {
      const isDev = checkIsDev()
      if (publicKey && options?.signature) {
        try {
          await PermissionlessService.updatePermissionlessDeposit(
            getSolanaNetworkType(poolInfo.chainId),
            isDev,
            publicKey.toString(),
            poolInfo.chainId,
            options?.signature,
          )
        } catch (error) {
          console.error('Failed to update permissionless deposit', error)
        }
      }
      dispatch(setStep(WIDGET_STEP.Done))
    },
    [dispatch, poolInfo.chainId, publicKey],
  )

  return (
    <SolanaTxSendModal
      tx={transaction}
      chainId={poolInfo.chainId}
      handleSuccess={handleSuccess}
    />
  )
}
