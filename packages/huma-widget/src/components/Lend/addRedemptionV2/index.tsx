import {
  getTrancheAssetsAndShares,
  POOL_NAME,
  TrancheType,
} from '@huma-finance/core'
import {
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/web-core'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseTranche } from './1-ChooseTranche'
import { ChooseAmount } from './2-ChooseAmount'
import { Transfer } from './3-Transfer'
import { Done } from './4-Done'

export type TrancheInfo = {
  tranche: TrancheType
  assets: BigNumber
  shares: BigNumber
}

/**
 * Lend pool add redemption props
 * @typedef {Object} AddRedemptionPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type AddRedemptionPropsV2 = {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function AddRedemptionV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: AddRedemptionPropsV2): React.ReactElement | null {
  const title = 'Redemption'
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage, errorReason } = useAppSelector(selectWidgetState)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const [seniorTrancheInfo, setSeniorTrancheInfo] = useState<TrancheInfo>()
  const [juniorTrancheInfo, setJuniorTrancheInfo] = useState<TrancheInfo>()
  const [trancheInfo, setTrancheInfo] = useState<TrancheInfo>()
  const trancheInfoFetched = seniorTrancheInfo && juniorTrancheInfo

  useEffect(() => {
    if (account) {
      getTrancheAssetsAndShares(poolName, 'senior', account, provider).then(
        (info) => {
          if (info) {
            setSeniorTrancheInfo({ ...info, tranche: 'senior' })
          }
        },
      )
      getTrancheAssetsAndShares(poolName, 'junior', account, provider).then(
        (info) => {
          if (info) {
            setJuniorTrancheInfo({ ...info, tranche: 'junior' })
          }
        },
      )
    }
  }, [account, poolName, provider])

  useEffect(() => {
    if (!step && trancheInfoFetched) {
      if (juniorTrancheInfo.assets.gt(0) && seniorTrancheInfo.assets.lte(0)) {
        setTrancheInfo(juniorTrancheInfo)
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (seniorTrancheInfo.assets.gt(0) && juniorTrancheInfo.assets.lte(0)) {
        setTrancheInfo(seniorTrancheInfo)
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (juniorTrancheInfo.assets.gt(0) && seniorTrancheInfo.assets.gt(0)) {
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
      }
    }
  }, [dispatch, juniorTrancheInfo, seniorTrancheInfo, step, trancheInfoFetched])

  const handleRedeemSuccess = useCallback(
    (blockNumber: number) => {
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess],
  )

  const handleChangeTranche = useCallback(
    (tranche: TrancheType) => {
      if (tranche === 'senior') {
        setTrancheInfo(seniorTrancheInfo)
      } else if (tranche === 'junior') {
        setTrancheInfo(juniorTrancheInfo)
      } else {
        setTrancheInfo(undefined)
      }
    },
    [juniorTrancheInfo, seniorTrancheInfo],
  )

  if (!poolInfo || !poolUnderlyingToken || !trancheInfoFetched) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle={title}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={title}
      handleClose={handleClose}
      handleSuccess={handleRedeemSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          selectedTranche={trancheInfo?.tranche}
          changeTranche={handleChangeTranche}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && trancheInfo && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          trancheInfo={trancheInfo}
        />
      )}
      {step === WIDGET_STEP.Transfer && trancheInfo && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          trancheInfo={trancheInfo}
        />
      )}
      {step === WIDGET_STEP.Done && trancheInfo && (
        <Done handleAction={handleClose} />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title={title}
          errorReason={errorReason}
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
