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
      margin-top: -5px;
    `,
    icon: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: 100px;
      margin-right: 30px;
      & > img {
        width: 170px;
      }
    `,
    content: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: 30px;
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      line-height: 24px;
      color: #49505b;
      margin-bottom: 65px;
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
