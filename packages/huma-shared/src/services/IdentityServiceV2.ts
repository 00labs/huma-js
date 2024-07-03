import { configUtil } from '../utils/config'
import { requestGet, requestPost } from '../utils/request'

/**
 * Enum representing the identity status V2.
 * @typedef {Enum} IdentityVerificationStatusV2
 */
export enum IdentityVerificationStatusV2 {
  NOT_STARTED = 'not_started',
  CREATED = 'created',
  PENDING = 'pending',
  EXPIRED = 'expired',
  APPROVED = 'approved',
  DECLINED = 'declined',
  NEEDS_REVIEW = 'needs_review',
}

/**
 * Object representing the response to the identity verification status request.
 * @typedef {Object} VerificationStatusResultV2
 * @property {string} walletAddress the wallet address to get the verification status.
 * @property {IdentityVerificationStatusV2} status The wallet's identity verification status.
 * @property {string} personaInquiryId The persona inquiry id.
 * @property {boolean} isNotStarted Is the verification not started.
 */
export type VerificationStatusResultV2 = {
  walletAddress: string
  status: IdentityVerificationStatusV2
  personaInquiryId: string
  isNotStarted: boolean
}

/**
 * Get wallet's identity verification status.
 *
 * @param {string} walletAddress The wallet address.
 * @param {string} pool The pool address.
 * @param {number} chainId chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResultV2>} Promise that returns the verification status result.
 */
const getVerificationStatusV2 = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<VerificationStatusResultV2> => {
  const result = await requestGet<VerificationStatusResultV2>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/verification-status?&chainId=${chainId}`,
  )

  result.isNotStarted =
    result.status === IdentityVerificationStatusV2.NOT_STARTED
  return result
}

/**
 * Object representing the response to the identity verification status request.
 * @typedef {Object} StartVerificationResultV2
 * @property {string} walletAddress the wallet address to get the verification status.
 * @property {IdentityVerificationStatusV2} status The wallet's identity verification status.
 * @property {string} personaInquiryId The persona inquiry id.
 */
export type StartVerificationResultV2 = {
  walletAddress: string
  status: IdentityVerificationStatusV2
  personaInquiryId: string
}

/**
 * Start wallet's verification process.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResultV2>} Promise that returns the start verification result.
 */
const startVerification = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<VerificationStatusResultV2> => {
  const result = await requestPost<VerificationStatusResultV2>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/start-verification?chainId=${chainId}`,
  )

  result.isNotStarted =
    result.status === IdentityVerificationStatusV2.NOT_STARTED
  return result
}

/**
 * Object representing the response to the identity verification resume request.
 * @typedef {Object} StartVerificationResultV2
 * @property {string} walletAddress the wallet address to resume the verification.
 * @property {string} sessionToken The session token.
 * @property {IdentityVerificationStatusV2} status The wallet's identity verification status.
 */
export type ResumeVerificationResultV2 = {
  walletAddress: string
  sessionToken: string
  status: IdentityVerificationStatusV2
}

/**
 * Resume wallet's verification process.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<ResumeVerificationResultV2>} Promise that returns the start verification result.
 */
const resumeVerification = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<ResumeVerificationResultV2> => {
  const result = await requestPost<ResumeVerificationResultV2>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/resume-verification?chainId=${chainId}`,
  )

  return result
}

/**
 * Approve wallet as lender.
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId chain ID.
 * @param {string} contractAddress The tranche vault contract address.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<void>} Promise that returns void.
 */
const approveLender = async (
  walletAddress: string,
  chainId: number,
  contractAddress: string,
  isDev = false,
): Promise<void> => {
  const result = await requestPost<void>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/approve-lender?chainId=${chainId}&contractAddress=${contractAddress}`,
  )

  return result
}

export const IdentityServiceV2 = {
  getVerificationStatusV2,
  startVerification,
  resumeVerification,
  approveLender,
}
