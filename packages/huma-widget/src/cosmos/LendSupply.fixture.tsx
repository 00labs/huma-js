/* eslint-disable react/jsx-boolean-value */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from '@mui/material'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import { LendSupplyWidget } from '..'
import { getInjectedMetamask } from './utils'
import { WalletWrapper } from './WalletWrapper'

function Fixture() {
  const [showModal, setShowModal] = useState(false)
  const [showModalRandom, setShowModalRandom] = useState(false)
  const [testPrivateKeyRandom, setTestPrivateKeyRandom] = useState<string>()
  const [testAccountRandom, setTestAccountRandom] = useState<string>()
  const PoolAddress = '0xA22D20FB0c9980fb96A9B0B5679C061aeAf5dDE4'

  useEffect(() => {
    const wallet = ethers.Wallet.createRandom()
    setTestPrivateKeyRandom(wallet.privateKey)
    setTestAccountRandom(wallet.address)
  }, [])

  const handleSupply = () => {
    setShowModal(true)
  }

  const handleSupplyRandom = () => {
    // @ts-ignore
    window.ethereum = getInjectedMetamask(testPrivateKeyRandom)
    setShowModalRandom(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setShowModalRandom(false)
    window.ethereum = undefined
  }

  return (
    <>
      <Box>Pool: {PoolAddress}</Box>
      <Box>Pool Name: HumaCreditLine</Box>
      <Button variant='contained' onClick={handleSupply}>
        Supply Without EA Check
      </Button>
      {showModal && (
        <LendSupplyWidget
          poolName='HumaCreditLine'
          poolType='CreditLine'
          handleClose={handleClose}
        />
      )}
      <Box marginTop={5}>Account: {testAccountRandom}</Box>
      <Box>Pool: {PoolAddress}</Box>
      <Box>Pool Name: HumaCreditLine</Box>
      <Button variant='contained' onClick={handleSupplyRandom}>
        Supply With EA Check
      </Button>
      {showModalRandom && (
        <LendSupplyWidget
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
