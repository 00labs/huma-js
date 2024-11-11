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
 * @property {string} accountId The account id.
 * @property {string} name The account name.
 * @property {Wallet[]} wallets The account wallets.
 * @property {boolean} isNewAccount Is new account or not.
 */
export type HumaAccount = {
  id: string
  accountId: string
  name: string
  wallets: {
    address: string
    chainId: string
  }[]
  isNewAccount: boolean
  referralCode: string
  numReferrals: number
  referrer: {
    id: string
    name: string
  }
}

/**
 * Get wallet's identity verification status.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResultV2>} Promise that returns the verification status result.
 */
const getVerificationStatusV2 = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<VerificationStatusResultV2> =>
  requestGet<VerificationStatusResultV2>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/verification-status?&chainId=${chainId}`,
  )

export type AccreditationAnswers = {
  question1: string
  question1Answer: boolean
  question2: string
  question2Answer: boolean
  question3: string
  question3Answer: boolean
}

/**
 * Start wallet's accreditation process.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {AccreditationAnswers} answers accreditation answer.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResultV2>} Promise that returns the start verification result.
 */
const accredit = async (
  walletAddress: string,
  chainId: number,
  answers: AccreditationAnswers,
  isDev = false,
): Promise<AccreditationResultV2> =>
  requestPost<AccreditationResultV2>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/accredit?chainId=${chainId}`,
    { answers },
  )

/**
 * Start wallet's verification process.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResultV2>} Promise that returns the start verification result.
 */
const startVerification = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<VerificationStatusResultV2> =>
  requestPost<VerificationStatusResultV2>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/start-verification?chainId=${chainId}`,
  )

/**
 * Resume wallet's verification process.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<ResumeVerificationResultV2>} Promise that returns the start verification result.
 */
const resumeVerification = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<ResumeVerificationResultV2> =>
  requestPost<ResumeVerificationResultV2>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/resume-verification?chainId=${chainId}`,
  )

/**
 * Consent to subscription.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {string} documentHash The subscription file hash.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<void>} Promise that returns void.
 */
const consentToSubscription = async (
  walletAddress: string,
  chainId: number,
  documentHash: string,
  isDev = false,
): Promise<void> =>
  requestPost<void>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/consent-to-subscription?chainId=${chainId}&documentHash=${documentHash}`,
  )

/**
 * Approve wallet as lender.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {string} contractAddress The tranche vault contract address.
 * @param {boolean} isDev Is dev environment or not.
 * @param {Record<string, unknown>} chainSpecificData Chain specific data.
 * @returns {Promise<void>} Promise that returns void.
 */
const approveLender = async (
  walletAddress: string,
  chainId: number,
  contractAddress: string,
  isDev = false,
  chainSpecificData?: Record<string, unknown>,
): Promise<void> =>
  requestPost<void>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/approve-lender?chainId=${chainId}&contractAddress=${contractAddress}`,
    { chain_specific_data: chainSpecificData },
  )

/**
 * Authenticate wallet account.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<void>} Promise that returns void.
 */
const authenticate = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<void> =>
  requestPost<void>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/authenticate?chainId=${chainId}`,
  )

/**
 * Get Huma account old.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<void>} Promise that returns void.
 */
const getHumaAccountOld = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<HumaAccount> =>
  requestGet<HumaAccount>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/account?chainId=${chainId}`,
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
  account.accountId = account.id
  return account
}

/**
 * Huma account login by wallet address and chain.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId Chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<void>} Promise that returns void.
 */
const humaAccountLogin = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<HumaAccount> =>
  requestPost<HumaAccount>(
    `${configUtil.getIdentityAPIUrl(chainId, isDev)}/auth/login`,
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
  humaAccount: Partial<HumaAccount>,
  isDev = false,
): Promise<void> =>
  requestPatch(
    `${configUtil.getIdentityAPIUrlV2(networkType, isDev)}/account`,
    humaAccount,
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

export const IdentityServiceV2 = {
  getVerificationStatusV2,
  accredit,
  startVerification,
  resumeVerification,
  consentToSubscription,
  approveLender,
  authenticate,
  getHumaAccountOld,
  getHumaAccount,
  humaAccountLogin,
  humaAccountLogout,
  humaAccountUpdate,
  humaAccountAddWallet,
}
