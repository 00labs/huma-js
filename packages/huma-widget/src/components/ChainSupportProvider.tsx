import { supportedChainId } from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

import { WCProps } from '../utilTypes'
import { ErrorModal } from './ErrorModal'
import { HumaModal, HumaModalHeader } from './humaModal'

export function ChainSupportProvider({
  children,
}: WCProps): React.ReactElement | null {
  const { chainId } = useWeb3React()
  const chainSupported = !!supportedChainId(chainId)
  const [chainNotSupportedOpen, setChainNotSupportedOpen] = useState(false)

  useEffect(() => {
    setChainNotSupportedOpen(!chainSupported)
  }, [chainSupported])

  const handleClose = () => {
    setChainNotSupportedOpen(false)
  }

  if (!chainId) {
    return null
  }

  if (chainSupported) {
    return children as React.ReactElement
  }

  return (
    <HumaModal
      isOpen={chainNotSupportedOpen}
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
