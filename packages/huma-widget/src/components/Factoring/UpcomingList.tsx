import { Box, css, LinearProgress, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useMQ } from '@huma-finance/shared'
import React from 'react'

import { ColumnType, WCProps } from '../../utilTypes'
import { HumaTable } from '../HumaTable'

type Props<T> = {
  items: T[] | undefined
  loading: boolean
  columns: ColumnType<T>[]
  title: string
  connectWalletDesc: string
  noItemDesc: string
}

export function UpcomingList<T>({
  items,
  loading,
  columns,
  title,
  connectWalletDesc,
  noItemDesc,
  children,
}: WCProps<Props<T>>): React.ReactElement {
  const theme = useTheme()
  const { isActive } = useWeb3React()
  const { isMdSize, isSmSize } = useMQ()

  const getPadding = () => {
    if (isMdSize) {
      return '0 8px 8px 8px'
    }
    return '0 16px 16px 16px'
  }

  const styles = {
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
    tableWrapper: css`
      margin-top: 24px;
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
      left: 15px;
    `,
  }

  return (
    <Box>
      <Box css={styles.title}>{title}</Box>
      <Box css={styles.description} marginBottom='47px'>
        {!isActive && <Box component='span'>{connectWalletDesc}</Box>}
        {isActive && !items?.length && <Box>{noItemDesc}</Box>}
        {isActive && !!items?.length && (
          <Box css={styles.tableWrapper}>
            {loading && (
              <Box css={styles.progress}>
                <LinearProgress />
              </Box>
            )}
            <HumaTable
              columns={columns}
              rows={items}
              hideRowsPerPage={isSmSize}
            />
          </Box>
        )}
        {children}
      </Box>
    </Box>
  )
}
