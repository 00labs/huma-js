import { Box, css, Link, useTheme } from '@mui/material'
import React from 'react'

export function Benefit(): React.ReactElement {
  const theme = useTheme()

  const styles = {
    container: css`
      display: flex;
      flex-direction: column;
      margin-top: ${theme.spacing(2)};
    `,
    title: css`
      color: #b8b8b8;
      font-size: 16px;
      font-weight: 700;
      line-height: 175%;
      letter-spacing: 0.15px;
    `,
    list: css`
      margin-top: ${theme.spacing(0)};
      padding-left: ${theme.spacing(2)};
    `,
    listItem: css`
      color: #686868;
      font-size: 14px;
      font-weight: 500;
      line-height: 143%;
      letter-spacing: 0.17px;
    `,
    link: css`
      color: #686868;
      font-size: 14px;
      font-weight: 500;
      line-height: 143%;
      letter-spacing: 0.17px;
    `,
  }

  return (
    <Box css={styles.container}>
      <Box css={styles.title}>Permissionless benefits</Box>
      <ul css={styles.list}>
        <li css={styles.listItem}>Earn more with OG status</li>
        <li css={styles.listItem}>Choose your own investment lockup periods</li>
        <li css={styles.listItem}>Earn incentives for longer commitments</li>
        <li css={styles.listItem}>
          <Link
            href='https://app.huma.finance/faqs'
            target='_blank'
            rel='noopener noreferrer'
            css={styles.link}
          >
            Read more
          </Link>{' '}
          about the Permissionless benefits
        </li>
      </ul>
    </Box>
  )
}
