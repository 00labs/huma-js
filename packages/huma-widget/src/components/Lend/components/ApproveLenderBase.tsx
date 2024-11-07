/* eslint-disable no-await-in-loop */
import {
  CHAIN_TYPE,
  checkIsDev,
  IdentityServiceV2,
  timeUtil,
  TrancheType,
} from '@huma-finance/shared'
import { useChainInfo } from '@huma-finance/web-shared'
import React, { useCallback, useEffect } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setError, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  juniorTrancheVault: string
  seniorTrancheVault: string
  chainType: CHAIN_TYPE
  isUniTranche: boolean
  chainSpecificData?: Record<string, unknown>
  changeTranche: (tranche: TrancheType) => void
}

export function ApproveLenderBase({
  juniorTrancheVault,
  seniorTrancheVault,
  isUniTranche,
  chainType,
  chainSpecificData,
  changeTranche,
}: Props): React.ReactElement | null {
  const isDev = checkIsDev()
  const dispatch = useAppDispatch()
  const { account, chainId } = useChainInfo(isDev, chainType)

  const approveLender = useCallback(
    async (trancheVault: string) => {
      let tryAttempts = 2

      while (tryAttempts > 0) {
        try {
          tryAttempts -= 1
          await IdentityServiceV2.approveLender(
            account!,
            chainId!,
            trancheVault,
            isDev,
            chainSpecificData,
          )
          tryAttempts = 0
        } catch (e: unknown) {
          if (tryAttempts === 0) {
            dispatch(
              setError({
                errorMessage: 'Something went wrong, please try again later.',
              }),
            )
          } else {
            await timeUtil.sleep(3000)
            console.error(e)
          }
        }
      }
    },
    [account, chainId, chainSpecificData, dispatch, isDev],
  )

  useEffect(() => {
    const approveLenderAsync = async () => {
      if (account && chainId) {
        if (isUniTranche) {
          await approveLender(juniorTrancheVault)
          changeTranche('junior')
          dispatch(setStep(WIDGET_STEP.ChooseAmount))
        } else {
          await approveLender(juniorTrancheVault)
          await approveLender(seniorTrancheVault)
          dispatch(setStep(WIDGET_STEP.ChooseTranche))
        }
      }
    }

    approveLenderAsync()
  }, [
    account,
    approveLender,
    chainId,
    changeTranche,
    dispatch,
    isUniTranche,
    juniorTrancheVault,
    seniorTrancheVault,
  ])

  return (
    <LoadingModal
      title='Lender Approval'
      description='Checking your verification status...'
    />
  )
}
