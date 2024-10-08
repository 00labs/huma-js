import { Box, css, Typography, useTheme } from '@mui/material'
import React from 'react'

type Props = {
  title: string
  subTitle?: string | React.ReactNode
  children: React.ReactNode
}

export function WrapperModal({
  title,
  subTitle,
  children,
}: Props): React.ReactElement {
  const theme = useTheme()

  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      font-weight: 700;
      font-size: 20px;
      margin-top: ${theme.spacing(-0.5)};
    `,
    content: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(4)};
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: ${theme.palette.text.secondary};
    `,
    bottom: css`
      & .MuiButtonBase-root {
        width: 100%;
        position: absolute;
        bottom: 0;
      }
    `,
  }

  return (
    <Box css={styles.wrapper}>
      <Typography variant='h6' css={styles.header}>
        {title}
      </Typography>
      {subTitle && <Box css={styles.content}>{subTitle}</Box>}
      {children}
    </Box>
  )
}
