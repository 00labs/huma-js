import {
  EAPayload,
  EAPreapprovalPayload,
  EAService as EAServiceInternal,
} from '@huma-finance/core'

/**
 * Object representing the response to the underwriting approval request.
 * @typedef {Object} ApprovalResult
 */
/**
 * Object representing an invoice payload for underwriting approval.
 *
 * @typedef {Object} EAPayload
 */
export type { ApprovalResult, EAPayload } from '@huma-finance/core'

/**
 * Submits a credit underwriting request to Huma's EAVerse. This approves a creditline
 * in Huma's pools that can be drawn down by the borrower.
 *
 * @memberof EAService
 * @param {EAPayload} payload The payload for the underwrite approval.
 * @param {number} chainId The chain ID.
 * @returns {Promise<Approval>} Promise that returns the approval on success.
 * @throws {EARejectionError} If the underwrite approval is rejected.
 */
const approve = async (payload: EAPayload, chainId: number) =>
  EAServiceInternal.approve(payload, chainId)

/**
 * Checks whether or not a credit underwriting request to Huma's EAVerse would be approved.
 * Note that this does not approve a creditline in Huma's pools and an approve call is still required.
 *
 * @param {EAPreapprovalPayload} payload The payload for the underwrite approval.
 * @param {number} chainId The chain ID.
 * @returns {Promise<Approval>} Promise that returns the approval on success.
 */
const preapprove = async (payload: EAPreapprovalPayload, chainId: number) =>
  EAServiceInternal.preapprove(payload, chainId)

/**
 * An object that contains functions to interact with Huma's EAVerse service.
 *
 * @namespace EAService
 */
export const EAService = {
  approve,
  preapprove,
}
