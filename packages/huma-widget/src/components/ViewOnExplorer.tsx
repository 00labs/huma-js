import { Box, Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { getExplorerUrl, openInNewTab } from '@huma-shan/core'
import React from 'react'

type Props = {
  txHash: string
}

export function ViewOnExplorer({ txHash }: Props): React.ReactElement | null {
  const { chainId } = useWeb3React()
  const link = getExplorerUrl(chainId, txHash, 'tx')

  if (!link) {
    return null
  }

  return (
    <Button variant='outlined' onClick={() => openInNewTab(link)}>
      <Box component='span'>VIEW ON EXPLORER</Box>
    </Button>
  )
}
