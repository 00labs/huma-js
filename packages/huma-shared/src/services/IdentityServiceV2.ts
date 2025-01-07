import { NETWORK_TYPE } from '../utils/chain'
import { configUtil } from '../utils/config'
import { requestGet, requestPatch, requestPost } from '../utils/request'

/**
 * Enum representing the identity status V2.
 * @typedef {Enum} IdentityVerificationStatusV2
 */
export enum IdentityVerificationStatusV2 {
  NOT_STARTED = 'not_started',
  CREATED = 'created',
  PENDING = 'pending',
  EXPIRED = 'expired',
  ACCREDITED = 'accredited',
  APPROVED = 'approved',
  BYPASSED = 'bypassed',
  DECLINED = 'declined',
  NEEDS_REVIEW = 'needs_review',
  CONSENTED_TO_SUBSCRIPTION = 'consented_to_subscription',
}

/**
 * Object representing the response to the identity verification status request.
 * @typedef {Object} VerificationStatusResultV2
 * @property {IdentityVerificationStatusV2} status The wallet's identity verification status.
 * @property {string} personaInquiryId The persona inquiry id.
 */
export type VerificationStatusResultV2 = {
  status: IdentityVerificationStatusV2
  personaInquiryId: string
}

/**
 * Object representing the response to the identity accreditation request.
 * @typedef {Object} AccreditationResultV2
 * @property {string} accreditedAt The accreditation passed time.
 */
export type AccreditationResultV2 = {
  accreditedAt: string
}

/**
 * Object representing the response to the identity start verification request.
 * @typedef {Object} StartVerificationResultV2
 * @property {IdentityVerificationStatusV2} status The wallet's identity verification status.
 * @property {string} personaInquiryId The persona inquiry id.
 */
export type StartVerificationResultV2 = {
  status: IdentityVerificationStatusV2
  personaInquiryId: string
}

/**
 * Object representing the response to the identity verification resume request.
 * @typedef {Object} ResumeVerificationResultV2
 * @property {string} sessionToken The session token.
 * @property {IdentityVerificationStatusV2} status The wallet's identity verification status.
 */
export type ResumeVerificationResultV2 = {
  sessionToken: string
  status: IdentityVerificationStatusV2
}

/**
 * Object representing the Huma account.
 * @typedef {Object} HumaAccount
 * @property {string} id The account id.
 * @property {string} name The account name.
 * @property {Wallet[]} wallets The account wallets.
 * @property {string} referralCode The account referral code.
 * @property {number} numReferrals The number of referrals.
 * @property {Referrer} referrer The account referrer.
 * @property {string} createdAt The account created time.
 */
export type HumaAccount = {
  id: string
  name: string
  wallets: {
    address: string
    chainId: string
  }[]
  referralCode: string
  numReferrals: number
  referrer: {
    id: string
    name: string
  }
  createdAt: string
}

/**
 * Object representing the Huma account login result.
 * @typedef {Object} HumaAccountLoginResult
 * @property {HumaAccount} account The Huma account.
 * @property {boolean} isNewAccount Is new account or not.
 */
export type HumaAccountLoginResult = HumaAccount & {
  account: HumaAccount
  isNewAccount: boolean
}

/**
 * Object representing the accreditation answers.
 * @typedef {Object} AccreditationAnswers
 * @property {string} question1 The question 1.
 * @property {boolean} question1Answer The question 1 answer.
 * @property {string} question2 The question 2.
 * @property {boolean} question2Answer The question 2 answer.
 * @property {string} question3 The question 3.
 * @property {boolean} question3Answer The question 3 answer.
 */
export type AccreditationAnswers = {
  question1: string
  question1Answer: boolean
  question2: string
  question2Answer: boolean
  question3: string
  question3Answer: boolean
}

/**
 * Object representing the account name validity.
 * @typedef {Object} AccountNameValidity
 * @property {string} name The account name.
 * @property {string} invalidReason The invalid reason.
 */
export type AccountNameValidity = {
  name: string
  invalidReason: 'already_taken' | 'inappropriate_language'
}

