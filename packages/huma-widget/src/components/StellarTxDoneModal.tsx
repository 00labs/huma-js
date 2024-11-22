import { Box, Button, css, Typography, useTheme } from '@mui/material'
import React, { useCallback } from 'react'

import { StellarChainEnum } from '@huma-finance/shared'
import { useAppDispatch } from '../hooks/useRedux'
import { resetState } from '../store/widgets.reducers'
import { CheckIcon } from './icons'
import { StellarViewOnExplorer } from './StellarViewOnExplorer'

type Props = {
  chainId: StellarChainEnum
  content: string[]
  subContent?: string[]
  buttonText?: string
  txHash?: string
  handleAction: () => void
}

export function StellarTxDoneModal({
  chainId,
  content,
  subContent,
  txHash,
  buttonText,
  handleAction,
}: Props): React.ReactElement {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(-0.5)};
    `,
    content: css`
      ${theme.cssMixins.colVCentered};
      font-weight: ${subContent ? 700 : 400};
      font-size: 18px;
      color: ${theme.palette.text.secondary};
      margin-top: ${theme.spacing(8)};
      text-align: center;
    `,
    subContent: css`
      ${theme.cssMixins.colVCentered};
      font-weight: 400;
      font-size: 18px;
      color: ${theme.palette.text.primary};
      margin-top: ${theme.spacing(2)};
      text-align: center;
    `,
    check: css`
      width: 100%;
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(10)};
    `,
    bottomButtonGroup: css`
      width: 100%;
      position: absolute;
      bottom: 0;
      display: flex;
      row-gap: ${theme.spacing(1)};
      column-gap: ${theme.spacing(1)};

      button {
        height: 40px;
        margin-top: ${theme.spacing(1)};
      }
    `,
  }

  const handleCloseModal = useCallback(() => {
    dispatch(resetState())
    handleAction()
  }, [dispatch, handleAction])

  return (
    <Box css={styles.wrapper}>
      <Typography variant='h6' css={styles.header}>
        Transaction Completed
      </Typography>
      <Box css={styles.check}>
        <CheckIcon />
      </Box>
      <Box css={styles.content}>
        {content.map((item) => (
          <Box sx={{ marginTop: theme.spacing(1) }} key={item}>
            {item}
          </Box>
        ))}
      </Box>
      {subContent && (
        <Box css={styles.subContent}>
          {subContent.map((item) => (
            <Box sx={{ marginTop: theme.spacing(1) }} key={item}>
              {item}
            </Box>
          ))}
        </Box>
      )}
      <Box css={styles.bottomButtonGroup}>
        {txHash && chainId && (
          <StellarViewOnExplorer chainId={chainId} txHash={txHash} />
        )}
        <Button
          className='transaction-done-modal-close-btn'
          variant='contained'
          fullWidth
          onClick={handleCloseModal}
        >
          {!buttonText ? 'DONE' : buttonText}
        </Button>
      </Box>
    </Box>
  )
}
