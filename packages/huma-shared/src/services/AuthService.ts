import { configUtil, requestPost } from '../utils'

export type CreateSessionResult = {
  nonce: string
  expiresAt: string
}

const createSession = async (
  chainId: number,
  isDev: boolean = false,
): Promise<CreateSessionResult> =>
  requestPost<CreateSessionResult>(
    `${configUtil.getAuthServiceUrl(
      chainId,
      isDev,
    )}/session?chainId=${chainId}`,
  )

const verifySignature = async (
  message: string,
  signature: string,
  chainId: number,
  isDev: boolean = false,
): Promise<null> =>
  requestPost<null>(
    `${configUtil.getAuthServiceUrl(
      chainId,
      isDev,
    )}/verify-signature?chainId=${chainId}`,
    {
      message,
      signature,
    },
  )

export const AuthService = {
  createSession,
  verifySignature,
}
