import { TransactionResponse } from '@ethersproject/providers'
import { BigNumberish, ethers, Overrides } from 'ethers'
import {
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
  RealWorldReceivableInfo,
  RealWorldReceivableInfoBase,
  SupplementaryContracts,
  SupplementaryContractsMap,
} from '@huma-shan/core'
import { request, gql } from 'graphql-request'

import { ARWeaveService } from './ARWeaveService'
import { getRealWorldReceivableContract } from '../helpers'
import { getDefaultGasOptions, getChainIdFromSignerOrProvider } from '../utils'
import { Receivable } from '../graphql/generatedTypes'
import { Pagination, SubgraphService } from './SubgraphService'

/**
 * Fetches the tokenId of a RealWorldReceivable, or null if it doesn't exist, given a metadata URI
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {ethers.Signer} signer - The signer used to lookup metadata uploads for
 * @param {string} arweaveId -  The internal ARWeave identifier to lookup a token by
 * @returns {Promise<string | null | undefined>} - Either the token Id or null if no token was found.
 */
async function getTokenIdByURI(
  signer: ethers.Signer,
  uri: string | null,
): Promise<string | null | undefined> {
  if (uri === null) {
    return null
  }

  const chainId = await getChainIdFromSignerOrProvider(signer)
  const signerAddress = await signer.getAddress()

  if (!chainId) {
    throw new Error('No Chain Id found')
  }

  // Fetch receivables with the same ARWeave Id
  const receivablesQuery = gql`
    query ReceivablesByURIQuery($owner: String!, $uri: String!) {
      rwreceivables(where: { owner: $owner, tokenUri: $uri }) {
        ...ReceivableFields
      }
    }

    fragment ReceivableFields on RWReceivable {
      tokenId
    }
  `

  const receivableSubgraph = SubgraphService.getSubgraphUrlForChainId(chainId)
  if (!receivableSubgraph) {
    throw new Error('No receivable subgraph exists for this chain')
  }

  const receivablesData: { rwreceivables: Receivable[] } = await request(
    receivableSubgraph,
    receivablesQuery,
    {
      owner: signerAddress,
      uri,
    },
  )

  if (!receivablesData?.rwreceivables?.length) {
    return null
  }
  if (receivablesData?.rwreceivables?.length > 1) {
    throw new Error(
      `This owner has multiple receivables with the same URI, so we don't know which to use. Please burn 
        unnecessary receivables. If paying, you can pay the correct token manually using declareReceivablePaymentByTokenId`,
    )
  }

  return receivablesData?.rwreceivables[0]?.tokenId
}

/**
 * Declares a payment on a RealWorldReceivable given a reference Id of the receivable, which was used as an index for ARWeave data.
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {ethers.Signer} signer - The signer used to send the transaction. Note only the receivable owner can pay the receivable.
 * @param {string} referenceId -  An internal identifier value added as a tag on ARWeave
 * @param {number} paymentAmount - The amount to declare paid to the receivable.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction receipt.
 */
async function declareReceivablePaymentByReferenceId(
  signer: ethers.Signer,
  referenceId: string,
  paymentAmount: number,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const chainId = await getChainIdFromSignerOrProvider(signer)
  const signerAddress = await signer.getAddress()

  if (!chainId) {
    throw new Error('No Chain Id found')
  }

  // Get ARWeave Id
  const dataId = await ARWeaveService.queryForMetadata(
    chainId,
    signerAddress,
    referenceId,
  )
  if (dataId == null) {
    throw new Error(
      'Could not find ARWeave Id for this reference Id. Please check your logs for more details.',
    )
  }

  // Fetch receivables with the same ARWeave Id
  const tokenId = await getTokenIdByURI(
    signer,
    ARWeaveService.getURIFromARWeaveId(dataId),
  )
  if (tokenId == null) {
    throw new Error(
      'Could not find tokenId for this ARWeave Id. Please check your logs for more details.',
    )
  }

  const contract = getRealWorldReceivableContract(signer, chainId)
  if (!contract) {
    throw new Error('Could not find RealWorldReceivable contract')
  }

  gasOpts = await getDefaultGasOptions(gasOpts, chainId)

  return contract.declarePayment(tokenId, paymentAmount, gasOpts)
}

