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

function getUnixTimestampOneDayInFuture() {
  return new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime()
}

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
    {
      name: 'Mumbai',
      chainId: ChainEnum.Mumbai,
    },
  )
  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const humaContext = new HumaContext({
    signer: wallet,
    provider,
    chainId: ChainEnum.Mumbai,
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.CreditLine,
  })
  const receivableFactory = new HumaReceivableFactory({
    humaContext,
  })

  // Mint a receivable with metadata uploaded to ARWeave
  // To make it easy to look up receivables, we'll use the maturity date as the reference ID
  const referenceId1 = getUnixTimestampOneDayInFuture()
  const mintTx = await receivableFactory.createReceivable(
    840, // currencyCode for USD
    BigNumber.from(1000), // receivableAmount
    Math.floor(getUnixTimestampOneDayInFuture() / 1000), // maturityDate
    '', // metadataURI
    referenceId1.toString(),
  )
  const mintTxResponse = await mintTx.wait()
  console.log(`Mint success. Tx hash: ${mintTxResponse.transactionHash}`)
  const receivableTokenId1 = await getReceivableTokenIdFromReferenceId(
    referenceId1.toString(),
    wallet.address,
    POOL_NAME.ArfCreditPoolV2,
    provider,
  )

  const drawdownTx = await drawdownWithReceivable(
    wallet,
    POOL_NAME.ArfCreditPoolV2,
    receivableTokenId1,
    BigNumber.from(10), // drawdown amount
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
    BigNumber.from(10),
    referenceId1.toString(),
  )
  const declarePaymentTxResponse = await declarePaymentTx.wait()
  console.log(
    `Declare payment success. Tx hash: ${declarePaymentTxResponse.transactionHash}`,
  )

  // Mint a new receivable to drawdown with
  const referenceId2 = getUnixTimestampOneDayInFuture()
  const mint2Tx = await receivableFactory.createReceivable(
    840, // currencyCode for USD
    BigNumber.from(1000), // receivableAmount
    Math.floor(getUnixTimestampOneDayInFuture() / 1000), // maturityDate
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
    POOL_NAME.ArfCreditPoolV2,
    provider,
  )

  const makePrincipalPaymentAndDrawdownTx =
    await makePrincipalPaymentAndDrawdownWithReceivable(
      wallet,
      POOL_NAME.ArfCreditPoolV2,
      receivableTokenId1, // payment receivable
      BigNumber.from(10), // payment amount
      receivableTokenId2, // drawdown receivable
      BigNumber.from(10), // drawdown amount
    )
  const paymentAndDrawdownTxResponse =
    await makePrincipalPaymentAndDrawdownTx.wait()
  console.log(
    `Make principal payment and drawdown success. Tx hash: ${paymentAndDrawdownTxResponse.transactionHash}`,
  )
}
main()
