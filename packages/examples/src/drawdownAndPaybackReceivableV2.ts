import { BigNumber, Wallet, ethers } from 'ethers'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import {
  HumaContext,
  HumaReceivableFactory,
  HumaReceivableHandler,
  drawdownWithReceivable,
  getReceivableTokenIdFromReferenceId,
  makePrincipalPaymentAndDrawdownWithReceivable,
} from '@huma-finance/sdk'
require('dotenv').config()

function getFutureUnixTimestamp() {
  return new Date(new Date().getTime() + 32 * 24 * 60 * 60 * 1000).getTime()
}

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `http://localhost:8545`,
    {
      name: 'Localhost',
      chainId: ChainEnum.Localhost,
    },
  )
  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const borrowAmount = ethers.utils.parseUnits('1000', 6)

  const humaContext = new HumaContext({
    signer: wallet,
    provider,
    chainId: ChainEnum.Localhost,
    poolName: POOL_NAME.ReceivableBackedCreditLine,
    poolType: POOL_TYPE.CreditLine,
  })
  const receivableFactory = new HumaReceivableFactory({
    humaContext,
  })

  // Mint a receivable with metadata uploaded to ARWeave
  // To make it easy to look up receivables, we'll use the maturity date as the reference ID
  const referenceId1 = getFutureUnixTimestamp()
  const mintTx = await receivableFactory.createReceivable(
    840, // currencyCode for USD
    borrowAmount, // receivableAmount
    Math.floor(getFutureUnixTimestamp() / 1000), // maturityDate
    '', // metadataURI
    referenceId1.toString(),
  )
  const mintTxResponse = await mintTx.wait()
  console.log(`Mint success. Tx hash: ${mintTxResponse.transactionHash}`)
  const receivableTokenId1 = await getReceivableTokenIdFromReferenceId(
    referenceId1.toString(),
    wallet.address,
    POOL_NAME.ReceivableBackedCreditLine,
    wallet,
  )

  const drawdownTx = await drawdownWithReceivable(
    wallet,
    POOL_NAME.ReceivableBackedCreditLine,
    receivableTokenId1,
    borrowAmount, // drawdown amount
  )
  const drawdownTxResponse = await drawdownTx.wait()
  console.log(
    `Drawdown success. Tx hash: ${drawdownTxResponse.transactionHash}`,
  )

  // Declare payments to the receivable
  const receivableHandler = new HumaReceivableHandler({
    humaContext,
  })
  const declarePaymentTx = await receivableHandler.declarePayment(
    borrowAmount,
    referenceId1.toString(),
  )
  const declarePaymentTxResponse = await declarePaymentTx.wait()
  console.log(
    `Declare payment success. Tx hash: ${declarePaymentTxResponse.transactionHash}`,
  )

  // Mint a new receivable to drawdown with
  const referenceId2 = getFutureUnixTimestamp()
  const mint2Tx = await receivableFactory.createReceivable(
    840, // currencyCode for USD
    borrowAmount, // receivableAmount
    Math.floor(getFutureUnixTimestamp() / 1000), // maturityDate
    '', // metadataURI
    referenceId2.toString() + '2', // In case the reference ID is already taken
  )
  const mint2TxResponse = await mint2Tx.wait()
  console.log(
    `2nd receivable mint success. Tx hash: ${mint2TxResponse.transactionHash}`,
  )
  const receivableTokenId2 = await getReceivableTokenIdFromReferenceId(
    referenceId2.toString() + '2',
    wallet.address,
    POOL_NAME.ReceivableBackedCreditLine,
    wallet,
  )

  const makePrincipalPaymentAndDrawdownTx =
    await makePrincipalPaymentAndDrawdownWithReceivable(
      wallet,
      POOL_NAME.ReceivableBackedCreditLine,
      receivableTokenId1, // payment receivable
      borrowAmount, // payment amount
      receivableTokenId2, // drawdown receivable
      borrowAmount, // drawdown amount
    )
  const paymentAndDrawdownTxResponse =
    await makePrincipalPaymentAndDrawdownTx.wait()
  console.log(
    `Make principal payment and drawdown success. Tx hash: ${paymentAndDrawdownTxResponse.transactionHash}`,
  )
}
main()
