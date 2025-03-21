import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, css, Tooltip, Typography, useTheme } from '@mui/material'
import { txAtom } from '@huma-finance/web-shared'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback } from 'react'

import { openInNewTab } from '@huma-finance/shared'
import { useAppDispatch } from '../hooks/useRedux'
import { resetState } from '../store/widgets.reducers'
import { SorryImg } from './images'

type Props = {
  title: string
  errorReason?: string
  errorMessage?: string
  errorUrl?: string
  handleOk: () => void
  okText?: string
  shouldResetState?: boolean
}

export function ErrorModal({
  title,
  errorReason,
  errorMessage,
  errorUrl,
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
      position: relative;
      margin-top: ${theme.spacing(9)};
      height: 79px;
    `,
    errorIcon: css`
      position: absolute;
      font-size: 20px;
      color: ${theme.palette.error.main};
      margin: ${theme.spacing(0, 2)};
    `,
    messageWrapper: css`
      color: ${theme.palette.text.primary};
      font-weight: 400;
      font-size: 16px;
      padding-left: ${theme.spacing(6)};
    `,
    errorMessage: css`
      margin-top: ${theme.spacing(0.5)};
      font-size: 14px;
      font-weight: 400;
      color: ${theme.palette.text.primary};
      cursor: pointer;
      display: -webkit-box;
      line-height: 16px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: ${theme.spacing(2)};
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
      <Box css={styles.bottomButtonGroup}>
        {errorUrl && (
          <Button
            variant='outlined'
            fullWidth
            onClick={() => openInNewTab(errorUrl)}
          >
            SEE DETAILS
          </Button>
        )}
        <Button variant='contained' fullWidth onClick={handleCloseModal}>
          {okText}
        </Button>
      </Box>
    </Box>
  )
}
