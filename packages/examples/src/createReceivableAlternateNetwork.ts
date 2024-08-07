import { Wallet, ethers } from 'ethers'
import {
  ARWeaveService,
  ReceivableService,
  getBundlrNetworkConfig,
} from '@huma-finance/sdk'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/core'
require('dotenv').config()

/*
 * We use Bundlr to upload metadata to ARWeave, which allows for users to pay in popular currencies like MATIC or ETH
 * instead of AR tokens. Certain networks that are still unsupported by Bundlr (e.g. Celo) can still use Bundlr to
 * fund the ARWeave uploads by simply paying on a supported network.
 *
 * This snippet shows how to use a wallet with MATIC to fund the ARWeave uploads, and then that same wallet on
 * a separate network to upload a RealWorldReceivable with the resulting metadata URI.
 */
async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY

  // We'll be using a mumbai wallet funded with MATIC to pay for the ARWeave uploads
  const mumbaiProvider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
    {
      name: 'Mumbai',
      chainId: ChainEnum.Mumbai,
    },
  )
  const walletOnSupportedBundlrNetwork = new Wallet(
    TEST_PRIVATE_KEY,
    mumbaiProvider,
  )

  // On a separate network which may not be supported by Bundlr, we'll use our wallet
  // to create a RealWorldReceivable with the metadata URI from ARWeave
  const rwrProvider = new ethers.providers.JsonRpcProvider(
    `https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY_2}`,
    {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    },
  )
  const walletOnRWRNetwork = new Wallet(TEST_PRIVATE_KEY, rwrProvider)

  console.log(
    `Using ${walletOnSupportedBundlrNetwork.address} to upload metadata`,
  )
  console.log(
    `Using ${walletOnRWRNetwork.address} to create RealWorldReceivable`,
  )

  // Prefund Bundlr with MATIC
  const fundResponse = await ARWeaveService.prefundBundlr(
    getBundlrNetworkConfig(ChainEnum.Mumbai),
    TEST_PRIVATE_KEY,
    0.05, // Fund with 0.05 matic
  )
  console.log(fundResponse)

  const uri = await ReceivableService.uploadOrFetchMetadataURI(
    walletOnSupportedBundlrNetwork,
    TEST_PRIVATE_KEY,
    ChainEnum.Mumbai,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine,
    JSON.parse('{"test": "test"}'), // metadata
    '1234567', // referenceId
    [{ name: 'indexedIdentifier', value: 'exampleValue' }], // extraTags
  )

  // Mint a receivable with metadata uploaded to ARWeave
  const tx = await ReceivableService.createReceivable(
    walletOnRWRNetwork,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine,
    840, // currencyCode for USD
    1000, // receivableAmount
    1684517656, // maturityDate
    uri, // metadataURI
  )
  const txResponse = await tx.wait()
  console.log(`Success. Tx hash: ${txResponse.transactionHash}`)
}

main()