/**
 * Get account's identity verification status.
 *
 * @param {string} networkType Network type.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResultV2>} Promise that returns the verification status result.
 */
const getVerificationStatusV2 = async (
  networkType: NETWORK_TYPE,
  isDev = false,
): Promise<VerificationStatusResultV2> =>
  requestGet<VerificationStatusResultV2>(
    `${configUtil.getIdentityAPIUrlV2(
      networkType,
      isDev,
    )}/account/verification-status`,
  )

/**
 * Start account's accreditation process.
 *
 * @param {NETWORK_TYPE} networkType Network type.
 * @param {AccreditationAnswers} answers accreditation answer.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResultV2>} Promise that returns the accreditation result.
 */
const accredit = async (
  networkType: NETWORK_TYPE,
  answers: AccreditationAnswers,
  isDev = false,
): Promise<AccreditationResultV2> =>
  requestPost<AccreditationResultV2>(
    `${configUtil.getIdentityAPIUrlV2(
      networkType,
      isDev,
    )}/account/accreditation`,
    { answers },
  )

/**
 * Start account's verification process.
 *
 * @param {NETWORK_TYPE} networkType Network type.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResultV2>} Promise that returns the start verification result.
 */
const startVerification = async (
  networkType: NETWORK_TYPE,
  isDev = false,
): Promise<VerificationStatusResultV2> =>
  requestPost<VerificationStatusResultV2>(
    `${configUtil.getIdentityAPIUrlV2(
      networkType,
      isDev,
    )}/account/verification`,
  )

/**
 * Resume account's verification process.
 *
 * @param {NETWORK_TYPE} networkType Network type.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<ResumeVerificationResultV2>} Promise that returns the resume verification result.
 */
const resumeVerification = async (
  networkType: NETWORK_TYPE,
  isDev = false,
): Promise<ResumeVerificationResultV2> =>
  requestPatch<ResumeVerificationResultV2>(
    `${configUtil.getIdentityAPIUrlV2(
      networkType,
      isDev,
    )}/account/verification`,
  )

/**
 * Consent to subscription.
 *
 * @param {NETWORK_TYPE} networkType Network type.
 * @param {string} documentHash The subscription file hash.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<void>} Promise that returns void.
 */
const consentToSubscription = async (
  networkType: NETWORK_TYPE,
  documentHash: string,
  isDev = false,
): Promise<void> =>
  requestPost<void>(
    `${configUtil.getIdentityAPIUrlV2(
      networkType,
      isDev,
    )}/account/purchase-consent`,
    { documentHash },
  )

/**
 * Approve wallet as lender.
 *
 * @param {NETWORK_TYPE} networkType Network type.
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {string} contractAddress The tranche vault contract address.
 * @param {boolean} isDev Is dev environment or not.
 * @param {Record<string, unknown>} chainSpecificData Chain specific data.
 * @returns {Promise<void>} Promise that returns void.
 */
const approveLender = async (
  networkType: NETWORK_TYPE,
  walletAddress: string,
  chainId: number,
  contractAddress: string,
  isDev = false,
  chainSpecificData?: Record<string, unknown>,
): Promise<void> =>
  requestPatch<void>(
    `${configUtil.getIdentityAPIUrlV2(
      networkType,
      isDev,
    )}/account/wallets/${chainId}/${walletAddress}`,
    { trancheAddress: contractAddress, chainSpecificData },
  )

/**
 * Get Huma account.
 *
 * @param {string} networkType Network type.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<HumaAccount>} Promise that returns huma account.
 */
const getHumaAccount = async (
  networkType: NETWORK_TYPE,
  isDev = false,
): Promise<HumaAccount> => {
  const { account } = await requestGet<{ account: HumaAccount }>(
    `${configUtil.getIdentityAPIUrlV2(networkType, isDev)}/account`,
  )
  return account
}

/**
 * Huma account login by wallet address and chain.
 *
 * @param {string} networkType Network type.
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<HumaAccountLoginResult>} Promise that returns HumaAccountLoginResult.
 */
