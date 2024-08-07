import {
  checkIsDev,
  EAPayload,
  EARejectionError,
  EARejectMessage,
  EARejectReason,
  EAService,
} from '@huma-finance/core'
import { useAuthErrorHandling } from '@huma-finance/web-core'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'

import { setApproval, setError } from '../store/widgets.reducers'
import { WIDGET_STEP } from '../store/widgets.store'
import { useAppDispatch } from './useRedux'

const useEA = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useWeb3React()
  const {
    isWalletOwnershipVerificationRequired,
    isWalletOwnershipVerified,
    setError: setAuthError,
  } = useAuthErrorHandling(checkIsDev())

  const checkingEA = useCallback(
    async (payload: EAPayload, nextStep: WIDGET_STEP) => {
      try {
        const result = await EAService.approve(payload, chainId!, checkIsDev())
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

  return {
    checkingEA,
    isWalletOwnershipVerificationRequired,
    isWalletOwnershipVerified,
  }
}

export default useEA
