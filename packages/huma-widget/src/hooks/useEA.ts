import axios from 'axios'
import {
  EAPayload,
  EARejectionError,
  EARejectMessage,
  EARejectReason,
  EAService,
  useAuthErrorHandling,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'

import { setApproval, setError } from '../store/widgets.reducers'
import { WIDGET_STEP } from '../store/widgets.store'
import { envUtil } from '../utils/env'
import { useAppDispatch } from './useRedux'

const useEA = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React()
  const { isWalletOwnershipVerified, setError: setAuthError } =
    useAuthErrorHandling(account, chainId, envUtil.checkIsDev())

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
            console.log(`underwrite returned error`)
            if (axios.isAxiosError(e)) {
              console.log(e.response?.data)
            } else {
              console.log('Not axios error', e)
            }
            console.log('Finished logging')
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

  return { checkingEA, isWalletOwnershipVerified }
}

export default useEA
