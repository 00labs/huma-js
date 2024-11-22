import { Box, Button } from '@mui/material'
import {
  getStellarExplorerUrl,
  openInNewTab,
  StellarChainEnum,
} from '@huma-finance/shared'
import React from 'react'

type Props = {
  chainId: StellarChainEnum
  txHash: string
}

export function StellarViewOnExplorer({
  chainId,
  txHash,
}: Props): React.ReactElement | null {
  const link = getStellarExplorerUrl(chainId, txHash)

  if (!link) {
    return null
  }

  return (
    <Button fullWidth variant='outlined' onClick={() => openInNewTab(link)}>
      <Box component='span'>VIEW ON EXPLORER</Box>
    </Button>
  )
}
