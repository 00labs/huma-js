import { TransactionResponse } from '@ethersproject/providers'
import {
  getReceivableContractV2,
  getReceivableTokenIdFromReferenceId,
} from '@huma-finance/shared'
import { BigNumber, Overrides } from 'ethers'
import { HumaContext } from './HumaContext'
import { getDefaultGasOptions } from '../../utils'

export class HumaReceivableHandler {
  #humaContext: HumaContext

  constructor({ humaContext }: { humaContext: HumaContext }) {
    if (!humaContext) {
      throw new Error('All parameters are required')
    }

    this.#humaContext = humaContext
  }

  async declarePayment(
    paymentAmount: BigNumber,
    referenceId: string = '',
    gasOpts: Overrides = {},
  ): Promise<TransactionResponse> {
    const contract = await getReceivableContractV2(
      this.#humaContext.poolName,
      this.#humaContext.provider,
    )
    if (!contract) {
      throw new Error('Could not find Receivable contract')
    }

    gasOpts = await getDefaultGasOptions(gasOpts, this.#humaContext.chainId)

    const signerAddress = await this.#humaContext.signer.getAddress()
    const tokenId = await getReceivableTokenIdFromReferenceId(
      referenceId,
      signerAddress,
      this.#humaContext.poolName,
      this.#humaContext.provider,
    )

    if (!tokenId) {
      throw new Error('Could not find tokenId')
    }

    return contract.declarePayment(tokenId, paymentAmount, gasOpts)
  }
}
