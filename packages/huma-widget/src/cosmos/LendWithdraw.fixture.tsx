/* eslint-disable react/jsx-boolean-value */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from '@mui/material'
import { useState } from 'react'

import { LendWithdrawWidget } from '..'
import { WalletWrapper } from './WalletWrapper'

function Fixture() {
  const [showModal, setShowModal] = useState(false)
  const PoolAddress = '0xA22D20FB0c9980fb96A9B0B5679C061aeAf5dDE4'

  const handleSupply = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <Box>Pool: {PoolAddress}</Box>
      <Box>Pool Name: HumaCreditLine</Box>
      <Button variant='contained' onClick={handleSupply}>
        Withdraw
      </Button>
      {showModal && (
        <LendWithdrawWidget
          poolName='HumaCreditLine'
          poolType='CreditLine'
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
