import { Box, Button, css, Typography, useTheme } from '@mui/material'
import { txAtom } from '@huma-finance/shared'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback } from 'react'

import { useAppDispatch } from '../hooks/useRedux'
import { resetState } from '../store/widgets.reducers'
import { CheckIcon } from './icons'

type Props = {
  content: string[]
  handleAction: () => void
  buttonText?: string
}

export function TxDoneModal({
  content,
  handleAction,
  buttonText,
}: Props): React.ReactElement {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const reset = useResetAtom(txAtom)

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
      font-family: 'Uni-Neue-Regular';
      font-size: 18px;
      color: #423b46;
      margin-top: ${theme.spacing(8)};
      text-align: center;
    `,
    check: css`
      width: 100%;
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(10)};
    `,
    doneButton: css`
      width: 100%;
      position: absolute;
      bottom: 0;
    `,
  }

  const handleCloseModal = useCallback(() => {
    reset()
    dispatch(resetState())
    handleAction()
  }, [dispatch, handleAction, reset])

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
      <Button
        className='transaction-done-modal-close-btn'
        variant='contained'
        css={styles.doneButton}
        onClick={handleCloseModal}
      >
        {!buttonText ? 'DONE' : buttonText}
      </Button>
    </Box>
  )
}
