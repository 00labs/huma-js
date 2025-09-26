import {
  formatNumberFixed,
  PermissionlessDepositCommitment,
  PermissionlessDepositMode,
  SolanaPoolInfo,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import {
  LenderStateAccount,
  LoggingContext,
  LoggingContextHelper,
  SolanaPoolState,
} from '@huma-finance/web-shared'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { BN } from '@coral-xyz/anchor'
import { SubgraphService } from '@huma-finance/sdk'
import { Mint } from '@solana/spl-token'
import { useAppSelector } from '../../../hooks/useRedux'
import { setLoggingContext, setStep } from '../../../store/widgets.reducers'
import {
  selectWidgetLoggingContext,
  selectWidgetState,
} from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApolloWrapper } from '../../ApolloWrapper'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { Option } from './1-Option'
import { WithdrawAndDepositConfirm } from './2-WithdrawAndDepositConfirm'
import { WithdrawOnlyConfirm } from './3-WithdrawOnlyConfirm'
import { Transfer } from './4-Transfer'
import { Done } from './5-Done'

export type ClaimAndStakeOption = {
  label: string
  description?: string[]
  id: string
}

export const ClaimAndStakeOptions: ClaimAndStakeOption[] = [
  {
    label: 'Withdraw and redeposit to Permissionless',
    description: [
      'Earn more with OG status',
      'Choose your own investment lockup periods',
      'Earn incentives for longer commitments',
      'Earn Vanguard status',
    ],
    id: 'claim-and-stake',
  },
  {
    label: `Withdraw only`,
    id: 'claim-only',
  },
]

