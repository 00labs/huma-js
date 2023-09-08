import { POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { WalletWrapper } from './WalletWrapper'
import { initEnv } from './utils/env'
import { RequestNetworkInvoiceFactoringBorrowWidget } from '..'

initEnv()

function Fixture() {
  const poolName = POOL_NAME.RequestNetwork
  const poolType = POOL_TYPE.Invoice
  const [showModal, setShowModal] = useState(false)
  const [requestId, setRequestId] = useState(
    '01a84260baadbf9a46ea205d485b1a773f863c7531d19b6dd1d5073d82a5c414b7',
  )

  const handleClick = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <Box>Pool: {poolName}</Box>
      <Box>Pool Type: {poolType}</Box>
      <input
        type='text'
        value={requestId}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(event: any) => {
          setRequestId(event.target.value)
        }}
      />
      <Button variant='contained' onClick={handleClick}>
        Borrow
      </Button>
      {showModal && (
        <RequestNetworkInvoiceFactoringBorrowWidget
          poolName={poolName}
          poolType={poolType}
          requestId={requestId}
          handleClose={() => {
            handleClose()
          }}
          handleSuccess={() => {
            alert('Success')
          }}
          provider={new JsonRpcProvider()}
        />
      )}
    </>
  )
}

export default (
  <WalletWrapper>
    <Fixture />
  </WalletWrapper>
)
