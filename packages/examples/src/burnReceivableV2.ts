import { BigNumber, Wallet, ethers } from 'ethers'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-shan/core'
import {
  HumaReceivableFactory,
  HumaContext,
  getReceivableTokenIdFromReferenceId,
  HumaReceivableHandler,
} from '@huma-shan/sdk'
require('dotenv').config()

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
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
  })
  const receivableFactory = new HumaReceivableFactory({
    humaContext,
  })

  // Mint a receivable with metadata uploaded to ARWeave
  const referenceId = 'test reference'
  const tx = await receivableFactory.createReceivableWithMetadata(
    TEST_PRIVATE_KEY, // privateKey
    840, // currencyCode for USD
    BigNumber.from(1000), // receivableAmount
    1684517656, // maturityDate
    JSON.parse('{"test": "test"}'), // metadata
    referenceId,
  )
  const txResponse = await tx.wait()
  console.log(`Success. Tx hash: ${txResponse.transactionHash}`)

  // Look up the token ID for the receivable
  const tokenId = await getReceivableTokenIdFromReferenceId(
    referenceId,
    wallet.address,
    POOL_NAME.JiaV2,
    provider,
  )
  console.log(`Token ID: ${tokenId}`)

  // Burn the receivable
  const receivableHandler = new HumaReceivableHandler({
    humaContext,
  })
  const burnTx = await receivableHandler.burnReceivable(tokenId)
  const txResponse2 = await burnTx.wait()
  console.log(`Burn success. Tx hash: ${txResponse2.transactionHash}`)
}

main()
