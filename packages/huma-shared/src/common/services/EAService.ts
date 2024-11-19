import { configUtil, downScale, EARejectionError, requestPost } from '../utils'

/**
 * Object representing the token information of the approval.
 * @typedef {Object} Token
 * @property {string} symbol The symbol of the base token of the pool.
 * @property {string} name The name of the base token of the pool.
 * @property {number} decimal The number of decimals for the base token of the pool.
 */
type Token = {
  symbol: string
  name: string
  decimal: number
}

/**
 * Object representing the approved loan terms.
 * @typedef {Object} Terms
 * @property {string} creditLimit The credit limit for the borrower in the pool's base currency.
 * @property {string} creditLimitFormatted The credit limit for the borrower in the pool's base currency, formatted with that tokens' decimals.
 * @property {number} intervalInDays The interval in days for credit line rebalancing.
 * @property {number} remainingPeriods The number of remaining payback periods in the credit line.
 * @property {number} aprInBps The annual percentage rate in basis points.
 */
type Terms = {
  creditLimit: string
  creditLimitFormatted: string
  intervalInDays: number
  remainingPeriods: number
  aprInBps: number
}

/**
 * Object representing receivable information of the approval.
 * @typedef {Object} Receivable
 * @property {string} asset The address of the receivable asset contract.
 * @property {number|string} param The identifying parameter for the receivable asset, often the token ID of an ERC721.
 * @property {string} amount The expected payment amount of the receivable asset.
 * @property {string} amountFormatted The expected payment amount of the receivable asset, formatted with that tokens' decimals.
 */
type Receivable = {
  asset: string
  param: string
  amount: string
  amountFormatted: string
}

/**
 * Object representing EA approval.
 * @typedef {Object} Approval
 * @property {Token} token The token information for the approval.
 * @property {Terms} terms The approved loan terms.
 * @property {Receivable} receivable The receivable information.
 */
export type Approval = {
  token: Token
  terms: Terms
  receivable?: Receivable
}

/**
 * Object representing EA rejection.
 * @typedef {Object} Rejection
 * @property {string[]} reasons Rejection reasons.
 */
export type Rejection = {
  reasons: string[]
}

/**
 * Object representing the response to the underwriting approval request.
 * @typedef {Object} ApprovalResult
 * @property {Approval | Rejection} result the EA decision, either an approval or rejection.
 */
export type ApprovalResult = {
  result: Approval | Rejection
}

/**
 * Object representing the receivable in an underwriting request.
 * @typedef {Object} ReceivableRequest
 * @property {string} address The address of the receivable asset contract.
 * @property {string} [param] The parameter for the receivable asset. E.g. For Request Network integrations,
 * this would be the request ID associated with the ERC20TransferableReceivable.
 */
type ReceivableRequest = {
  address: string
  param?: string
}

/**
 * Object representing the additional data required for a receivable-based underwriting request.
 * @typedef {Object} EARequestContextReceivable
 * @property {ReceivableRequest} receivable The receivable information.
 */
type EARequestContextReceivable = {
  receivable: ReceivableRequest
}

/**
 * Object representing the additional data required for a stream factoring underwriting request.
 * @typedef {Object} EARequestContextStream
 * @property {ReceivableRequest} receivable The receivable information.
 * @property {string} payerWalletAddress The address of the payer.
 * @property {string} superToken The address of the SuperToken contract.
 */
type EARequestContextStream = {
  receivable: ReceivableRequest
  payerWalletAddress: string
  superToken: string
}

/**
 * Object that represents the payload for an underwriting request.
 * @typedef {Object} EAPayload
 * @property {string} poolAddress The pool address to approve.
 * @property {string} borrowerWalletAddress The address of the borrower.
 * @property {EARequestContextReceivable | EARequestContextStream} [context] Extra values to submit with the approval request.
 */
export type EAPayload = {
  poolAddress: string
  borrowerWalletAddress: string
  context?: EARequestContextReceivable | EARequestContextStream
}

