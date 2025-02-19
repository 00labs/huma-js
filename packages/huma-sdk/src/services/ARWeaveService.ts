import Irys from '@irys/sdk'
import {
  FundResponse,
  IrysConfig,
  Network,
  UploadResponse,
} from '@irys/sdk/build/cjs/common/types'
import axios from 'axios'
import { request, gql } from 'graphql-request'

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
 * Represents the constructor arguments for the Irys service.
 *
 * @typedef {Object} IrysConstructorArgs
 * @property {string} [url] - The URL of the Irys service.
 * @property {Network} [network] - The network configuration for the Irys service. Can be mainnet or devnet.
 * @property {string} token - The token for authentication.
 * @property {string} [key] - The key for encryption.
 * @property {IrysConfig} [config] - Additional configuration options for the Irys service.
 */
export type IrysConstructorArgs = {
  url?: string
  network?: Network
  token: string
  key?: string
  config?: IrysConfig
}

/**
 * Get the configuration for the Irys network given a chain ID
 *
 * @function
 * @memberof ARWeaveService
 * @param {number} chainId - The chain ID.
 * @returns {IrysConstructorArgs} - The configuration for the Irys network.
 */
export function getIrysNetworkConfig(chainId: number): IrysConstructorArgs {
  switch (chainId) {
    case 80002: // Amoy
      return {
        network: 'devnet',
        token: 'matic',
        config: {
          providerUrl: 'https://rpc.ankr.com/polygon_amoy',
        },
      }
    case 137: // Matic
      return {
        network: 'mainnet',
        token: 'matic',
      }
    case 44787: // Alfajores
      return {
        network: 'devnet',
        token: '',
      }
    case 42220: // Celo
      return {
        network: 'mainnet',
        token: '', // Uploads with Celo is not currently supported by Bundlr
      }
    case 534352: // Scroll
      return {
        network: 'mainnet',
        token: 'scroll-eth',
      }
    case 534351: // Scroll Sepolia
      return {
        network: 'devnet',
        token: 'scroll-eth',
        config: {
          providerUrl: 'https://rpc.ankr.com/scroll_sepolia_testnet',
        },
      }
    case 101: // Solana Mainnet
      return {
        network: 'mainnet',
        token: 'solana',
      }
    case 103: // Solana Devnet
      return {
        network: 'devnet',
        token: 'solana',
        config: {
          providerUrl: 'https://api.devnet.solana.com',
        },
      }
    default:
      return {
        network: '',
        token: '',
      }
  }
}

/**
 * Get an Irys instance for a specific network
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {BundlrConfig} config - The configuration for the Bundlr network.
 * @param {string} privateKey - The private key of the wallet to use Bundlr with.
 * @returns The Bundlr instance
 */
async function getIrysInstance(
  config: IrysConstructorArgs,
  privateKey: string,
) {
  return new Irys({ ...config, key: privateKey })
}

/**
 * Prefund the Irys network with the specified amount. Required if not lazy funding.
 * Important note: The amount is denominated in the base unit of currency for that network.
 * If you want to upload 5 Matic to the Irys node, pass in an amount of 5.
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {IrysConstructorArgs} config - The configuration for the Bundlr network.
 * @param {string} privateKey - The private key of the wallet to send funds from.
 * @param {number} amount - The amount to fund, denoted in whatever currency specified by the config (e.g. MATIC, ETH)
 * @returns {Promise<FundResponse>} - The fund response.
 */
async function prefundIrys(
  config: IrysConstructorArgs,
  privateKey: string,
  amount: number,
): Promise<FundResponse> {
  const irys = await getIrysInstance(config, privateKey)

  // Convert currency to its atomic units (e.g. MATIC -> wei)
  const atomicAmount = irys.utils.toAtomic(amount)

  return irys.fund(atomicAmount)
}

/**
 * Store data on ARWeave using the Irys Network.
 *
 * @async
 * @function
 * @memberof ARWeaveService
 * @param {IrysConstructorArgs} config - Configuration object for the Irys instance.
 * @param {string} privateKey - Private key used for interacting with the Irys instance.
 * @param {Record<string, unknown>} data - The data to store in the Irys instance.
 * @param {Array<{ name: string, value: string }>} tags - Array of tag objects with `name` and `value` properties.
 * @param {boolean} [lazyFund=true] - Optional flag to fund the Irys instance lazily. If set to `false`, the
 *        Irys node should already be funded or else uploads will fail.
 * @returns {Promise<UploadResponse>} Promise resolving with the upload response.
 */
async function storeData(
  config: IrysConstructorArgs,
  privateKey: string,
  data: Record<string, unknown>,
  tags: { name: string; value: string }[],
  lazyFund: boolean = true,
): Promise<UploadResponse> {
  const irys = await getIrysInstance(config, privateKey)

  const dataStr = JSON.stringify(data)

  if (lazyFund) {
    const size = Buffer.byteLength(dataStr)
    const price = await irys.getPrice(size)

    // Add a buffer of 20% to account for fluctuations in the price
    const priceWithBuffer = price.multipliedBy(1.2).integerValue()
    console.log(
      `Funding irys with ${priceWithBuffer} ${config.token} to upload data`,
    )
    await irys.fund(priceWithBuffer)
  }

  return irys.upload(dataStr, { tags })
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
  const config = getIrysNetworkConfig(chainId)
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
  const data: any = await request(
    config.network === 'mainnet'
      ? 'https://arweave.mainnet.irys.xyz/graphql'
      : 'https://arweave.devnet.irys.xyz/graphql',
    query,
    {
      sender,
      referenceId,
    },
  )

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
    const response = await axios.get(url, { withCredentials: false })
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
  prefundIrys,
  getIrysNetworkConfig,
  getIrysInstance,
  fetchMetadataFromUrl,
  getURIFromARWeaveId,
}
