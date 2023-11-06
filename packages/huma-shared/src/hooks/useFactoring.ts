import { css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useState } from 'react'

import { useMQ } from './useMQ'
import { usePoolInfo } from './usePool'
import { useAccountStats } from './usePoolContract'
import { useRefresh } from './useRefresh'
import { hasRFActiveLoan } from '../utils/credit'
import { POOL_NAME, POOL_TYPE } from '../utils/pool'

export function useFactoring<T>(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  getPaidSuccessCallback?: () => void,
) {
  const theme = useTheme()
  const { account, chainId, provider } = useWeb3React()
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const [accountStats, refreshReceivableStats] = useAccountStats(
    poolName,
    poolType,
    chainId,
    account,
    provider,
  )
  const { creditRecord, receivableInfo } = accountStats
  const accountHasActiveLoan = hasRFActiveLoan(creditRecord, receivableInfo)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T>()
  const [actionType, setActionType] = useState<'borrow' | 'payment'>()
  const [subscribe, loading] = useRefresh()
  const { isMdSize, isXsSize } = useMQ()

  const getPadding = useCallback(() => {
    if (isXsSize) {
      return '0 8px 8px 8px'
    }
    if (isMdSize) {
      return '0 32px 32px 32px'
    }
    return '0 90px 90px 90px'
  }, [isMdSize, isXsSize])

  const styles = {
    wrapper: css`
      max-width: 1307px;
      padding: ${getPadding()};
      margin: 0 auto;
    `,
    title: css`
      font-family: 'Uni-Neue-Black';
      color: ${theme.palette.text.primary};
      font-size: 24px;
      margin-bottom: 16px;
    `,
    description: css`
      font-family: 'Uni-Neue-Regular';
      color: ${theme.palette.text.primary};
      font-size: 1rem;
    `,
  }

  const handleGetPaid = useCallback((item: T) => {
    setModalIsOpen(true)
    setSelectedItem(item)
    setActionType('borrow')
  }, [])

  const handleGetPaidSuccess = useCallback(
    (blockNumber?: number) => {
      const callbackFn = () => {
        refreshReceivableStats()
        if (getPaidSuccessCallback) {
          getPaidSuccessCallback()
        }
      }
      if (blockNumber) {
        subscribe(blockNumber, callbackFn)
      } else {
        callbackFn()
      }
    },
    [getPaidSuccessCallback, refreshReceivableStats, subscribe],
  )

  const handlePayManually = useCallback((item: T) => {
    setModalIsOpen(true)
    setSelectedItem(item)
    setActionType('payment')
  }, [])

  const handleClose = useCallback(() => {
    setActionType(undefined)
    setModalIsOpen(false)
  }, [])

  return {
    accountStats,
    accountHasActiveLoan,
    actionType,
    loading,
    poolInfo,
    modalIsOpen,
    selectedItem,
    styles,
    handleGetPaid,
    handleGetPaidSuccess,
    handlePayManually,
    handleClose,
  }
}
