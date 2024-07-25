import { Box, css, Typography, useTheme } from '@mui/material'
import React from 'react'
import { ApproveLenderImg } from './images'

export function SignIn(): React.ReactElement {
  const theme = useTheme()
  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(-0.5)};
    `,
    icon: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(12)};
      margin-right: ${theme.spacing(4)};
      & > img {
        width: 170px;
      }
    `,
    content: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(4)};
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: ${theme.palette.text.secondary};
      margin-bottom: ${theme.spacing(8)};
    `,
  }

  return (
    <Box css={styles.wrapper}>
      <Typography variant='h6' css={styles.header}>
        Sign In
      </Typography>
      <Box css={styles.icon}>
        <img src={ApproveLenderImg} alt='approve-lender' />
      </Box>
      <Box css={styles.content}>
        Please sign in to verify your ownership of the wallet.
      </Box>
    </Box>
  )
}
