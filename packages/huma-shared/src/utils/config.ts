import { CHAINS } from './chain'

const getDevPrefix = (isDev = false) => (isDev ? 'dev.' : '')

const getNetworkType = (chainId: number) =>
  CHAINS[chainId].isTestnet ? 'testnet' : 'mainnet'

const getNetworkAgnosticServiceUrlPrefix = (chainId: number, isDev: boolean) =>
  `${getDevPrefix(isDev)}${getNetworkType(chainId)}`

const getEAVerseUrl = (chainId: number, isDev = false) => {
  const network = CHAINS[chainId].name
  return `https://${getDevPrefix(isDev)}${network}.eaverse.huma.finance`
}

const getEABaseUrlV1 = (chainId: number) => {
  const network = CHAINS[chainId].name
  return `https://${network}.risk.huma.finance`
}

const getRequestAPIUrl = (chainId: number, isDev = false) => {
  // Get optional override
  const url = CHAINS[chainId].requestAPIUrl
  if (url) {
    return url
  }

  const network = CHAINS[chainId].name
  return `https://${getDevPrefix(isDev)}${network}.rnreader.huma.finance`
}

const getIdentityAPIUrl = (chainId: number, isDev = false) =>
  `https://${getNetworkAgnosticServiceUrlPrefix(
    chainId,
    isDev,
  )}.identity-verification.huma.finance`

const getAuthServiceUrl = (chainId: number, isDev = false) =>
  `https://${getNetworkAgnosticServiceUrlPrefix(
    chainId,
    isDev,
  )}.auth.huma.finance`

const getKYCProviderBaseUrl = (provider: 'Securitize', chainId: number) => {
  switch (provider) {
    case 'Securitize': {
      return `https://id${
        CHAINS[chainId].isTestnet ? '.sandbox' : ''
      }.securitize.io`
    }
    default:
      throw new Error(`Unknown KYC provider: ${provider}`)
  }
}

const getCampaignAPIUrl = () => `http://localhost:8000/graphql`

// @todo: ReferenceError: Cannot access 'ChainEnum' before initialization
const DEFAULT_CHAIN_ID = 137

export const configUtil = {
  getEAVerseUrl,
  getEABaseUrlV1,
  getRequestAPIUrl,
  getIdentityAPIUrl,
  getAuthServiceUrl,
  getKYCProviderBaseUrl,
  getCampaignAPIUrl,
  DEFAULT_CHAIN_ID,
}
