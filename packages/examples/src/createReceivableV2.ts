import { BigNumber, Wallet, ethers } from 'ethers'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { HumaReceivableFactory, HumaContext } from '@huma-finance/sdk'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://rpc-amoy.polygon.technology`,
    {
      name: 'Amoy',
      chainId: ChainEnum.Amoy,
    },
  )
  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const humaContext = new HumaContext({
    signer: wallet,
    provider,
    chainId: ChainEnum.Amoy,
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
  })
  const receivableFactory = new HumaReceivableFactory({
    humaContext,
  })

  // Mint a receivable with metadata uploaded to ARWeave
  const tx = await receivableFactory.createReceivableWithMetadata(
    TEST_PRIVATE_KEY, // privateKey
    840, // currencyCode for USD
    BigNumber.from(1000), // receivableAmount
    1684517656, // maturityDate
    JSON.parse('{"test": "test"}'), // metadata
  )
  const txResponse = await tx.wait()
  console.log(`Success. Tx hash: ${txResponse.transactionHash}`)
}

main()
