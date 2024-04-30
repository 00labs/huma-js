import { BigNumber, Wallet, ethers } from 'ethers'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { HumaReceivableFactory, HumaContext } from '@huma-finance/sdk'
require('dotenv').config()

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

  const humaContext = new HumaContext({
    signer: wallet,
    provider: provider,
    chainId: ChainEnum.Localhost,
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
  })
  const receivableFactory = new HumaReceivableFactory({
    humaContext,
    arWeavePaymentChainId: ChainEnum.Amoy, // Use a Bundlr-supported network to pay for metadata uploading
  })

  // Mint a receivable with metadata uploaded to ARWeave.
  // By specifying the arWeavePaymentChainId, the factory
  // will use the given Bundlr-supported network to pay for the
  // ARWeave upload.
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
