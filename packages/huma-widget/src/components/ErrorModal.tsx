import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, css, Tooltip, Typography, useTheme } from '@mui/material'
import { txAtom } from '@huma-finance/shared'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback } from 'react'

import { useAppDispatch } from '../hooks/useRedux'
import { resetState } from '../store/widgets.reducers'
import { SorryImg } from './images'

type Props = {
  title: string
  errorReason?: string
  errorMessage?: string
  handleOk: () => void
  okText?: string
  shouldResetState?: boolean
}

export function ErrorModal({
  title,
  errorReason,
  errorMessage,
  handleOk,
  okText = 'OKAY',
  shouldResetState = true,
}: Props): React.ReactElement {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const reset = useResetAtom(txAtom)

  if (!errorReason) {
    errorReason = 'Oops! Something went wrong'
  }

  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(-0.5)};
    `,
    sorry: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(12)};
      margin-right: ${theme.spacing(4)};
      & > img {
        width: 170px;
      }
    `,
    content: css`
      box-sizing: border-box;
      width: 100%;
      display: inline-table;
      padding: ${theme.spacing(2, 0)};
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.9),
          rgba(255, 255, 255, 0.9)
        ),
        #d32f2f;
      border-radius: 4px;
      position: relative;
      margin-top: ${theme.spacing(9)};
      height: 79px;
    `,
    errorIcon: css`
      position: absolute;
      font-size: 20px;
      color: #d32f2f;
      margin: ${theme.spacing(0, 2)};
    `,
    messageWrapper: css`
      color: #541313;
      font-weight: 400;
      font-size: 16px;
      padding-left: ${theme.spacing(6)};
    `,
    errorMessage: css`
      margin-top: ${theme.spacing(0.5)};
      font-size: 14px;
      font-weight: 400;
      color: #541313;
      cursor: pointer;
      display: -webkit-box;
      line-height: 16px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: ${theme.spacing(2)};
    `,
    okButton: css`
      & .MuiButtonBase-root {
        width: 100%;
        position: absolute;
        bottom: 0;
      }
    `,
  }

  const handleCloseModal = useCallback(() => {
    reset()
    handleOk()
    if (shouldResetState) {
      dispatch(resetState())
    }
  }, [dispatch, handleOk, reset, shouldResetState])

  return (
    <Box css={styles.wrapper}>
      <Typography variant='h6' css={styles.header}>
        {title}
      </Typography>
      <Box css={styles.sorry}>
        <img src={SorryImg} alt='sorry' />
      </Box>
      <Box css={styles.content}>
        <ErrorOutlineIcon css={styles.errorIcon} />
        <Box css={styles.messageWrapper}>
          <Box>{errorReason}</Box>
          <Tooltip title={errorMessage} placement='top'>
            <Box css={styles.errorMessage}>{errorMessage}</Box>
          </Tooltip>
        </Box>
      </Box>
      <Box css={styles.okButton}>
        <Button variant='contained' onClick={handleCloseModal}>
          {okText}
        </Button>
      </Box>
    </Box>
  )
}
