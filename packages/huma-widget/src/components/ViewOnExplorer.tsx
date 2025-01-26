import { Box } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { getExplorerUrl, openInNewTab } from '@huma-finance/shared'
import React from 'react'
import { BottomButton } from './BottomButton'

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
    <BottomButton variant='contained' onClick={() => openInNewTab(link)}>
      <Box component='span'>VIEW ON EXPLORER</Box>
    </BottomButton>
  )
}
