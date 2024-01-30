import {
  capitalizeFirstLetter,
  FirstLossCoverIndex,
  openInNewTab,
  POOL_NAME,
  useFirstLossCoverStatsV2,
  useLenderApprovedV2,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseSupplyType } from './1-ChooseTranche'
import { Evaluation } from './2-Evaluation'
import { ChooseAmount } from './3-ChooseAmount'
import { ApproveAllowance } from './4-ApproveAllowance'
import { Transfer } from './5-Transfer'
import { Success } from './6-Success'
import { Notifications } from './7-Notifications'

export type SupplyType = {
  label: string
  value: string
  type: 'tranche' | 'firstLossCover'
}

/**
 * Lend pool supply props
 * @typedef {Object} LendSupplyPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface LendSupplyPropsV2 {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendSupplyV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: LendSupplyPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const poolName = POOL_NAME[poolNameStr]
  const { chainId, provider, account } = useWeb3React()
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [supplyTypes, setSupplyTypes] = useState<SupplyType[]>([])
  const [selectedSupplyType, setSelectedSupplyType] = useState<SupplyType>()
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)

  const [lenderApprovedSenior] = useLenderApprovedV2(
    poolName,
    'senior',
    account,
    provider,
  )
  const [lenderApprovedJunior] = useLenderApprovedV2(
    poolName,
    'junior',
    account,
    provider,
  )
  const [flcStats] = useFirstLossCoverStatsV2(poolName, account, provider)

  const lenderApproveStatusFetched =
    lenderApprovedSenior !== undefined &&
    lenderApprovedJunior !== undefined &&
    flcStats !== undefined

  useEffect(() => {
    if (!step && poolInfo && lenderApproveStatusFetched) {
      const items: SupplyType[] = []
      if (lenderApprovedSenior) {
        items.push({
          label: 'Senior Tranche',
          value: 'senior',
          type: 'tranche',
        })
      }
      if (lenderApprovedJunior) {
        items.push({
          label: 'Junior Tranche',
          value: 'junior',
          type: 'tranche',
        })
      }
      flcStats
        .filter((flc) => flc.isApproved)
        .forEach((flc) => {
          items.push({
            label: `${capitalizeFirstLetter(
              FirstLossCoverIndex[flc.firstLossCoverIndex],
            )} First Loss Cover`,
            value: String(flc.firstLossCoverIndex),
            type: 'firstLossCover',
          })
        })

      if (items.length === 1) {
        setSelectedSupplyType(items[0])
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
      } else if (items.length > 1) {
        setSupplyTypes(items)
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
      } else if (poolInfo.KYC) {
        dispatch(setStep(WIDGET_STEP.Evaluation))
      } else if (poolInfo.supplyLink) {
        openInNewTab(poolInfo.supplyLink)
      }
    }
  }, [
    dispatch,
    flcStats,
    lenderApproveStatusFetched,
    lenderApprovedJunior,
    lenderApprovedSenior,
    poolInfo,
    step,
  ])

  if (!poolInfo || !poolUnderlyingToken || !lenderApproveStatusFetched) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Supply'
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={`Supply ${poolUnderlyingToken.symbol}`}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseSupplyType
          poolUnderlyingToken={poolUnderlyingToken}
          selectedSupplyType={selectedSupplyType}
          supplyTypes={supplyTypes}
          changeSupplyType={setSelectedSupplyType}
        />
      )}
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation poolInfo={poolInfo} handleClose={handleClose} />
      )}
      {step === WIDGET_STEP.ChooseAmount && selectedSupplyType && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedSupplyType={selectedSupplyType}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && selectedSupplyType && (
        <ApproveAllowance
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedSupplyType={selectedSupplyType}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedSupplyType && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedSupplyType={selectedSupplyType}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={handleClose}
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
