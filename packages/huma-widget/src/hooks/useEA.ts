import {
  EAPayload,
  EARejectionError,
  EARejectMessage,
  EARejectReason,
  EAService,
  useAuthErrorHandling,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect } from 'react'

import { setApproval, setError, setStep } from '../store/widgets.reducers'
import { WIDGET_STEP } from '../store/widgets.store'
import { envUtil } from '../utils/env'
import { useAppDispatch } from './useRedux'

const useEA = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useWeb3React()
  const { isWalletOwnershipVerified, setError: setAuthError } =
    useAuthErrorHandling()

  const checkingEA = useCallback(
    async (payload: EAPayload, nextStep: WIDGET_STEP) => {
      try {
        const result = await EAService.approve(
          payload,
          chainId!,
          envUtil.checkIsDev(),
        )
        dispatch(setApproval({ ...result, nextStep }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e instanceof EARejectionError) {
          dispatch(
            setError({
              errorMessage: EARejectMessage,
              errorReason: EARejectReason,
            }),
          )
        } else {
          try {
            setAuthError(e)
            dispatch(setStep(WIDGET_STEP.SignIn))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            dispatch(
              setError({
                errorMessage: e.message,
              }),
            )
          }
        }
      }
    },
    [chainId, dispatch, setAuthError],
  )

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.Evaluation))
  }, [isWalletOwnershipVerified, dispatch])

  return { checkingEA }
}

export default useEA