/**
 * Declares a payment on a RealWorldReceivable given a tokenId of the receivable.
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {ethers.Signer} signer - The signer used to send the transaction. Note only the receivable owner can pay the receivable.
 * @param {BigNumberish} receivableTokenId - The Id of the receivable token to pay.
 * @param {number} paymentAmount - The amount to pay the receivable.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction receipt.
 * @throws {Error} - Throws an error if the RealWorldReceivable contract is not available on the network.
 */
async function declareReceivablePaymentByTokenId(
  signer: ethers.Signer,
  receivableTokenId: BigNumberish,
  paymentAmount: number,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const chainId = await getChainIdFromSignerOrProvider(signer)

  if (!chainId) {
    throw new Error('No Chain Id found')
  }

  const realWorldReceivable =
    SupplementaryContractsMap[chainId]?.[
      SupplementaryContracts.RealWorldReceivable
    ]

  if (!realWorldReceivable) {
    throw new Error('RealWorldReceivable is not available on this network')
  }

  const contract = getRealWorldReceivableContract(signer, chainId)

  if (!contract) {
    throw new Error('Could not find RealWorldReceivable contract')
  }

  gasOpts = await getDefaultGasOptions(gasOpts, chainId)

  return contract.declarePayment(receivableTokenId, paymentAmount, gasOpts)
}

/**
 * Creates a new RealWorldReceivable token on the given chain of the signer
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {ethers.Signer} signer - The signer used to send the transaction.
 * @param {POOL_NAME} poolName - The name of the credit pool to mint the receivable token from. Used to lookup the pool address.
 * @param {POOL_TYPE} poolType - The type of the credit pool to mint the receivable token from. Used to lookup the pool address.
 * @param {number} currencyCode - The ISO 4217 currency code that the receivable is denominated in
 * @param {number} receivableAmount - The amount of the receivable token to mint.
 * @param {number} maturityDate - The maturity date of the receivable token, in UNIX timestamp format.
 * @param {string} uri - The URI of the receivable token metadata.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse | null>} - A Promise of the transaction response.
 * @throws {Error} - Throws an error if the RealWorldReceivable contract is not available on the network, or if a token already exists with the same metadata URI.
 */
async function createReceivable(
  signer: ethers.Signer,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  currencyCode: number,
  receivableAmount: number,
  maturityDate: number,
  uri: string,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const tokenId = await getTokenIdByURI(signer, uri)
  if (tokenId != null) {
    throw new Error('A token already exists with this metadata, canceling mint')
  }

  const chainId = await getChainIdFromSignerOrProvider(signer)

  if (!chainId) {
    throw new Error('No Chain Id found')
  }

  const poolInfo = chainId
    ? PoolContractMap[chainId]?.[poolType]?.[poolName]
    : undefined

  if (!poolInfo) {
    throw new Error('This pool is not available on this network')
  }

  const contract = getRealWorldReceivableContract(signer, chainId)
  if (!contract) {
    throw new Error('Could not find RealWorldReceivable contract')
  }

  gasOpts = await getDefaultGasOptions(gasOpts, chainId)

  return contract.createRealWorldReceivable(
    poolInfo.pool,
    currencyCode,
    receivableAmount,
    maturityDate,
    uri,
    gasOpts,
  )
}

