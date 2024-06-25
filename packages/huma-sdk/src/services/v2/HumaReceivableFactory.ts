import { TransactionResponse } from '@ethersproject/providers'
import { ChainEnum } from '@huma-finance/shared'
import { BigNumber, Overrides, ethers } from 'ethers'
import { ARWeaveService } from '../ARWeaveService'
import { ReceivableService } from '../ReceivableService'
import { getDefaultGasOptions } from '../../utils'
import { HumaContext } from './HumaContext'
import {
  getReceivableContractV2,
  getReceivableReferenceAlreadyExists,
} from '../../helpers/v2/ReceivableContractHelper'

export class HumaReceivableFactory {
  #humaContext: HumaContext

  #arWeavePaymentChainId?: ChainEnum

  constructor({
    humaContext,
    arWeavePaymentChainId,
  }: {
    humaContext: HumaContext
    arWeavePaymentChainId?: ChainEnum
  }) {
    if (!humaContext) {
      throw new Error('Must provide a HumaContext')
    }

    this.#humaContext = humaContext
    this.#arWeavePaymentChainId = arWeavePaymentChainId
  }

  async createReceivableWithMetadata(
    arweavePaymentPrivateKey: string,
    currencyCode: number,
    receivableAmount: BigNumber,
    maturityDate: number,
    metadata: Record<string, unknown>,
    referenceId: string = '',
    extraTags: { name: string; value: string }[] = [],
    lazyFund: boolean = true,
    gasOpts?: Overrides,
  ): Promise<TransactionResponse> {
    if (typeof metadata !== 'object' || Array.isArray(metadata)) {
      throw new Error('Input must be a JSON object.')
    }

    // Check that the private key is different from the signer passed in the context
    const signerAddress = await this.#humaContext.signer.getAddress()
    const arweavePaymentAddress = ethers.utils.computeAddress(
      arweavePaymentPrivateKey,
    )
    if (signerAddress === arweavePaymentAddress) {
      throw new Error(
        'The ARWeave payment private key must be different from the signer address',
      )
    }

    await this.throwIfReferenceIdExists(referenceId)

    const metadataURI = await this.uploadMetadata(
      arweavePaymentPrivateKey,
      metadata,
      referenceId,
      extraTags,
      lazyFund,
    )

    return this.createReceivable(
      currencyCode,
      receivableAmount,
      maturityDate,
      metadataURI,
      referenceId,
      gasOpts,
    )
  }

  async createReceivable(
    currencyCode: number,
    receivableAmount: BigNumber,
    maturityDate: number,
    metadataURI: string,
    referenceId: string = '',
    gasOpts: Overrides = {},
  ): Promise<TransactionResponse> {
    await this.throwIfReferenceIdExists(referenceId)

    const tokenId = await ReceivableService.getTokenIdByURI(
      this.#humaContext.signer,
      metadataURI,
    )
    if (tokenId != null) {
      throw new Error(
        'A token already exists with this metadata, canceling mint',
      )
    }

    const contract = await getReceivableContractV2(
      this.#humaContext.poolName,
      this.#humaContext.signer,
    )
    if (!contract) {
      throw new Error('Could not find Receivable contract')
    }

    gasOpts = await getDefaultGasOptions(gasOpts, this.#humaContext.chainId)

    return contract.createReceivable(
      currencyCode,
      receivableAmount,
      maturityDate,
      referenceId,
      metadataURI,
      gasOpts,
    )
  }

  async uploadMetadata(
    arweavePaymentPrivateKey: string,
    metadata: Record<string, unknown>,
    referenceId: string = '',
    extraTags: { name: string; value: string }[] = [],
    lazyFund: boolean = true,
  ): Promise<string> {
    if (typeof metadata !== 'object' || Array.isArray(metadata)) {
      throw new Error('Input must be a JSON object.')
    }

    const signerAddress = await this.#humaContext.signer.getAddress()
    const config = ARWeaveService.getBundlrNetworkConfig(
      this.#arWeavePaymentChainId !== undefined
        ? this.#arWeavePaymentChainId
        : this.#humaContext.chainId,
    )
    const tags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'appName', value: 'HumaFinance' },
      { name: 'ownerAddress', value: signerAddress },
      { name: 'poolName', value: this.#humaContext.poolName },
      { name: 'poolType', value: this.#humaContext.poolType },
      { name: 'referenceId', value: referenceId },
      ...extraTags,
    ]

    // Append referenceId to metadata (if it's not already there)
    if (!Object.prototype.hasOwnProperty.call(metadata, 'referenceId')) {
      metadata.referenceId = referenceId
    }

    const response = await ARWeaveService.storeData(
      config,
      arweavePaymentPrivateKey,
      metadata,
      tags,
      lazyFund,
    )

    console.log(
      `Data uploaded ==> ${ARWeaveService.getURIFromARWeaveId(response.id)}`,
    )

    return ARWeaveService.getURIFromARWeaveId(response.id)
  }

  async getTotalCountOfReceivables(owner: string): Promise<number> {
    if (!ethers.utils.isAddress(owner)) {
      throw new Error('Invalid owner address')
    }

    const contract = await getReceivableContractV2(
      this.#humaContext.poolName,
      this.#humaContext.signer,
    )
    if (!contract) {
      throw new Error('Could not find Receivable contract')
    }

    const balance = await contract.balanceOf(owner)
    return balance.toNumber()
  }

  private async throwIfReferenceIdExists(referenceId: string): Promise<void> {
    if (referenceId === '') {
      return
    }

    // Check whether a token already exists with this reference ID
    const signerAddress = await this.#humaContext.signer.getAddress()
    const receivableAlreadyExists = await getReceivableReferenceAlreadyExists(
      referenceId,
      signerAddress,
      this.#humaContext.poolName,
      this.#humaContext.signer,
    )
    if (receivableAlreadyExists) {
      throw new Error('A token already exists with this reference ID')
    }
  }
}
