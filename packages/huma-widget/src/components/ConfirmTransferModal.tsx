import { combineStyles } from '@huma-finance/shared'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, Button, css, Typography, useTheme } from '@mui/material'
import React from 'react'

import { ReceiptIcon, UsdcIcon } from './icons'

type Props = {
  title: string
  description: string
  items: [
    { leftText: string; rightText: string },
    { leftText: string; rightText: string },
  ]
  actionText: string
  handleAction: () => void
}

export function ConfirmTransferModal({
  title,
  description,
  items,
  actionText,
  handleAction,
}: Props): React.ReactElement | null {
  const theme = useTheme()

  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
      ${theme.cssMixins.colStretch};
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(-0.5)};
    `,
    description: css`
      font-weight: 400;
      font-size: 16px;
      color: ${theme.palette.text.secondary};
      margin-top: ${theme.spacing(4)};
      text-align: center;
    `,
    transferWrapper: css`
      margin-top: ${theme.spacing(9)};
    `,
    transfer: css`
      font-weight: 400;
      ${theme.cssMixins.rowSpaceBetweened}
      ${theme.cssMixins.rowVCentered}
      height: 72px;
      background: #f9f8fa;
      border-radius: 4px;
      font-size: 16px;
      color: ${theme.palette.text.primary};
      padding: ${theme.spacing(3, 2)};
      margin-bottom: ${theme.spacing(1)};
      position: relative;
      box-sizing: border-box;
    `,
    transferItem: css`
      ${theme.cssMixins.rowVCentered}
    `,
    arrow: css`
      @keyframes bounceAlpha {
        0% {
          opacity: 1;
          transform: translateX(0px) scale(1);
        }
        25% {
          opacity: 0;
          transform: translateX(10px) scale(0.9);
        }
        26% {
          opacity: 0;
          transform: translateX(-10px) scale(0.9);
        }
        55% {
          opacity: 1;
          transform: translateX(0px) scale(1);
        }
      }
      animation-name: bounceAlpha;
      animation-duration: 1.4s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;

      color: #b246ff;
      position: absolute;
      margin: auto;
      top: 0;
      left: calc(15% + 36px);
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
    `,
    arrowFirst: css`
      left: calc(15% + 20px);
      animation-delay: 0.2s;
    `,
    okButton: css`
      width: 100%;
      position: absolute;
      bottom: 0;
    `,
    usdcIcon: css`
      width: 22px;
      margin-right: ${theme.spacing(2)};
      & > path:first-of-type {
        fill: #76707e;
      }
    `,
  }

  return (
    <Box css={styles.wrapper}>
      <Typography variant='h6' css={styles.header}>
        {title}
      </Typography>
      <Box css={styles.description}>{description}</Box>
      <Box css={styles.transferWrapper}>
        <Box css={styles.transfer}>
          <Box css={styles.transferItem}>
            <ReceiptIcon
              css={{ width: '24px', marginRight: theme.spacing(2) }}
            />
            {items[0].leftText}
          </Box>
          <ArrowForwardIosIcon
            css={combineStyles([styles.arrow, styles.arrowFirst])}
          />
          <ArrowForwardIosIcon css={styles.arrow} />
          <Box>{items[0].rightText}</Box>
        </Box>
        <Box css={styles.transfer}>
          <Box css={styles.transferItem}>
            <UsdcIcon css={styles.usdcIcon} />
            {items[1].leftText}
          </Box>
          <ArrowForwardIosIcon
            css={combineStyles([styles.arrow, styles.arrowFirst])}
          />
          <ArrowForwardIosIcon css={styles.arrow} />
          <Box>{items[1].rightText}</Box>
        </Box>
      </Box>
      <Button variant='contained' css={styles.okButton} onClick={handleAction}>
        {actionText}
      </Button>
    </Box>
  )
}