/**
 * Uploads metadata onto ARWeave (or fetches the existing metadata with the same reference Id) and returns the ARWeave URL
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {ethers.Signer} signer - An ethers.signer instance used to de-dupe metadata uploads.
 * @param {string} privateKey - Private key of the wallet used to upload metadata to ARWeave.
 * @param {number} chainId - The chain ID to mint the receivable token on and pay ARWeave funds from.
 * @param {POOL_NAME} poolName - The pool name. Used to lookup the pool address to pay to.
 * @param {POOL_TYPE} poolType - The pool type. Used to lookup the pool address to pay to.
 * @param {Record<string, any>} metadata - The metadata in JSON format. This will be uploaded onto ARWeave
 * @param {string} referenceId - An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.
 * @param {Array<{ name: string, value: string }>} extraTags - Any extraTags you'd like to tag your metadata with. Note that metadata on
 *      ARWeave is indexed by these tags, so make sure to include any tags that you'd like to be able to query by.
 * @param {boolean} [lazyFund=true] - Whether to lazy fund the ARWeave uploads. If true, the ARWeave uploads will be paid for by the
 *      metadata uploader immediately before uploading. If false, the ARWeave node must be pre-funded before calling this function.
 * @returns {Promise<string>} - The ARWeave metadata URI.
 */
async function uploadOrFetchMetadataURI(
  signer: ethers.Signer,
  privateKey: string,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  metadata: Record<string, unknown>,
  referenceId: string,
  extraTags: { name: string; value: string }[],
  lazyFund: boolean = true,
): Promise<string> {
  if (typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error('Input must be a JSON object.')
  }

  // Check to see if metadata with referenceId has already been minted
  const signerAddress = await signer.getAddress()
  const dataId = await ARWeaveService.queryForMetadata(
    chainId,
    signerAddress,
    referenceId,
  )
  const config = ARWeaveService.getBundlrNetworkConfig(chainId)

  let arweaveId
  if (dataId != null) {
    console.log(
      `Metadata already exists with this reference Id, returning existing data ==> ${ARWeaveService.getURIFromARWeaveId(
        dataId,
      )}`,
    )
    arweaveId = dataId
  } else {
    const tags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'appName', value: 'HumaFinance' },
      { name: 'poolName', value: poolName },
      { name: 'poolType', value: poolType },
      { name: 'referenceId', value: referenceId },
      ...extraTags,
    ]

    // Append referenceId to metadata (if it's not already there)
    if (!Object.prototype.hasOwnProperty.call(metadata, 'referenceId')) {
      metadata.referenceId = referenceId
    }

    const response = await ARWeaveService.storeData(
      config,
      privateKey,
      metadata,
      tags,
      lazyFund,
    )
    arweaveId = response.id
    console.log(
      `Data uploaded ==> ${ARWeaveService.getURIFromARWeaveId(arweaveId)}`,
    )
  }

  return ARWeaveService.getURIFromARWeaveId(arweaveId)
}

/**
 * Creates a RealWorldReceivable token with metadata uploaded onto ARWeave
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {ethers.Signer} signer - An ethers.signer instance used to de-dupe metadata uploads.
 * @param {string} privateKey - Private key of the wallet used to upload metadata to ARWeave.
 * @param {number} chainId - The chain ID to mint the receivable token on and pay ARWeave funds from.
 * @param {POOL_NAME} poolName - The pool name. Used to lookup the pool address to pay to.
 * @param {POOL_TYPE} poolType - The pool type. Used to lookup the pool address to pay to.
 * @param {number} currencyCode - The ISO 4217 currency code that the receivable is denominated in
 * @param {number} receivableAmount - The receivable amount.
 * @param {number} maturityDate - The maturity date of the receivable, in UNIX timestamp format.
 * @param {Record<string, any>} metadata - The metadata in JSON format. This will be uploaded onto ARWeave
 * @param {string} referenceId - An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.
 * @param {Array<{ name: string, value: string }>} extraTags - Any extraTags you'd like to tag your metadata with. Note that metadata on
 *      ARWeave is indexed by these tags, so make sure to include any tags that you'd like to be able to query by.
 * @param {boolean} [lazyFund=true] - Whether to lazy fund the ARWeave uploads. If true, the ARWeave uploads will be paid for by the
 *      metadata uploader immediately before uploading. If false, the ARWeave node must be pre-funded before calling this function.
 * @param {Overrides} [gasOpts] - Optional gas overrides for the transaction.
 * @returns {Promise<TransactionResponse>} - The transaction receipt.
 */
