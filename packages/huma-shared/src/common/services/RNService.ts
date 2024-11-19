import { configUtil, requestGet } from '../utils'

export type RequestInfoType = {
  expectedAmount: string
  payer: {
    type: string
    value: string
  }
  payee: {
    type: string
    value: string
  }
}

const getRequestInfo = async (requestId: string, chainId: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await requestGet<RequestInfoType>(
    `${configUtil.getRequestAPIUrl(chainId)}/request?id=${requestId}`,
  )
  return data
}

export const RNService = {
  getRequestInfo,
}
