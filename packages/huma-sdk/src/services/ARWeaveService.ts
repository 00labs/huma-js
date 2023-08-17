import Bundlr from '@bundlr-network/client'
import type {
  FundResponse,
  UploadResponse,
} from '@bundlr-network/client/build/cjs/common/types'
import { Web3Provider } from '@ethersproject/providers'
import axios from 'axios'
import request, { gql } from 'graphql-request'

/**
 * The configuration for Bundlr network instances
 *
 * @typedef {Object} BundlrConfig
 * @memberof ARWeaveService
 * @property {string} nodeUrl - The Bundlr node URL to use.
 * @property {string} currency - The currency to pay for uploads with.
 *  Please see https://docs.bundlr.network/sdk/using-other-currencies for all the supported currencies
 * @property {string} [providerUrl] - The provider URL, required for devnets.
 */
export type BundlrConfig = {
  nodeUrl: string
  currency: string
  providerUrl?: string
}

/**
 * Get the configuration for Bundlr network given a chain ID
 *
 * @function
 * @memberof ARWeaveService
 * @param {number} chainId - The chain ID.
 * @returns {BundlrConfig} - The configuration for the Bundlr network.
 */
export function getBundlrNetworkConfig(chainId: number): BundlrConfig {
  switch (chainId) {
    case 5: // Goerli
      return {
        nodeUrl: 'https://devnet.bundlr.network',
        currency: 'ethereum',
        providerUrl:
          'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      }
    case 80001: // Mumbai
      return {
        nodeUrl: 'https://devnet.bundlr.network',
        currency: 'matic',
        providerUrl: 'https://rpc.ankr.com/polygon_mumbai',
      }
    case 137: // Matic
      return {
        nodeUrl: 'https://node1.bundlr.network',
        currency: 'matic',
      }
    default:
      return {
        nodeUrl: '',
        currency: '',
      }
  }
}

/**
 * Get a Bundlr instance for a specific network
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {BundlrConfig} config - The configuration for the Bundlr network.
 * @param {string} signer - The private key of the wallet to use Bundlr with.
 * @returns The Bundlr instance
 */
async function getBundlrInstance(config: BundlrConfig, signer: string) {
  const bundlr = new Bundlr(
    config.nodeUrl,
    config.currency,
    signer,
    config.providerUrl
      ? {
          providerUrl: config.providerUrl,
        }
      : undefined,
  )
  await bundlr.ready()

  return bundlr
}

/**
 * Prefund the Bundlr network with the specified amount. Required if not lazy funding.
 * Important note: The amount is denominated in the base unit of currency for that network.
 * If you want to upload 5 Matic to the Bundlr node, pass in an amount of 5.
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {BundlrConfig} config - The configuration for the Bundlr network.
 * @param {string} signer - The private key of the wallet to send funds from.
 * @param {number} amount - The amount to fund, denoted in whatever currency specified by the config (e.g. MATIC, ETH)
 * @returns {Promise<FundResponse>} - The fund response.
 */
async function prefundBundlr(
  config: BundlrConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signer: string,
  amount: number,
): Promise<FundResponse> {
  const bundlr = new Bundlr(
    config.nodeUrl,
    config.currency,
    signer,
    config.providerUrl
      ? {
          providerUrl: config.providerUrl,
        }
      : undefined,
  )
  await bundlr.ready()

  // Convert currency to its atomic units (e.g. MATIC -> wei)
  const atomicAmount = bundlr.utils.toAtomic(amount)

  return bundlr.fund(atomicAmount)
}

/**
 * Store data on ARWeave using the Bundlr Network.
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {BundlrConfig} config - Configuration object for the Bundlr instance.
 * @param {Web3Provider | string} signerOrPrivateKey - Wallet object used for interacting with the Bundlr instance.
 *         If calling from a browser, this should be a `Web3Provider` instance. If calling from a Node.js
 *         environment, this should be a private key string.
 * @param {Record<string, unknown>} data - The data to store in the Bundlr instance.
 * @param {Array<{ name: string, value: string }>} tags - Array of tag objects with `name` and `value` properties.
 * @param {boolean} [lazyFund=true] - Optional flag to fund the Bundlr instance lazily. If set to `false`, the
 *        Bundlr node should already be funded or else uploads will fail.
 * @returns {Promise<UploadResponse>} Promise resolving with the upload response.
 */
async function storeData(
  config: BundlrConfig,
  signerOrPrivateKey: Web3Provider | string,
  data: Record<string, unknown>,
  tags: { name: string; value: string }[],
  lazyFund: boolean = true,
): Promise<UploadResponse> {
  const bundlr = new Bundlr(
    config.nodeUrl,
    config.currency,
    signerOrPrivateKey,
    config.providerUrl
      ? {
          providerUrl: config.providerUrl,
        }
      : undefined,
  )
  await bundlr.ready()

  const dataStr = JSON.stringify(data)

  if (lazyFund) {
    const size = Buffer.byteLength(dataStr)
    const price = await bundlr.getPrice(size)

    // Add a buffer of 20% to account for fluctuations in the price
    const priceWithBuffer = price.multipliedBy(1.2).integerValue()
    console.log(
      `Funding bundlr with ${priceWithBuffer} ${config.currency} to upload data`,
    )
    await bundlr.fund(priceWithBuffer)
  }

  return bundlr.upload(dataStr, { tags })
}

/**
 * Helper method to query the Arweave network for receivables metadata previously uploaded.
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {number} chainId - The chain ID.
 * @param {string} sender - The sender tag to query.
 * @param {string} referenceId - The referenceId tag to query, whatever was used when uploading the metadata.
 * @returns {Promise<any>} Promise resolving with the queried data.
 */
async function queryForMetadata(
  chainId: number,
  sender: string,
  referenceId: string,
): Promise<string | null> {
  const config = getBundlrNetworkConfig(chainId)
  const query = gql`
    query ArweaveHumaMetadataQuery($sender: String!, $referenceId: String!) {
      transactions(
        owners: [$sender]
        tags: [
          { name: "appName", values: ["HumaFinance"] }
          { name: "referenceId", values: [$referenceId] }
        ]
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await request(`${config.nodeUrl}/graphql`, query, {
    sender,
    referenceId,
  })

  return data?.transactions?.edges?.[0]?.node?.id
}

/**
 * Helper method to fetch data from an ARWeave URL.
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {string} url - The ARWeave metadata URL to query.
 * @returns {Promise<JSON>} Promise resolving with the queried data.
 */
async function fetchMetadataFromUrl(url: string): Promise<JSON | null> {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

/**
 * Helper method to get an ARWeave URI from an ARWeave ID.
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {string} arweaveId - The ARWeave metadata ID.
 * @returns {string} The ARWeave URI.
 */
function getURIFromARWeaveId(arweaveId: string): string {
  return `https://arweave.net/${arweaveId}`
}

/**
 * An object that contains functions to interact with Huma-related data stored on ARWeave
 * @namespace ARWeaveService
 */
export const ARWeaveService = {
  queryForMetadata,
  storeData,
  prefundBundlr,
  getBundlrNetworkConfig,
  getBundlrInstance,
  fetchMetadataFromUrl,
  getURIFromARWeaveId,
}
