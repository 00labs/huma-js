import { Box, css, LinearProgress, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useMQ } from '@huma-finance/web-shared'
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
      return theme.spacing(0, 1, 1, 1)
    }
    return theme.spacing(0, 2, 2, 2)
  }

  const styles = {
    title: css`
      font-weight: 800;
      color: ${theme.palette.text.primary};
      font-size: 24px;
      margin-bottom: ${theme.spacing(2)};
    `,
    description: css`
      font-weight: 400;
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
      <Box css={styles.title}>{title}</Box>
      <Box css={styles.description} marginBottom={theme.spacing(6)}>
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