async function createReceivableWithMetadata(
  signer: ethers.Signer,
  privateKey: string,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  currencyCode: number,
  receivableAmount: number,
  maturityDate: number,
  metadata: Record<string, unknown>,
  referenceId: string,
  extraTags: { name: string; value: string }[],
  lazyFund: boolean = true,
  gasOpts?: Overrides,
): Promise<TransactionResponse> {
  if (typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error('Input must be a JSON object.')
  }

  // Check to see if metadata with referenceId has already been minted
  const metadataURI = await uploadOrFetchMetadataURI(
    signer,
    privateKey,
    chainId,
    poolName,
    poolType,
    metadata,
    referenceId,
    extraTags,
    lazyFund,
  )

  return createReceivable(
    signer,
    poolName,
    poolType,
    currencyCode,
    receivableAmount,
    maturityDate,
    metadataURI,
    gasOpts,
  )
}

/**
 * Loads all RWRs belonging to the specified owner, including the RWR metadata
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {number} chainID - The chain to query for receivables
 * @param {string} owner - The receivable token owner to query from.
 * @param {POOL_NAME} poolName - The pool name. Used to lookup the pool address to pay to.
 * @param {POOL_TYPE} poolType - The pool type. Used to lookup the pool address to pay to.
 * @param {Pagination} pagination - The pagination option.
 * @returns {Promise<RealWorldReceivableInfo[]>} - An array of receivables owned by the owner for the pool.
 */
async function loadReceivablesOfOwnerWithMetadata<T>(
  chainId: number,
  owner: string,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  pagination?: Pagination,
): Promise<RealWorldReceivableInfo<T>[]> {
  if (!ethers.utils.isAddress(owner)) {
    throw new Error('Invalid owner address')
  }

  const rwReceivablesBase = await SubgraphService.getRWReceivableInfo(
    owner,
    chainId,
    poolName,
    poolType,
    pagination,
  )

  const fetchMetadata = async (rwrInfoBase: RealWorldReceivableInfoBase) => {
    if (!rwrInfoBase.tokenURI) {
      return null
    }
    return ARWeaveService.fetchMetadataFromUrl(rwrInfoBase.tokenURI)
  }
  const metadatas = await Promise.all(rwReceivablesBase.map(fetchMetadata))

  return rwReceivablesBase.map(
    (rwrInfoBase, index) =>
      ({
        ...rwrInfoBase,
        metadata: metadatas[index],
      } as RealWorldReceivableInfo<T>),
  )
}

/**
 * Get the total count of all RWRs belonging to the specified owner
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {ethers.providers.Provider} provider - The provider used to query the chain.
 * @param {string} owner - The receivable token owner to query from.
 * @returns {Promise<number>} - Total count of receivables owned by the owner for the pool.
 */
async function getTotalCountOfReceivables(
  provider: ethers.providers.Provider,
  owner: string,
): Promise<number> {
  if (!ethers.utils.isAddress(owner)) {
    throw new Error('Invalid owner address')
  }

  const chainId = await getChainIdFromSignerOrProvider(provider)
  if (!chainId) {
    throw new Error('No Chain Id found')
  }

  const rwrContract = getRealWorldReceivableContract(provider, chainId)
  if (!rwrContract) {
    throw new Error('Could not find RealWorldReceivable contract')
  }

  const balance = await rwrContract.balanceOf(owner)
  return balance.toNumber()
}

/**
 * An object that contains functions to interact with Huma's receivables.
 * @namespace ReceivableService
 */
export const ReceivableService = {
  createReceivableWithMetadata,
  createReceivable,
  declareReceivablePaymentByTokenId,
  declareReceivablePaymentByReferenceId,
  loadReceivablesOfOwnerWithMetadata,
  getTotalCountOfReceivables,
  uploadOrFetchMetadataURI,
  getTokenIdByURI,
}
