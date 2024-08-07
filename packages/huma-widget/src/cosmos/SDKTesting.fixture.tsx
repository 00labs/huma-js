/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import {
  EAService,
  useCreditRecordDetails,
  usePoolContract,
  ARWeaveService,
  ReceivableService,
} from '@huma-finance/sdk'
import { POOL_NAME, POOL_TYPE } from '@huma-finance/core'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'

import { WalletWrapper } from './WalletWrapper'

const TEST_PRIVATE_KEY = 'REPLACE_WITH_YOUR_PRIVATE_KEY'
const INFURA_PROVIDER_KEY = 'REPLACE_WITH_YOUR_INFURA_PROVIDER_KEY'

function Fixture() {
  const { address, connector } = useAccount()
  const [chainId, setChainId] = useState(0)
  const [signer, setSigner] = useState<Web3Provider | null>(null)

  // useCreditRecordDetails
  const [userAddress, setUserAddress] = useState('')
  const [poolName, setPoolName] = useState<POOL_NAME>(POOL_NAME.HumaCreditLine)
  const [poolType, setPoolType] = useState<POOL_TYPE>(POOL_TYPE.CreditLine)
  const provider = new JsonRpcProvider(
    `https://goerli.infura.io/v3/${INFURA_PROVIDER_KEY}`,
    {
      name: 'goerli',
      chainId: 5,
    },
  )
  const [creditRecordDetails, refreshCreditRecordDetails] =
    useCreditRecordDetails(userAddress, provider, chainId, poolName, poolType)

  // mintReceivableWithMetadata
  const [recipientAddress, setRecipientAddress] = useState(address)
  const [receivableAmount, setReceivableAmount] = useState(100)
  const [maturityDate, setMaturityDate] = useState(Date.now())
  const [metadata, setMetadata] = useState(JSON.stringify({ exampleKey: 1 }))
  // Used to set an example tag on the metadata uploaded to ARweave which we can use to query by later
  const [referenceId, setReferenceId] = useState('3')
  const [mintResult, setMintResult] = useState<any>('')

  // usePoolContract
  const poolContract = usePoolContract(
    signer!,
    chainId,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine,
  )

  // EAService.approve
  const [borrowerAddress, setBorrowerAddress] = useState('')
  const [receivableAddress, setReceivableAddress] = useState(
    '0xC2AC172a293d68f548ea343414584aA37eb29Dcd',
  )
  const [receivableParam, setReceivableParam] = useState('')
  const [approveResult, setApproveResult] = useState<any>('')

  const [queryResult, setQueryResult] = useState<any>('')

  useEffect(() => {
    ;(async () => {
      if (address && connector && window.ethereum) {
        setChainId(await connector.getChainId())
        setRecipientAddress(address)
        // @ts-ignore
        const tmp = new ethers.providers.Web3Provider(window.ethereum)
        setSigner(tmp)
      }
    })()
  }, [address, connector])

  const handleRefreshCreditRecordDetailsSubmit = (event: any) => {
    event.preventDefault()
    refreshCreditRecordDetails()
  }

  const handleEAApproveSubmit = async (event: any) => {
    event.preventDefault()
    try {
      const data = await EAService.approve(
        {
          poolAddress: poolContract!.address,
          borrowerWalletAddress: borrowerAddress,
          context: {
            receivable: { address: receivableAddress, param: receivableParam },
          },
        },
        5,
      )
      setApproveResult('Success')
      console.log(data)
    } catch (error) {
      setApproveResult('Failed')
      console.log(error)
    }
  }

  const handleMintReceivableWithMetadataSubmit = async (event: any) => {
    event.preventDefault()

    if (signer === null) return

    try {
      const data = await ReceivableService.createReceivableWithMetadata(
        signer,
        TEST_PRIVATE_KEY!,
        chainId,
        poolName,
        poolType,
        840, // currency code for USD
        receivableAmount,
        maturityDate,
        JSON.parse(metadata),
        referenceId,
        [],
      )
      const txResult = await data.wait()
      setMintResult(`Success, Tx Hash: ${txResult.transactionHash}`)
      console.log(data)
    } catch (error) {
      setMintResult(`Failed, check console for errors`)
      console.log(error)
    }
  }

  const queryARWeaveSubmit = async (event: any) => {
    event.preventDefault()

    if (address == null) return

    try {
      const data = await ARWeaveService.queryForMetadata(
        chainId,
        address,
        referenceId,
      )
      setQueryResult(data)
      console.log(data)
    } catch (error) {
      setQueryResult(`Failed, check console for errors`)
      console.log(error)
    }
  }

  const [prefundAmt, setPrefundAmt] = useState<number>(0)
  const [prefundResult, setPrefundResult] = useState<string>('')
  const prefundARWeaveSubmit = async (event: any) => {
    event.preventDefault()

    try {
      const data = await ARWeaveService.prefundBundlr(
        ARWeaveService.getBundlrNetworkConfig(5),
        TEST_PRIVATE_KEY,
        prefundAmt,
      )
      setPrefundResult('Success')
      console.log(data)
    } catch (error) {
      setPrefundResult(`Failed, check console for errors`)
      console.log(error)
    }
  }

  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentResult, setPaymentResult] = useState<string>('')
  const declarePaymentSubmit = async (event: any) => {
    event.preventDefault()

    try {
      const data =
        await ReceivableService.declareReceivablePaymentByReferenceId(
          signer?.getSigner()!,
          referenceId,
          paymentAmount,
        )
      const txResult = await data.wait()
      setPaymentResult(`Success, Tx Hash: ${txResult.transactionHash}`)
      console.log(data)
    } catch (error) {
      setPaymentResult(`Failed, check console for errors`)
      console.log(error)
    }
  }

  return (
    <div
      style={{
        fontFamily: 'Helvetica',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      <div
        style={{
          border: '1px solid gray',
          padding: '0px 10px 20px 10px',
          borderRadius: '10px',
        }}
      >
        <h3>Example 1. React hooks to get credit loan details</h3>
        <form
          onSubmit={handleRefreshCreditRecordDetailsSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
        >
          <label>
            Network: <input disabled type='text' defaultValue='Goerli' />
          </label>
          <br />
          <label>
            User Address:
            <input
              type='text'
              value={userAddress}
              onChange={(event: any) => {
                setUserAddress(event.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Pool Name:
            <select
              name='pool_name'
              value={poolName}
              onChange={(event: any) => {
                setPoolName(event.target.value)
              }}
            >
              <option value='RequestNetwork'>RequestNetwork</option>
              <option value='HumaCreditLine'>HumaCreditLine</option>
              <option value='Superfluid'>Superfluid</option>
              <option value='Jia'>Jia</option>
            </select>
          </label>
          <br />
          <label>
            Pool Type:
            <select
              name='pool_type'
              value={poolType}
              onChange={(event: any) => {
                setPoolType(event.target.value)
              }}
            >
              <option value='Invoice'>Invoice</option>
              <option value='CreditLine'>CreditLine</option>
              <option value='Stream'>Stream</option>
            </select>
          </label>
          <br />
          <button type='submit' style={{ width: 'fit-content' }}>
            Get Credit Record Details
          </button>
        </form>
        {creditRecordDetails && (
          <div>
            <h2>Credit Record Details:</h2>
            <ul>aprInBps: {creditRecordDetails.aprInBps}</ul>
            <ul>correction: {creditRecordDetails.correction.toString()}</ul>
            <ul>creditLimit: {creditRecordDetails.creditLimit.toString()}</ul>
            <ul>
              defaultAmount: {creditRecordDetails.defaultAmount.toString()}
            </ul>
            <ul>dueDate: {creditRecordDetails.dueDate.toString()}</ul>
            <ul>
              feesAndInterestDue:{' '}
              {creditRecordDetails.feesAndInterestDue.toString()}
            </ul>
            <ul>intervalInDays: {creditRecordDetails.intervalInDays}</ul>
            <ul>missedPeriods: {creditRecordDetails.missedPeriods}</ul>
            <ul>remainingPeriods: {creditRecordDetails.remainingPeriods}</ul>
            <ul>state: {creditRecordDetails.state}</ul>
            <ul>totalDue: {creditRecordDetails.totalDue.toString()}</ul>
            <ul>
              unbilledPrincipal:{' '}
              {creditRecordDetails.unbilledPrincipal.toString()}
            </ul>
          </div>
        )}
      </div>
      <div
        style={{
          border: '1px solid gray',
          padding: '0px 10px 20px 10px',
          borderRadius: '10px',
        }}
      >
        <h3>Example 2. React hooks to get ethers.js contract instances</h3>
        {poolContract?.address}
      </div>
      <div
        style={{
          border: '1px solid gray',
          padding: '0px 10px 20px 10px',
          borderRadius: '10px',
        }}
      >
        <form
          onSubmit={handleEAApproveSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
        >
          <h3>Test EAService.approve</h3>
          <label>
            Borrower Address:
            <input
              type='text'
              value={borrowerAddress}
              onChange={(event: any) => {
                setBorrowerAddress(event.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Receivable Address:
            <input
              type='text'
              value={receivableAddress}
              onChange={(event: any) => {
                setReceivableAddress(event.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Receivable Parameter (Token ID):
            <input
              type='text'
              value={receivableParam}
              onChange={(event: any) => {
                setReceivableParam(event.target.value)
              }}
            />
          </label>
          <br />
          <button type='submit' style={{ width: 'fit-content' }}>
            Get Credit Record Details
          </button>
        </form>
        {approveResult}
      </div>
      <div
        style={{
          border: '1px solid gray',
          padding: '0px 10px 20px 10px',
          borderRadius: '10px',
        }}
      >
        <form
          onSubmit={handleMintReceivableWithMetadataSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
        >
          <h3>
            Example 3. Create RealWorldReceivable token with metadata on ARWeave
          </h3>
          <label>
            Recipient Address:
            <input
              type='text'
              value={recipientAddress}
              onChange={(event: any) => {
                setRecipientAddress(event.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Pool Name:
            <select
              name='pool_name'
              value={poolName}
              onChange={(event: any) => {
                setPoolName(event.target.value)
              }}
            >
              <option value='RequestNetwork'>RequestNetwork</option>
              <option value='HumaCreditLine'>HumaCreditLine</option>
              <option value='Superfluid'>Superfluid</option>
              <option value='Jia'>Jia</option>
            </select>
          </label>
          <br />
          <label>
            Pool Type:
            <select
              name='pool_type'
              value={poolType}
              onChange={(event: any) => {
                setPoolType(event.target.value)
              }}
            >
              <option value='Invoice'>Invoice</option>
              <option value='CreditLine'>CreditLine</option>
              <option value='Stream'>Stream</option>
            </select>
          </label>
          <br />
          <label>
            Receivable Amount:
            <input
              type='text'
              value={receivableAmount}
              onChange={(event: any) => {
                setReceivableAmount(event.target.value)
              }}
            />
          </label>
          <label>
            Maturity Date:
            <input
              type='text'
              value={maturityDate}
              onChange={(event: any) => {
                setMaturityDate(event.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Metadata:
            <input
              type='text'
              value={metadata}
              onChange={(event: any) => {
                setMetadata(event.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Reference ID (For querying through ARWeave):
            <input
              type='text'
              value={referenceId}
              onChange={(event: any) => {
                setReferenceId(event.target.value)
              }}
            />
          </label>
          <button type='submit' style={{ width: 'fit-content' }}>
            Create Receivable With Metadata
          </button>
          <br />
          {mintResult}
        </form>
        {approveResult}
      </div>
      <div
        style={{
          border: '1px solid gray',
          padding: '0px 10px 20px 10px',
          borderRadius: '10px',
        }}
      >
        <h3>Example 4. Query for metadata on ARWeave</h3>
        <form
          onSubmit={queryARWeaveSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
        >
          <label>
            Transaction sender:
            <input type='text' value={address} disabled />
          </label>
          <br />
          <label>
            Pool Name:
            <select
              name='pool_name'
              value={poolName}
              onChange={(event: any) => {
                setPoolName(event.target.value)
              }}
            >
              <option value='RequestNetwork'>RequestNetwork</option>
              <option value='HumaCreditLine'>HumaCreditLine</option>
              <option value='Superfluid'>Superfluid</option>
              <option value='Jia'>Jia</option>
            </select>
          </label>
          <br />
          <label>
            Pool Type:
            <select
              name='pool_type'
              value={poolType}
              onChange={(event: any) => {
                setPoolType(event.target.value)
              }}
            >
              <option value='Invoice'>Invoice</option>
              <option value='CreditLine'>CreditLine</option>
              <option value='Stream'>Stream</option>
            </select>
          </label>
          <label>
            Reference ID (For querying through ARWeave):
            <input
              type='text'
              value={referenceId}
              onChange={(event: any) => {
                setReferenceId(event.target.value)
              }}
            />
          </label>
          <br />
          <button type='submit' style={{ width: 'fit-content' }}>
            Query Metadata
          </button>
          <br />
          <a
            href={`https://arweave.net/${queryResult}`}
            target='_blank'
            rel='noreferrer'
          >
            {queryResult}
          </a>
        </form>
      </div>
      <div
        style={{
          border: '1px solid gray',
          padding: '0px 10px 20px 10px',
          borderRadius: '10px',
        }}
      >
        <h3>Example 5. Declare payment for Receivable by reference ID</h3>
        <form
          onSubmit={declarePaymentSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
        >
          <label>
            Transaction sender:
            <input type='text' value={address} disabled />
          </label>
          <br />
          <label>
            Reference ID (For querying through ARWeave):
            <input
              type='text'
              value={referenceId}
              onChange={(event: any) => {
                setReferenceId(event.target.value)
              }}
            />
          </label>
          <br />
          <label>
            Payment Amount:
            <input
              type='text'
              value={paymentAmount}
              onChange={(event: any) => {
                setPaymentAmount(event.target.value)
              }}
            />
          </label>
          <br />
          <button type='submit' style={{ width: 'fit-content' }}>
            Declare Payment
          </button>
          <br />
          {paymentResult}
        </form>
      </div>
      <div
        style={{
          border: '1px solid gray',
          padding: '0px 10px 20px 10px',
          borderRadius: '10px',
        }}
      >
        <h3>Example 6. Prefund ARWeave</h3>
        <form
          onSubmit={prefundARWeaveSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
        >
          <label>
            Transaction sender:
            <input type='text' value={address} disabled />
          </label>
          <br />
          <label>
            Amount (Atomic Units):
            <input
              type='text'
              value={prefundAmt}
              onChange={(event: any) => {
                setPrefundAmt(event.target.value)
              }}
            />
          </label>
          <br />
          <button type='submit' style={{ width: 'fit-content' }}>
            Prefund ARWeave
          </button>
          {prefundResult}
        </form>
      </div>
    </div>
  )
}

export default (
  <WalletWrapper>
    <Fixture />
  </WalletWrapper>
)
