import { Box, Button, css } from '@mui/material'
import React from 'react'

import { WCProps } from '../utilTypes'

type Props = {
  variant: 'contained' | 'outlined'
  disabled?: boolean
  onClick?: () => void
}

export function BottomButton({
  variant,
  disabled = false,
  onClick,
  children,
}: WCProps<Props>): React.ReactElement {
  const styles = css`
    & .MuiButtonBase-root {
      width: 100%;
      position: absolute;
      bottom: 0;
    }
  `

  return (
    <Box css={styles}>
      <Button variant={variant} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
    </Box>
  )
}
