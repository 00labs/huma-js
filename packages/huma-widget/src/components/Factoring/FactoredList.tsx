import { Box, css, LinearProgress, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import {
  AccountStats,
  downScale,
  formatMoney,
  hasRFActiveLoan,
  PoolInfoType,
  timestampToLL,
  useMQ,
  usePoolUnderlyingToken,
} from '@huma-finance/shared'
import React, { useEffect, useState } from 'react'

import { ColumnType } from '../../utilTypes'
import { HumaTable } from '../HumaTable'
import { ReceiptIcon } from '../icons'

type Props<T> = {
  title: 'Streams' | 'Invoices'
  poolInfo: PoolInfoType
  loading: boolean
  accountStats: AccountStats
  handlePayManually: (item: T) => void
  getColumns: (handlePayManually: (item: T) => void) => ColumnType<T>[]
  setItem?: (
    accountStats: AccountStats,
  ) => Promise<{ name?: string; payer?: string }>
}

export function FactoredList<T>({
  title,
  poolInfo,
  loading,
  accountStats,
  handlePayManually,
  getColumns,
  setItem,
}: Props<T>): React.ReactElement {
  const theme = useTheme()
  const { isMdSize } = useMQ()
  const { isActive } = useWeb3React()
  const { decimals } = usePoolUnderlyingToken(
    poolInfo.poolName,
    poolInfo.poolType,
  )
  const [factoredItem, setFactoredItem] = useState<Partial<T>>()
  const { creditRecord, receivableInfo } = accountStats
  const hasActiveLoan = hasRFActiveLoan(creditRecord, receivableInfo)

  useEffect(() => {
    const fetchData = async () => {
      if (creditRecord && receivableInfo?.receivableParam.gt(0) && decimals) {
        const id = receivableInfo.receivableParam.toString()
        const dueDate = timestampToLL(creditRecord.dueDate.toNumber())
        const { receivableAmount } = receivableInfo
        const { totalDue } = creditRecord
        let factoredItem = {
          id,
          due: dueDate,
          icon: <ReceiptIcon css={{ width: '24px' }} />,
          amount: formatMoney(downScale(receivableAmount.toString(), decimals)),
          factored: formatMoney(downScale(totalDue.toString(), decimals)),
          remained: formatMoney(
            downScale(receivableAmount.sub(totalDue).toString(), decimals),
          ),
        } as T
        if (setItem) {
          const customProps = await setItem(accountStats)
          factoredItem = { ...factoredItem, ...customProps }
        }
        setFactoredItem(factoredItem)
      }
    }
    fetchData()
  }, [accountStats, creditRecord, decimals, receivableInfo, setItem])

  const getPadding = () => {
    if (isMdSize) {
      return theme.spacing(0, 1, 1, 1)
    }
    return theme.spacing(0, 2, 2, 2)
  }

  const styles = {
    title: css`
      font-family: 'Uni-Neue-Black';
      color: ${theme.palette.text.primary};
      font-size: 24px;
      margin-bottom: ${theme.spacing(2)};
    `,
    description: css`
      font-family: 'Uni-Neue-Regular';
      color: ${theme.palette.text.primary};
      font-size: 1rem;
    `,
    tableWrapper: css`
      margin-top: ${theme.spacing(3)};
      padding: ${getPadding()};
      background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
      border: 1px solid #ffffff;
      border-radius: 24px;
      position: relative;
    `,
    progress: css`
      width: calc(100% - 30px);
      position: absolute;
      top: 0;
      left: ${theme.spacing(2)};
    `,
  }

  return (
    <Box>
      <Box css={styles.title}>Factored {title}</Box>
      <Box css={styles.description} marginBottom={theme.spacing(6)}>
        {!isActive && (
          <Box component='span'>
            Please connect wallet to check your factored {title.toLowerCase()}.
          </Box>
        )}
        {isActive && !hasActiveLoan && (
          <Box component='span'>
            You don’t have any factored {title.toLowerCase()}.
          </Box>
        )}
        {isActive && hasActiveLoan && factoredItem && (
          <Box css={styles.tableWrapper}>
            {loading && (
              <Box css={styles.progress}>
                <LinearProgress />
              </Box>
            )}
            <HumaTable
              columns={getColumns(handlePayManually)}
              rows={[factoredItem]}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
