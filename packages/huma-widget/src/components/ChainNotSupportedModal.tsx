import React from 'react'

import { ErrorModal } from './ErrorModal'
import { HumaModal, HumaModalHeader } from './humaModal'

type Props = {
  handleClose: () => void
  isOpen: boolean
}

export function ChainNotSupportedModal({
  handleClose,
  isOpen,
}: Props): React.ReactElement | null {
  return (
    <HumaModal
      isOpen={isOpen}
      overflowY='auto'
      onClose={handleClose}
      width='480px'
      padding='30px 40px'
      disableBackdropClick
    >
      <HumaModalHeader onClose={handleClose} height={0} />
      <ErrorModal
        title='Network Not Supported'
        errorReason='Please switch to a supported network.'
        handleOk={handleClose}
        okText='Close'
      />
    </HumaModal>
  )
}