const humaAccountLogin = async (
  networkType: NETWORK_TYPE,
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<HumaAccountLoginResult> =>
  requestPost<HumaAccountLoginResult>(
    `${configUtil.getIdentityAPIUrlV2(networkType, isDev)}/auth/login`,
    {
      walletAddress,
      chainId: String(chainId),
    },
  )

/**
 * Huma account logout.
 *
 * @param {string} networkType Network type.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<void>} Promise that returns void.
 */
const humaAccountLogout = async (
  networkType: NETWORK_TYPE,
  isDev = false,
): Promise<void> =>
  requestPost(
    `${configUtil.getIdentityAPIUrlV2(networkType, isDev)}/auth/logout`,
  )

/**
 * Update huma account.
 *
 * @param {string} networkType Network type.
 * @param {boolean} isDev Is dev environment or not.
 * @param {HumaAccount} humaAccount The Huma account.
 * @returns {Promise<void>} Promise that returns void.
 */
const humaAccountUpdate = async (
  networkType: NETWORK_TYPE,
  humaAccount: { name: string },
  isDev = false,
): Promise<void> =>
  requestPatch(
    `${configUtil.getIdentityAPIUrlV2(networkType, isDev)}/account`,
    humaAccount,
  )

/**
 * Update huma account referral code.
 *
 * @param {string} networkType Network type.
 * @param {string} referralCode The referral code.
 * @param {boolean} isDev Is dev environment or not.
 * @param {HumaAccount} humaAccount The Huma account.
 * @returns {Promise<void>} Promise that returns void.
 */
const humaAccountUpdateReferral = async (
  networkType: NETWORK_TYPE,
  referralCode: string,
  isDev = false,
): Promise<void> =>
  requestPost(
    `${configUtil.getIdentityAPIUrlV2(networkType, isDev)}/account/referral`,
    { referralCode },
  )

/**
 * Huma account adds wallet.
 *
 * @param {string} networkType Network type.
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<HumaAccount>} Promise that returns huma account.
 */
const humaAccountAddWallet = async (
  networkType: NETWORK_TYPE,
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<HumaAccount> =>
  requestPost(
    `${configUtil.getIdentityAPIUrlV2(networkType, isDev)}/account/wallets`,
    {
      walletAddress,
      chainId: String(chainId),
    },
  )

/**
 * Huma account name validity.
 *
 * @param {string} networkType Network type.
 * @param {name} name Name to check validity.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<HumaAccount>} Promise that returns huma account.
 */
const humaAccountNameValidity = async (
  networkType: NETWORK_TYPE,
  name: string,
  isDev = false,
): Promise<AccountNameValidity> =>
  requestGet(
    `${configUtil.getIdentityAPIUrlV2(
      networkType,
      isDev,
    )}/account/name-validity?name=${name}`,
  )

/**
 * Get recently joined accounts.
 *
 * @param {string} networkType Network type.
 * @param {boolean} isDev Is dev environment or not.
 * @param {number} limit The limit of the number of accounts to return.
 * @returns {Promise<HumaAccount[]>} Promise that returns recently joined huma accounts.
 */
const getRecentlyJoinedHumaAccounts = async (
  networkType: NETWORK_TYPE,
  isDev = false,
  limit = 10,
): Promise<HumaAccount[]> => {
  const result = await requestGet<{ accounts: HumaAccount[] }>(
    `${configUtil.getIdentityAPIUrlV2(
      networkType,
      isDev,
    )}/accounts/recently-joined?limit=${limit}`,
  )

  return result.accounts
}

export const IdentityServiceV2 = {
  getVerificationStatusV2,
  accredit,
  startVerification,
  resumeVerification,
  consentToSubscription,
  approveLender,
  getHumaAccount,
  humaAccountLogin,
  humaAccountLogout,
  humaAccountUpdate,
  humaAccountAddWallet,
  humaAccountUpdateReferral,
  humaAccountNameValidity,
  getRecentlyJoinedHumaAccounts,
}
