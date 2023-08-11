/* eslint-disable react/jsx-boolean-value */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from '@mui/material'
import { useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'

import { InvoiceFactoringPaymentWidget } from '..'
import RFPoolAbi from './abis/ReceivableFactoringPool.json'
import { WalletWrapper } from './WalletWrapper'

function Fixture() {
  const [showModal, setShowModal] = useState(false)
  const [isInDebt, setIsInDebt] = useState(false)
  const { address } = useAccount()
  const PoolAddress = '0x11672c0bBFF498c72BC2200f42461c0414855042'

  useContractRead({
    address: PoolAddress,
    abi: RFPoolAbi,
    functionName: 'creditRecordMapping',
    args: [address],
    onSuccess(creditRecord: any) {
      if (creditRecord.state > 2) {
        setIsInDebt(true)
      }
    },
  })

  const handleClose = () => {
    setShowModal(false)
  }

  if (!isInDebt) {
    return (
      <>
        <Box>Pool: {PoolAddress}</Box>
        <Box>Pool Name: RequestNetwork</Box>
        <Button variant='contained' disabled>
          Not in state to make payment
        </Button>
      </>
    )
  }

  return (
    <>
      <Box>Pool: {PoolAddress}</Box>
      <Box>Pool Name: RequestNetwork</Box>
      <Button variant='contained' onClick={() => setShowModal(true)}>
        Make Payment
      </Button>
      {showModal && (
        <InvoiceFactoringPaymentWidget
          poolName='RequestNetwork'
          poolType='Invoice'
          handleClose={handleClose}
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
