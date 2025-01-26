/* eslint-disable react/jsx-boolean-value */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from '@mui/material'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import { useAccount } from 'wagmi'
import { CreditLineBorrowWidget } from '..'
import { getInjectedMetamask } from './utils'
import { WalletWrapper } from './WalletWrapper'

function Fixture() {
  const [showModal, setShowModal] = useState(false)
  const [showModalRandom, setShowModalRandom] = useState(false)
  const [testPrivateKeyRandom, setTestPrivateKeyRandom] = useState<string>()
  const [testAccountRandom, setTestAccountRandom] = useState<string>()
  const { isConnected } = useAccount()
  const PoolAddress = '0xA22D20FB0c9980fb96A9B0B5679C061aeAf5dDE4'

  useEffect(() => {
    const wallet = ethers.Wallet.createRandom()
    setTestPrivateKeyRandom(wallet.privateKey)
    setTestAccountRandom(wallet.address)
  }, [])

  const handleBorrow = () => {
    setShowModal(true)
  }

  const handleBorrowRandom = () => {
    // @ts-ignore
    window.ethereum = getInjectedMetamask(testPrivateKeyRandom)
    setShowModalRandom(true)
  }

  const handleApprove = () => {}

  const handleClose = () => {
    setShowModal(false)
    setShowModalRandom(false)
    window.ethereum = undefined
  }

  return (
    <>
      <Box>Pool: {PoolAddress}</Box>
      <Box>Pool Name: HumaCreditLine</Box>
      <Button
        variant='contained'
        onClick={handleBorrow}
        disabled={!isConnected}
      >
        Borrow Without EA Check
      </Button>
      {showModal && (
        <CreditLineBorrowWidget
          poolName='HumaCreditLine'
          poolType='CreditLine'
          handleClose={handleClose}
          handleApprove={handleApprove}
          desiredChainId={5}
        />
      )}
      <Box marginTop={5}>Account: {testAccountRandom}</Box>
      <Box>Pool: {PoolAddress}</Box>
      <Box>Pool Name: HumaCreditLine</Box>
      <Button variant='contained' onClick={handleBorrowRandom}>
        Borrow With EA Check
      </Button>
      {showModalRandom && (
        <CreditLineBorrowWidget
          poolName='HumaCreditLine'
          poolType='CreditLine'
          handleClose={handleClose}
          handleApprove={handleApprove}
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
