import { Box, Button } from '@mui/material'
import {
  getSolanaExplorerUrl,
  openInNewTab,
  SolanaChainEnum,
} from '@huma-finance/shared'
import React from 'react'

type Props = {
  chainId: SolanaChainEnum
  signature: string
}

export function SolanaViewOnExplorer({
  chainId,
  signature,
}: Props): React.ReactElement | null {
  const link = getSolanaExplorerUrl(chainId, signature, 'tx')

  if (!link) {
    return null
  }

  return (
    <Button fullWidth variant='contained' onClick={() => openInNewTab(link)}>
      <Box component='span'>VIEW ON EXPLORER</Box>
    </Button>
  )
}
