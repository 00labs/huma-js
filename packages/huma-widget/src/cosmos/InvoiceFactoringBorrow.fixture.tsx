/* eslint-disable react/jsx-boolean-value */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from '@mui/material'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'

import { InvoiceFactoringBorrowWidget } from '..'
import InvoiceNFTAbi from './abis/InvoiceNFT.json'
import RFPoolAbi from './abis/ReceivableFactoringPool.json'
import { WalletWrapper } from './WalletWrapper'

function Fixture() {
  const [showModal, setShowModal] = useState(false)
  const [tokenId, setTokenId] = useState<string>()
  const [paymentMade, setPaymentMade] = useState<'loading' | 'true' | 'false'>(
    'loading',
  )
  const NFTAddress = '0xC2AC172a293d68f548ea343414584aA37eb29Dcd'
  const PoolAddress = '0x11672c0bBFF498c72BC2200f42461c0414855042'
  const { address } = useAccount()

  useContractRead({
    address: NFTAddress,
    abi: InvoiceNFTAbi,
    functionName: 'getTokenIds',
    args: [address],
    onSuccess(tokenIds: BigNumber[]) {
      if (tokenIds.length) {
        setTokenId(tokenIds[tokenIds.length - 1].toString())
      } else {
        setTokenId('empty')
      }
    },
  })

  useContractRead({
    address: PoolAddress,
    abi: RFPoolAbi,
    functionName: 'creditRecordMapping',
    args: [address],
    onSuccess(creditRecord: any) {
      if (creditRecord.state > 2) {
        setPaymentMade('false')
      } else {
        setPaymentMade('true')
      }
    },
  })

  const handleClose = () => {
    setShowModal(false)
  }

  if (!tokenId || paymentMade === 'loading') {
    return <div>Loading token id and making payment...</div>
  }

  if (tokenId === 'empty') {
    return (
      <>
        <div>Please create invoice first.</div>
        <Button
          type='link'
          variant='contained'
          href={
            import.meta.env.VITE_CREATE_INVOICE_URL ??
            'https://huma-request-apps-create.netlify.app/'
          }
          target='_blank'
        >
          CREATE INVOICE
        </Button>
      </>
    )
  }

  if (paymentMade === 'false') {
    return (
      <div>
        Please go to InvoiceFactoringPayment Fixture to make the payment first.
      </div>
    )
  }

  return (
    <>
      <Box>Pool: {PoolAddress}</Box>
      <Box>NFT: {NFTAddress}</Box>
      <Box>Pool Name: RequestNetwork</Box>
      <Box>Token Id: {tokenId}</Box>
      <Button variant='contained' onClick={() => setShowModal(true)}>
        Get Paid Now
      </Button>
      {showModal && (
        <InvoiceFactoringBorrowWidget
          poolName='RequestNetwork'
          poolType='Invoice'
          tokenId={tokenId}
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
