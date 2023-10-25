import {
  POOL_NAME,
  useLenderApprovedV2,
  useLenderPositionV2,
  usePoolInfoV2,
  usePoolVaultAllowanceV2,
  usePoolUnderlyingTokenBalanceV2,
  VaultType,
  usePoolUnderlyingTokenDetailsV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import {
  useDoesChainSupportNotifi,
  useIsFirstTimeNotifiUser,
} from '../../../hooks/useNotifi'
import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { Evaluation } from './1-Evaluation'
import { ChooseAmount } from './2-ChooseAmount'
import { ApproveAllowance } from './3-ApproveAllowance'
import { Transfer } from './4-Transfer'
import { Success } from './5-Success'
import { Notifications } from './6-Notifications'

/**
 * Lend pool supply props
 * @typedef {Object} LendSupplyPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {VaultType} vaultType The vault type: senior or junior.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface LendSupplyPropsV2 {
  poolName: keyof typeof POOL_NAME
  vaultType: VaultType
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendSupplyV2({
  poolName: poolNameStr,
  vaultType,
  handleClose,
  handleSuccess,
}: LendSupplyPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { decimals, symbol } = usePoolUnderlyingTokenDetailsV2(
    poolName,
    chainId,
    {},
  )
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [allowance] = usePoolVaultAllowanceV2(poolName, account, chainId, {})
  const [balance] = usePoolUnderlyingTokenBalanceV2(
    poolName,
    account,
    chainId,
    {},
  )
  const { isFirstTimeNotifiUser } = useIsFirstTimeNotifiUser(account, chainId)
  const { notifiChainSupported } = useDoesChainSupportNotifi(account, chainId)
  const [lenderApproved] = useLenderApprovedV2(
    poolName,
    vaultType,
    account,
    chainId,
    {},
  )
  const [, refreshLenderPosition] = useLenderPositionV2(
    poolName,
    vaultType,
    account,
    chainId,
    {},
  )

  useEffect(() => {
    if (!step && lenderApproved !== undefined) {
      const nextStep = lenderApproved
        ? WIDGET_STEP.ChooseAmount
        : WIDGET_STEP.Evaluation
      dispatch(setStep(nextStep))
    }
  }, [dispatch, lenderApproved, step])

  const handleSupplySuccess = useCallback(
    (blockNumber: number) => {
      refreshLenderPosition()
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess, refreshLenderPosition],
  )

  const setupNotificationsOrClose = useCallback(() => {
    if (isFirstTimeNotifiUser && notifiChainSupported) {
      dispatch(setStep(WIDGET_STEP.Notifications))
    } else {
      handleClose()
    }
  }, [dispatch, handleClose, isFirstTimeNotifiUser, notifiChainSupported])

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      isLoading={lenderApproved === undefined}
      loadingTitle={`Supply ${symbol}`}
      handleClose={handleClose}
      handleSuccess={handleSupplySuccess}
    >
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation poolInfo={poolInfo} handleClose={handleClose} />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          allowance={allowance}
          underlyingTokenBalance={ethers.utils.formatUnits(balance, decimals)}
          withdrawalLockoutSeconds={0}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer poolInfo={poolInfo} vaultType={vaultType} />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          handleAction={setupNotificationsOrClose}
          hasNextStep={isFirstTimeNotifiUser}
        />
      )}
      {step === WIDGET_STEP.Notifications && (
        <Notifications handleAction={handleClose} />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Supply'
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
