import { css } from '@emotion/react'
import { Alert, Box, Snackbar, useTheme } from '@mui/material'

type Props = {
  open: boolean
  title: string
  message: string
  severity: 'success' | 'info' | 'warning' | 'error'
  autoHideDuration?: number
  onClose: () => void
}

export function HumaSnackBar({
  open,
  autoHideDuration,
  title,
  message,
  severity,
  onClose,
}: Props) {
  const theme = useTheme()

  const styles = {
    snackbar: css`
      margin-top: ${theme.spacing(10)};
    `,
    alert: css`
      max-width: 400px;
      padding: ${theme.spacing(2, 4, 2, 2)};
      border-radius: 16px;
      overflow: hidden;
    `,
    title: css`
      margin-bottom: ${theme.spacing(1)};
      font-size: 16px;
      font-family: 'Uni-Neue-Bold';
    `,
    message: css`
      font-size: 15px;
      font-family: 'Uni-Neue-Regular';
    `,
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration ?? 6000}
      onClose={onClose}
      css={styles.snackbar}
    >
      <Alert
        onClose={onClose}
        title={title}
        severity={severity}
        css={styles.alert}
      >
        <Box css={styles.title}>{title}</Box>
        <Box css={styles.message}>{message}</Box>
      </Alert>
    </Snackbar>
  )
}
