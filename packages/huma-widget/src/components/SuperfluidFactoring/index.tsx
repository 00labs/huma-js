import { Box, useTheme } from '@mui/material'
import { POOL_NAME, POOL_TYPE, PoolMap } from '@huma-finance/shared'
import { useFactoring } from '@huma-finance/web-shared'
import React from 'react'

import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { StreamFactoringBorrow } from '../StreamFactoring/borrow'

export type StreamItem = {
  id: string
  icon: EmotionJSX.Element
  token: string
  tokenId: string
  payer: string
  flowrate: string
  flowrateMonth: string
}

export function SuperfluidFactoring(): React.ReactElement {
  const theme = useTheme()
  const poolName = POOL_NAME.Superfluid
  const {
    actionType,
    poolInfo,
    modalIsOpen,
    selectedItem,
    styles,
    handleGetPaidSuccess,
    handleClose,
  } = useFactoring<StreamItem>(poolName, POOL_TYPE.Stream)

  return (
    <Box css={styles.wrapper}>
      <Box css={styles.title}>Stream Factoring</Box>
      <Box css={styles.description} marginBottom={theme.spacing(6)}>
        {PoolMap.Stream[poolName]?.borrowDesc}
      </Box>
      {poolInfo && selectedItem && actionType === 'borrow' && (
        <StreamFactoringBorrow
          poolName={POOL_NAME.Superfluid}
          poolType={POOL_TYPE.Stream}
          payerAddress={selectedItem.payer}
          superToken={selectedItem.tokenId}
          currentFlowRate={selectedItem.flowrate}
          isOpen={modalIsOpen}
          handleClose={handleClose}
          handleSuccess={handleGetPaidSuccess}
        />
      )}
    </Box>
  )
}
