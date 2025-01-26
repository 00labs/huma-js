/* eslint-disable no-await-in-loop */
import {
  CHAIN_TYPE,
  checkIsDev,
  COMMON_ERROR_MESSAGE,
  IdentityServiceV2,
  NETWORK_TYPE,
  SOLANA_TRANSACTION_EXPIRED_BLOCKHEIGHT_EXCEEDED_ERROR,
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
  networkType: NETWORK_TYPE
  isUniTranche: boolean
  documentHash: string
  chainSpecificData?: Record<string, unknown>
  changeTranche: (tranche: TrancheType) => void
}

export function ApproveLenderBase({
  juniorTrancheVault,
  seniorTrancheVault,
  isUniTranche,
  chainType,
  networkType,
  chainSpecificData,
  documentHash,
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
            networkType,
            account!,
            chainId!,
            trancheVault,
            documentHash,
            isDev,
            chainSpecificData,
          )
          tryAttempts = 0
        } catch (e: unknown) {
          if (tryAttempts === 0) {
            throw e
          } else {
            await timeUtil.sleep(3000)
            console.error(e)
          }
        }
      }
    },
    [account, chainId, chainSpecificData, documentHash, isDev, networkType],
  )

  useEffect(() => {
    const approveLenderAsync = async () => {
      if (account && chainId) {
        try {
          if (isUniTranche) {
            await approveLender(juniorTrancheVault)
            changeTranche('junior')
            dispatch(setStep(WIDGET_STEP.ChooseAmount))
          } else {
            await approveLender(juniorTrancheVault)
            await approveLender(seniorTrancheVault)
            dispatch(setStep(WIDGET_STEP.ChooseTranche))
          }
        } catch (e: unknown) {
          console.error(e)
          // @ts-ignore
          let errorMessage = e.message ?? COMMON_ERROR_MESSAGE
          if (
            errorMessage.indexOf(
              SOLANA_TRANSACTION_EXPIRED_BLOCKHEIGHT_EXCEEDED_ERROR,
            ) >= 0
          ) {
            errorMessage = `Transaction failed due to blockchain congestion. Please try again.`
          }
          dispatch(
            setError({
              errorMessage,
            }),
          )
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
