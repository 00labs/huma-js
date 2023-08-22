import React from 'react'
import { Box, css, Typography, useTheme } from '@mui/material'

export function SignIn(): React.ReactElement {
  const theme = useTheme()
  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: -5px;
    `,
    content: css`
      ${theme.cssMixins.colVCentered};
      font-family: 'Uni-Neue-Regular';
      font-size: 18px;
      color: #423b46;
      margin-top: 64px;
      text-align: center;
    `,
  }

  return (
    <Box css={styles.wrapper}>
      <Typography variant='h6' css={styles.header}>
        Sign In
      </Typography>
      <Box css={styles.content}>
        Please sign in to verify that you are the owner of the wallet.
      </Box>
    </Box>
  )
}
