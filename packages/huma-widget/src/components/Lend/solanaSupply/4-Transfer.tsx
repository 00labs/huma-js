import {
  CampaignService,
  checkIsDev,
  getTokenAccounts,
  SolanaPoolInfo,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import React, { useCallback, useEffect, useState } from 'react'

import {
  SolanaPoolState,
  useHumaProgram,
  useLenderAccounts,
} from '@huma-finance/web-shared'
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setPointsAccumulated, setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { SolanaTxSendModal } from '../../SolanaTxSendModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  selectedTranche: TrancheType
  pointsTestnetExperience: boolean
}

export function Transfer({
  poolInfo,
  poolState,
  selectedTranche,
  pointsTestnetExperience,
}: Props): React.ReactElement | null {
  const isDev = checkIsDev()
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.underlyingMint
  const supplyBigNumber = SolanaTokenUtils.parseUnits(
    String(supplyAmount),
    decimals,
  )
  const [transaction, setTransaction] = useState<Transaction>()
  const {
    juniorLenderApprovedAccountPDA,
    seniorLenderApprovedAccountPDA,
    seniorLenderStateAccount,
    juniorLenderStateAccount,
    loading: isLoadingLenderAccounts,
  } = useLenderAccounts(poolInfo.chainId, poolInfo.poolName)
  const program = useHumaProgram(poolInfo.chainId)

  const handleSuccess = useCallback(
    async (options?: { signature: string }) => {
      if (publicKey && poolState.campaign && options?.signature) {
        try {
          const result = await CampaignService.updateWalletPoints(
            publicKey.toString(),
            options.signature,
            poolInfo.chainId,
            isDev,
            pointsTestnetExperience,
          )
          dispatch(setPointsAccumulated(result.pointsAccumulated))
        } catch (error) {
          console.error('Failed to update wallet points', error)
        }
      }
      dispatch(setStep(WIDGET_STEP.Done))
    },
    [
      dispatch,
      isDev,
      pointsTestnetExperience,
      poolInfo.chainId,
      poolState.campaign,
      publicKey,
    ],
  )

  useEffect(() => {
    async function getTx() {
      if (!publicKey || transaction || isLoadingLenderAccounts) {
        return
      }

      const tx = new Transaction()

      const { underlyingTokenATA, seniorTrancheATA, juniorTrancheATA } =
        getTokenAccounts(poolInfo, publicKey)

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
            lenderTrancheToken:
              selectedTranche === 'senior'
                ? seniorTrancheATA
                : juniorTrancheATA,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .transaction()
        tx.add(createLenderAccountsTx)
      }

      const depositTx = await program.methods
        .deposit(supplyBigNumber)
        .accountsPartial({
          approvedLender,
          depositor: publicKey,
          poolConfig: poolInfo.poolConfig,
          underlyingMint: poolInfo.underlyingMint.address,
          trancheMint:
            selectedTranche === 'senior'
              ? poolInfo.seniorTrancheMint
              : poolInfo.juniorTrancheMint,
          poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
          depositorUnderlyingToken: underlyingTokenATA,
          depositorTrancheToken:
            selectedTranche === 'senior' ? seniorTrancheATA : juniorTrancheATA,
          humaConfig: poolInfo.humaConfig,
          underlyingTokenProgram: TOKEN_PROGRAM_ID,
        })
        .transaction()
      tx.add(depositTx)

      setTransaction(tx)
    }
    getTx()
  }, [
    isLoadingLenderAccounts,
    juniorLenderApprovedAccountPDA,
    juniorLenderStateAccount,
    poolInfo,
    program.methods,
    publicKey,
    selectedTranche,
    seniorLenderApprovedAccountPDA,
    seniorLenderStateAccount,
    supplyBigNumber,
    transaction,
  ])

  if (isLoadingLenderAccounts) {
    return <LoadingModal title='Supply' />
  }

  return (
    <SolanaTxSendModal
      tx={transaction}
      chainId={poolInfo.chainId}
      handleSuccess={handleSuccess}
    />
  )
}
