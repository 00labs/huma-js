import {
  EAPayload,
  EARejectionError,
  EARejectMessage,
  EARejectReason,
  EAService,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'

import { setApproval, setError } from '../store/widgets.reducers'
import { WIDGET_STEP } from '../store/widgets.store'
import { envUtil } from '../utils/env'
import { useAppDispatch } from './useRedux'

const useEA = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useWeb3React()

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
          dispatch(
            setError({
              errorMessage: e.message,
            }),
          )
        }
      }
    },
    [chainId, dispatch],
  )

  return { checkingEA }
}

export default useEA
