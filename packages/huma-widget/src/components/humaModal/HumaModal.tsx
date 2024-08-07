import { css } from '@emotion/react'
import { Dialog } from '@mui/material'
import { useMQ } from '@huma-finance/web-core'
import React from 'react'

type HumaModalType = {
  children?: React.ReactNode
  isOpen: boolean
  onClose: () => void
  overflow?: string
  overflowY?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto'
  width?: string
  padding?: string
  disableBackdropClick?: boolean
}

export function HumaModal({
  children,
  isOpen,
  onClose,
  overflow,
  overflowY,
  width = '480px',
  padding = '32px',
  disableBackdropClick = false,
}: HumaModalType): React.ReactElement {
  const { isXsSize } = useMQ()

  const styles = {
    wrapper: css`
      max-width: 100vw;
      width: ${isXsSize ? '100%' : width};
      height: auto;
      padding: ${padding};
      box-sizing: border-box;
    `,
  }

  const handleClose = (reason: 'backdropClick' | 'escapeKeyDown') => {
    if (!disableBackdropClick) {
      onClose()
    } else if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose()
    }
  }

  return (
    <Dialog
      disableScrollLock
      maxWidth={false}
      fullScreen={isXsSize}
      open={isOpen}
      PaperProps={{
        style: {
          border: '1px solid #202020',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(50px)',
          borderRadius: '16px',
          overflow: overflow || 'inherit',
          overflowY: overflowY || 'inherit',
        },
      }}
      onClose={(event, reason) => handleClose(reason)}
    >
      <div css={styles.wrapper}>{children}</div>
    </Dialog>
  )
}