/**
 * Object representing the response to the underwriting preapproval request.
 * @typedef {Object} PreapprovalResult
 * @property {boolean} approved the EA decision, either an approval or rejection.
 * @property {string[]} [rejectionReasons] The reasons for rejection, if any
 */
export type PreapprovalResult = {
  approved: boolean
  rejectionReasons?: string[]
}

/**
 * Object that includes extra data to be submitted to the underwriting preapproval request when
 * checking for receivable requests
 * @typedef {Object} EAPreapproveContextReceivable
 * @property {string} payerWalletAddress The wallet of the payer of the receivable
 */
type EAPreapproveContextReceivable = {
  payerWalletAddress: string
}

/**
 * Object that represents the payload for a preapprove check.
 * @typedef {Object} EAPreapprovalPayload
 * @property {string} poolAddress The pool address to approve.
 * @property {string} borrowerWalletAddress The address of the borrower.
 * @property {EAPreapproveContextReceivable} [context] Extra values to submit with the preapproval request.
 */
export type EAPreapprovalPayload = {
  poolAddress: string
  borrowerWalletAddress: string
  context?: EAPreapproveContextReceivable
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isRejection = (obj: any): obj is Rejection =>
  obj !== null && typeof obj === 'object' && Array.isArray(obj.reasons)

/**
 * Submits a credit underwriting request to Huma's EAVerse. This approves a creditline
 * in Huma's pools that can be drawn down by the borrower.
 *
 * @param {EAPayload} payload The payload for the underwrite approval.
 * @param {number} chainId The chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<Approval>} Promise that returns the approval on success.
 * @throws {EARejectionError} If the underwrite approval is rejected.
 */
const approve = async (payload: EAPayload, chainId: number, isDev = false) => {
  const approvalResult: ApprovalResult = await requestPost<ApprovalResult>(
    `${configUtil.getEAVerseUrl(chainId, isDev)}/underwriter/underwrite`,
    payload,
  )
  const { result } = approvalResult
  if (isRejection(result)) {
    throw new EARejectionError()
  }
  if (!result) {
    throw new Error('Sorry, there was an error approving your wallet', {
      cause: 'server error',
    })
  }

  const { terms, receivable, token } = result
  if (terms?.creditLimit) {
    terms.creditLimit = String(result.terms.creditLimit)
    terms.creditLimitFormatted = downScale(
      String(result.terms.creditLimit),
      token.decimal,
    )
  }
  if (receivable?.amount) {
    receivable.amount = String(receivable.amount)
    receivable.amountFormatted = downScale(
      String(receivable.amount),
      token.decimal,
    )
  }

  return result
}

/**
 * Checks whether a credit underwriting request to Huma's EAVerse would be approved.
 * Note that this does not approve a creditline in Huma's pools and an `approve` call is still required.
 *
 * @param {EAPreapprovalPayload} payload The payload for the underwrite approval.
 * @param {number} chainId The chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<Approval>} Promise that returns the approval on success.
 */
const preapprove = async (
  payload: EAPreapprovalPayload,
  chainId: number,
  isDev = false,
): Promise<PreapprovalResult> =>
  requestPost<PreapprovalResult>(
    `${configUtil.getEAVerseUrl(chainId, isDev)}/underwriter/pre-approve`,
    payload,
  )

const approveLender = async (
  payload: {
    poolAddress: string
    lenderWalletAddress: string
  },
  chainId: number,
) => {
  const generalErrorMessage =
    'Sorry, there was an error approving your wallet as a lender.'
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await requestPost(
      `${configUtil.getEABaseUrlV1(chainId)}/addApprovedLender`,
      payload,
    )
    if (data.statusCode >= 500) {
      throw new Error(
        data.errorMessage ? data.errorMessage[0] : generalErrorMessage,
      )
    } else if (data.status) {
      throw new Error(data.reason[0])
    } else if (data.rejectionReason?.length) {
      throw new Error(data.rejectionReason[0])
    }
    return data as ApprovalResult
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message ?? generalErrorMessage, {
      cause: 'server error',
    })
  }
}

export const EAService = {
  approve,
  approveLender,
  preapprove,
}
