/* eslint-disable @typescript-eslint/no-unused-vars */
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

const getCampaignAPIUrl = (isDev: boolean, pointsTestnetExperience: boolean) =>
  `https://${getDevPrefix(isDev)}${
    pointsTestnetExperience ? 'testnet.' : 'mainnet.'
  }campaign-points.huma.finance/graphql`

// @todo: ReferenceError: Cannot access 'ChainEnum' before initialization
const DEFAULT_CHAIN_ID = 137

const getEthereumDappUrl = (isDev = false) =>
  `https://${getDevPrefix(isDev)}app.huma.finance`
const getSolanaDappUrl = (isDev = false) =>
  `https://${getDevPrefix(isDev)}solapp.huma.finance`

export const configUtil = {
  dappLink: 'https://app.huma.finance/#',
  linkedInLink: 'https://www.linkedin.com/company/huma-finance',
  discordLink: 'https://discord.gg/29zVxZ6kCN',
  youtubeLink: 'https://www.youtube.com/@humafinance',
  twitterLink: 'https://twitter.com/humafinance',
  githubLink: 'https://github.com/00labs',
  telegramLink: 'https://t.me/HumaFinanceCommunity',
  whitepaperLink: 'https://docs.huma.finance/',
  lendingPoolLink: 'https://docs.huma.finance/#4.0-lending-protocol',
  devGuideLink:
    'https://docs.huma.finance/developer-guidelines/getting_started',
  dspDevGuideLink:
    'https://docs.huma.finance/developer-guidelines/decentralized_signal_portfolio',
  eaDevGuideLink:
    'https://docs.huma.finance/developer-guidelines/evaluation_agent',
  trancheLink: 'https://docs.huma.finance/lenders/tranches',
  termsOfServiceLink: 'https://huma.finance/#/termsOfUse',
  privacyPolicyLink: 'https://huma.finance/#/privacyPolicy',
  careersLink: '',
  blogLink: 'https://blog.huma.finance',
  contactLink: 'mailto:support@huma.finance',
  partnerLink:
    'https://uer4clyybno.typeform.com/humapartner?typeform-source=landing',
  auditLink:
    'https://github.com/00labs/huma-contracts-v2/blob/develop/audit/spearbit.pdf',
  getEAVerseUrl,
  getEABaseUrlV1,
  getRequestAPIUrl,
  getIdentityAPIUrl,
  getAuthServiceUrl,
  getKYCProviderBaseUrl,
  getCampaignAPIUrl,
  DEFAULT_CHAIN_ID,
  getEthereumDappUrl,
  getSolanaDappUrl,
}