/**
 * Solana lend pool withdraw props
 * @typedef {Object} SolanaLendWithdrawProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {SolanaPoolState} poolState The current state config of the pool.
 * @property {LenderStateAccount} lenderStateAccount The lender state account of the user.
 * @property {Mint} trancheMintAccount The mint account of the tranche.
 * @property {TrancheType} trancheType The type of the tranche.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type SolanaLendWithdrawProps = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  lenderStateAccount: LenderStateAccount
  trancheMintAccount: Mint
  trancheType: TrancheType
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function SolanaLendWithdraw({
  poolInfo,
  poolState,
  lenderStateAccount,
  trancheMintAccount,
  trancheType,
  handleClose,
  handleSuccess,
}: SolanaLendWithdrawProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const { symbol, decimals } = poolInfo.underlyingMint
  const title = `Withdraw ${symbol}`
  const poolIsClosed = poolState.status === 'closed'
  const [sharePrice, setSharePrice] = useState(0)
  const { totalAmountProcessed, totalAmountWithdrawn } =
    lenderStateAccount.redemptionRecord
  const withdrawableAmount = totalAmountProcessed.sub(totalAmountWithdrawn)
  const withdrawableAmountFormatted = formatNumberFixed(
    SolanaTokenUtils.formatUnits(withdrawableAmount, decimals),
    2,
  )
  const [withdrawnAmount, setWithdrawnAmount] = useState<BN>()
  const loggingHelper = useAppSelector(selectWidgetLoggingContext)
  const [selectedOption, setSelectedOption] = useState(ClaimAndStakeOptions[0])
  const [selectedDepositMode, setSelectedDepositMode] = useState(
    PermissionlessDepositMode.CLASSIC,
  )
  const [selectedDepositCommitment, setSelectedDepositCommitment] = useState(
    PermissionlessDepositCommitment.INITIAL_COMMITMENT_THREE_MONTHS,
  )

  const handleCloseFlow = () => {
    loggingHelper.logAction('ExitFlow', {})
    handleClose()
  }

  // After withdrawn success, the handleSuccess will refresh
  // the lenderStateAccount which will update the withdrawableAmount to 0
  // so we need to keep the withdrawnAmount to show in the Done step
  useEffect(() => {
    if (!withdrawnAmount) {
      setWithdrawnAmount(withdrawableAmount)
    }
  }, [withdrawableAmount, withdrawnAmount])

  useEffect(() => {
    if (!step) {
      // Set initial logging context
      const context: LoggingContext = {
        flow: 'Withdraw',
        chainId: poolInfo.chainId,
        poolName: poolInfo.poolName,
        poolType: poolInfo.poolType,
        chainType: 'Solana',
      }
      const loggingHelperInit = new LoggingContextHelper(context)
      loggingHelperInit.logAction('StartFlow', {})
      dispatch(setLoggingContext(context))

      dispatch(setStep(WIDGET_STEP.ConfirmWithdrawAndDeposit))
    }
  }, [dispatch, poolInfo.chainId, poolInfo.poolName, poolInfo.poolType, step])

  useEffect(() => {
    const trancheAssets =
      trancheType === 'senior'
        ? poolState.seniorTrancheAssets
        : poolState.juniorTrancheAssets

    const trancheAssetsVal = new BN(trancheAssets ?? 1)
    const trancheSupplyVal = new BN(
      trancheMintAccount.supply.toString(),
    ).isZero()
      ? new BN(1)
      : new BN(trancheMintAccount.supply.toString())
    const sharePrice =
      trancheAssetsVal.muln(100000).div(trancheSupplyVal).toNumber() / 100000
    setSharePrice(sharePrice)
  }, [
    poolState.juniorTrancheAssets,
    poolState.seniorTrancheAssets,
    trancheMintAccount.supply,
    trancheType,
  ])

  const handleConfirmOption = useCallback(() => {
    if (selectedOption.id === 'claim-and-stake') {
      dispatch(setStep(WIDGET_STEP.ConfirmWithdrawAndDeposit))
    } else {
      dispatch(setStep(WIDGET_STEP.ConfirmWithdrawOnly))
    }
  }, [dispatch, selectedOption.id])

  const withdrawAndDeposit = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  const handleWithdrawSuccess = useCallback(
    (blockNumber: number) => {
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess],
  )

  return (
    <WidgetWrapper
      isOpen
      width={step === WIDGET_STEP.ConfirmWithdrawAndDeposit ? '520px' : '480px'}
      loadingTitle={title}
      handleClose={handleCloseFlow}
      handleSuccess={handleWithdrawSuccess}
    >
      {step === WIDGET_STEP.Option && (
        <Option
          poolUnderlyingToken={poolInfo.underlyingMint}
          withdrawableAmountFormatted={withdrawableAmountFormatted ?? '--'}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          handleConfirmOption={handleConfirmOption}
        />
      )}
      {step === WIDGET_STEP.ConfirmWithdrawAndDeposit && (
        <ApolloWrapper
          uri={SubgraphService.getSubgraphUrlForChainId(
            poolInfo.chainId!,
            import.meta.env.VITE_SUBGRAPH_API_KEY,
          )}
        >
          <WithdrawAndDepositConfirm
            withdrawableAmount={withdrawableAmount}
            withdrawableAmountFormatted={withdrawableAmountFormatted ?? '--'}
            chainId={poolInfo.chainId}
            selectedDepositMode={selectedDepositMode}
            setSelectedDepositMode={setSelectedDepositMode}
            selectedDepositCommitment={selectedDepositCommitment}
            setSelectedDepositCommitment={setSelectedDepositCommitment}
            withdrawAndDeposit={withdrawAndDeposit}
          />
        </ApolloWrapper>
      )}
      {step === WIDGET_STEP.ConfirmWithdrawOnly && (
        <WithdrawOnlyConfirm
          poolUnderlyingToken={poolInfo.underlyingMint}
          withdrawableAmountFormatted={withdrawableAmountFormatted ?? '--'}
          sharePrice={sharePrice}
        />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer
          poolInfo={poolInfo}
          selectedTranche={trancheType}
          poolIsClosed={poolIsClosed}
        />
      )}
      {step === WIDGET_STEP.Done && withdrawnAmount && (
        <Done
          poolUnderlyingToken={poolInfo.underlyingMint}
          withdrawAmount={withdrawnAmount}
          handleAction={handleCloseFlow}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title={title}
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleCloseFlow}
        />
      )}
    </WidgetWrapper>
  )
}
