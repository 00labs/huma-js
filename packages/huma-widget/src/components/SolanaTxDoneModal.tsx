import { Box, Button, css, Typography, useTheme } from '@mui/material'
import React, { useCallback } from 'react'

import { SolanaChainEnum } from '@huma-finance/shared'
import { useAppDispatch } from '../hooks/useRedux'
import { resetState } from '../store/widgets.reducers'
import { CheckIcon } from './icons'
import { SolanaViewOnExplorer } from './SolanaViewOnExplorer'

type Props = {
  content: string[]
  subContent?: string[]
  buttonText?: string
  solanaSignature?: string
  chainId?: SolanaChainEnum
  handleAction: () => void
}

export function SolanaTxDoneModal({
  content,
  subContent,
  handleAction,
  solanaSignature,
  chainId,
  buttonText,
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
    `,
    bottomButton: css`
      margin-top: ${theme.spacing(1)};
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
        {solanaSignature && chainId && (
          <SolanaViewOnExplorer signature={solanaSignature} chainId={chainId} />
        )}
        <Button
          className='transaction-done-modal-close-btn'
          variant='contained'
          fullWidth
          css={styles.bottomButton}
          onClick={handleCloseModal}
        >
          {!buttonText ? 'DONE' : buttonText}
        </Button>
      </Box>
    </Box>
  )
}
