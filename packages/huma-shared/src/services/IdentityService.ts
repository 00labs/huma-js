import { configUtil } from '../utils/config'
import { requestGet, requestPost, requestPut } from '../utils/request'

/**
 * Enum representing the identity status.
 * @typedef {Enum} IdentityStatus
 */
enum IdentityVerificationStatus {
  ACCREDITED = 'ACCREDITED',
  ACCREDITATION_NOT_APPLICABLE = 'ACCREDITATION_NOT_APPLICABLE',
  NOT_ACCREDITED = 'NOT_ACCREDITED',
  ACCREDITATION_PENDING = 'ACCREDITATION_PENDING',
  IDENTITY_VERIFICATION_COMPLETED = 'IDENTITY_VERIFICATION_COMPLETED',
  IDENTITY_VERIFICATION_FAILED = 'IDENTITY_VERIFICATION_FAILED',
  IDENTITY_VERIFICATION_PENDING = 'IDENTITY_VERIFICATION_PENDING',
  IDENTITY_VERIFICATION_UPDATES_REQUIRED = 'IDENTITY_VERIFICATION_UPDATES_REQUIRED',
  IDENTITY_VERIFICATION_NOT_STARTED = 'IDENTITY_VERIFICATION_NOT_STARTED',
  USER_NOT_ONBOARDED = 'USER_NOT_ONBOARDED',
}

/**
 * Object representing the response to the identity verification status request.
 * @typedef {Object} VerificationStatus
 * @property {string} walletAddress the wallet address to get the verification status.
 * @property {IdentityVerificationStatus} identityVerificationStatus The wallet's identity verification status.
 * @property {boolean} isVerified the wallet address has been verified or not.
 * @property {boolean} isNotOnboarded the wallet address has been not onboarded or not.
 */
export type VerificationStatusResult = {
  walletAddress: string
  verificationStatus: IdentityVerificationStatus
  isVerified: boolean
  isNotOnboarded: boolean
}

/**
 * Object representing the response to the document signature status request.
 * @typedef {Object} DocSignatureStatus
 * @property {string} envelopeId the envelope id to get the document signature status.
 * @property {string} status the document signature status.
 */
export type DocSignatureStatus = {
  envelopeId: string
  status:
    | 'completed'
    | 'created'
    | 'declined'
    | 'deleted'
    | 'delivered'
    | 'processing'
    | 'sent'
    | 'signed'
    | 'template'
    | 'voided'
}

/**
 * Get wallet's identity verification status.
 *
 * @param {string} walletAddress The wallet address.
 * @param {string} pool The pool address.
 * @param {number} chainId chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<VerificationStatusResult>} Promise that returns the verification status result.
 */
const getVerificationStatus = async (
  walletAddress: string,
  pool: string,
  chainId: number,
  isDev = false,
): Promise<VerificationStatusResult> => {
  const result = await requestPut<VerificationStatusResult>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/verification-status?poolAddress=${pool}&chainId=${chainId}`,
  )

  result.isVerified = [IdentityVerificationStatus.ACCREDITED].includes(
    result.verificationStatus,
  )
  result.isNotOnboarded =
    result.verificationStatus === IdentityVerificationStatus.USER_NOT_ONBOARDED

  return result
}

/**
 * Onboard user
 *
 * @param {string} walletAddress The wallet address.
 * @param {string} code The investor code.
 * @param {string} pool Pool address.
 * @param {number} chainId chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<string>} Promise that returns the onboard result
 */
const onboard = async (
  walletAddress: string,
  code: string,
  pool: string,
  chainId: number,
  isDev = false,
): Promise<string> =>
  requestPost<string>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/wallets/${walletAddress}/onboard?code=${code}&poolAddress=${pool}&chainId=${chainId}`,
  )

/**
 *  Get document signature status
 *
 * @param {string} envelopeId The envelope id.
 * @param {number} chainId chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<{envelopeId: string}>} Promise that returns the envelope ID
 */
const getDocSignatureStatus = async (
  envelopeId: string,
  chainId: number,
  isDev = false,
): Promise<DocSignatureStatus> =>
  requestGet<DocSignatureStatus>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/${envelopeId}/document-signature-status`,
  )

/**
 * Request document signature
 *
 * @param {string} walletAddress The wallet address.
 * @param {number} chainId chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<{envelopeId: string}>} Promise that returns the envelope ID
 */
const requestDocSignature = async (
  walletAddress: string,
  chainId: number,
  isDev = false,
): Promise<{ envelopeId: string }> =>
  requestPost<{ envelopeId: string }>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/request-document-signature`,
    { walletAddress, chainId },
  )

/**
 * Resend document signature link
 *
 * @param {string} envelopeId The envelope id.
 * @param {number} chainId chain ID.
 * @param {boolean} isDev Is dev environment or not.
 * @returns {Promise<{envelopeId: string}>} Promise that returns the envelope ID
 */
const resendDocSignatureLink = async (
  envelopeId: string,
  chainId: number,
  isDev = false,
): Promise<{ envelopeId: string }> =>
  requestPost<{ envelopeId: string }>(
    `${configUtil.getIdentityAPIUrl(
      chainId,
      isDev,
    )}/resend-document-signature-link`,
    { envelopeId },
  )

export const IdentityService = {
  getVerificationStatus,
  onboard,
  getDocSignatureStatus,
  requestDocSignature,
  resendDocSignatureLink,
}
