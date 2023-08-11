import { TransactionResponse, Web3Provider } from '@ethersproject/providers'
import { BigNumberish, ethers, Overrides } from 'ethers'
import {
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
  PoolSubgraphMap,
  RealWorldReceivableInfo,
  SupplementaryContracts,
  SupplementaryContractsMap,
} from '@huma-finance/shared'
import { request, gql } from 'graphql-request'

import { ARWeaveService } from './ARWeaveService'
import { getRealWorldReceivableContract } from '../helpers'
import { getDefaultGasOptions, getChainIdFromSignerOrProvider } from '../utils'
import { Receivable } from '../graphql/generatedTypes'

/**
 * Declares a payment on a RealWorldReceivable given a reference Id of the receivable, which was used as an index for ARWeave data.
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {ethers.Signer} signer - The signer used to lookup metadata uploads for
 * @param {string} arweaveId -  The internal ARWeave identifier to lookup a token by
 * @returns {Promise<string | null | undefined>} - Either the token Id or null if no token was found.
 */
async function getTokenIdByARWeaveId(
  signer: ethers.Signer,
  arweaveId: string | null,
): Promise<string | null | undefined> {
  if (arweaveId === null) {
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
      receivables(where: { owner: $owner, uri: $uri }) {
        ...ReceivableFields
      }
    }

    fragment ReceivableFields on Receivable {
      tokenId
    }
  `

  const receivableSubgraph = PoolSubgraphMap[chainId]?.receivablesSubgraph
  if (!receivableSubgraph) {
    throw new Error('No receivable subgraph exists for this chain')
  }

  const receivablesData: { receivables: Receivable[] } = await request(
    receivableSubgraph,
    receivablesQuery,
    {
      owner: signerAddress,
      uri: `https://arweave.net/${arweaveId}`,
    },
  )

  if (!receivablesData?.receivables?.length) {
    console.log('No receivables found with this ARWeave Id.')
    return null
  }
  if (receivablesData?.receivables?.length > 1) {
    console.log(
      `This owner has multiple receivables with the same ARWeave URI, so we don't know which to use. Please burn 
        unnecessary receivables or pay the correct token manually using declareReceivablePaymentByTokenId`,
    )
    return null
  }

  return receivablesData?.receivables[0]?.tokenId
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

  // Fetch receivables with the same ARWeave Id
  const tokenId = await getTokenIdByARWeaveId(signer, dataId)
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
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 * @throws {Error} - Throws an error if the RealWorldReceivable contract is not available on the network.
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
  const chainId = await getChainIdFromSignerOrProvider(signer)

  if (!chainId) {
    throw new Error('No Chain Id found')
  }

  const poolInfo = chainId
    ? PoolContractMap[chainId]?.[poolType]?.[poolName]
    : undefined

  if (!poolInfo) {
    throw new Error('RealWorldReceivable is not available on this network')
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
 * Creates a RealWorldReceivable token with metadata uploaded onto ARWeave
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {Web3Provider | ethers.Signer} signerOrProvider - If calling this function from a browser, this function expects a Web3Provider.
 *      If calling this function from a server, this function expects an ethers Signer. Note that privateKey only needs to be included
 *      from server calls.
 * @param {string | null} privateKey - Private key of the wallet used to upload metadata to ARWeave. Only required if calling this function from a server.
 * @param {number} chainId - The chain ID to mint the receivable token on and pay ARWeave funds from.
 * @param {POOL_NAME} poolName - The pool name. Used to lookup the pool address to pay to.
 * @param {POOL_TYPE} poolType - The pool type. Used to lookup the pool address to pay to.
 * @param {number} currencyCode - The ISO 4217 currency code that the receivable is denominated in
 * @param {number} receivableAmount - The receivable amount.
 * @param {number} maturityDate - The maturity date of the receivable, in UNIX timestamp format.
 * @param {Record<string, any>} metadata - The metadata in JSON format. This will be uploaded onto ARWeave
 * @param {number} referenceId - An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.
 * @param {Array<{ name: string, value: string }>} extraTags - Any extraTags you'd like to tag your metadata with. Note that metadata on
 *      ARWeave is indexed by these tags, so make sure to include any tags that you'd like to be able to query by.
 * @param {boolean} [lazyFund=true] - Whether to lazy fund the ARWeave uploads. If true, the ARWeave uploads will be paid for by the
 *      metadata uploader immediately before uploading. If false, the ARWeave node must be pre-funded before calling this function.
 * @param {Overrides} [gasOpts] - Optional gas overrides for the transaction.
 * @returns {Promise<TransactionResponse>} - The transaction receipt.
 */
async function createReceivableWithMetadata(
  signerOrProvider: Web3Provider | ethers.Signer,
  privateKey: string | null,
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

  const config = ARWeaveService.getBundlrNetworkConfig(chainId)

  try {
    // Check to see if metadata with referenceId has already been minted
    const signer =
      signerOrProvider instanceof Web3Provider
        ? signerOrProvider.getSigner()
        : signerOrProvider
    const signerAddress = await signer.getAddress()
    const dataId = await ARWeaveService.queryForMetadata(
      chainId,
      signerAddress,
      referenceId,
    )
    let arweaveId
    if (dataId != null) {
      // If there already exists metadata with this reference Id, check if there exists
      // a token with that ARWeave Id as metadata.
      const tokenId = await getTokenIdByARWeaveId(signer, dataId)

      if (tokenId == null) {
        console.log(
          `Reusing existing metadata ${dataId} to mint new receivable`,
        )
        arweaveId = dataId
      } else {
        throw new Error(
          'A token already exists with this reference Id, canceling mint',
        )
      }
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
        signerOrProvider instanceof Web3Provider
          ? signerOrProvider
          : privateKey!,
        metadata,
        tags,
        lazyFund,
      )
      arweaveId = response.id
      console.log(`Data uploaded ==> https://arweave.net/${arweaveId}`)
    }

    return await createReceivable(
      signer,
      poolName,
      poolType,
      currencyCode,
      receivableAmount,
      maturityDate,
      `https://arweave.net/${arweaveId}`,
      gasOpts,
    )
  } catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * Loads all RWRs belonging to the specified owner, including the RWR metadata
 *
 * @async
 * @function
 * @memberof ReceivableService
 * @param {Web3Provider | ethers.Signer} signerOrProvider - If calling this function from a browser, this function expects a Web3Provider.
 *      If calling this function from a server, this function expects an ethers Signer. Note that privateKey only needs to be included
 *      from server calls.
 * @param {string} owner - The receivable token owner to query from.
 * @param {POOL_NAME} poolName - The pool name. Used to lookup the pool address to pay to.
 * @param {POOL_TYPE} poolType - The pool type. Used to lookup the pool address to pay to.
 * @returns {Promise<RealWorldReceivableInfo[]>} - An array of receivables owned by the owner for the pool.
 */
async function loadReceivablesOfOwnerWithMetadata<T>(
  signerOrProvider: Web3Provider | ethers.Signer,
  owner: string,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): Promise<RealWorldReceivableInfo<T>[]> {
  if (!ethers.utils.isAddress(owner)) {
    throw new Error('Invalid owner address')
  }

  const chainId = await getChainIdFromSignerOrProvider(signerOrProvider)
  if (!chainId) {
    throw new Error('No Chain Id found')
  }

  const poolInfo = chainId
    ? PoolContractMap[chainId]?.[poolType]?.[poolName]
    : undefined
  if (!poolInfo) {
    throw new Error('RealWorldReceivable is not available on this network')
  }

  const rwrContract = getRealWorldReceivableContract(signerOrProvider, chainId)
  if (!rwrContract) {
    throw new Error('Could not find RealWorldReceivable contract')
  }

  // Load all receivables of owner
  const balance = await rwrContract.balanceOf(owner)

  // Create empty array with length of balance
  const tokens = Array.from(Array(balance.toNumber()))
  const fetchPromises = tokens.map(async (_, tokenIndex) => {
    const tokenId = await rwrContract.tokenOfOwnerByIndex(owner, tokenIndex)
    const rwrInfo = await rwrContract.rwrInfoMapping(tokenId)
    // If a RWR uploaded by an owner is not for this specific pool, skip it
    if (rwrInfo.poolAddress.toLowerCase() !== poolInfo.pool.toLowerCase()) {
      return undefined
    }

    const tokenURI = await rwrContract.tokenURI(tokenId)
    const metadata = await ARWeaveService.fetchMetadataFromUrl(tokenURI)

    return {
      tokenId,
      poolAddress: rwrInfo.poolAddress,
      receivableAmount: rwrInfo.receivableAmount,
      paidAmount: rwrInfo.paidAmount,
      creationDate: rwrInfo.creationDate,
      maturityDate: rwrInfo.maturityDate,
      currencyCode: rwrInfo.currencyCode,
      tokenURI,
      metadata,
    }
  })

  const tokenData = await Promise.all(fetchPromises)

  // Filter undefined
  return tokenData.filter(
    (token) => token !== undefined,
  ) as RealWorldReceivableInfo<T>[]
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
}
