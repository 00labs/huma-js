/* eslint-disable @typescript-eslint/no-explicit-any */
import { CHAINS, ChainEnum } from '../../src/utils/chain'
import { configUtil } from '../../src/utils/config'

describe('getEAVerseUrl', () => {
  it('returns the correct URL for a given chain id in production', () => {
    const result = configUtil.getEAVerseUrl(ChainEnum.Polygon)

    expect(result).toBe('https://Polygon.eaverse.huma.finance')
  })

  it('returns the correct URL for a given chain id in development', () => {
    const result = configUtil.getEAVerseUrl(ChainEnum.Polygon, true)

    expect(result).toBe('https://dev.Polygon.eaverse.huma.finance')
  })
})

describe('getEABaseUrlV1', () => {
  it('returns the correct URL for a given chain id', () => {
    const result = configUtil.getEABaseUrlV1(ChainEnum.Polygon)

    expect(result).toBe('https://Polygon.risk.huma.finance')
  })
})

describe('getRequestAPIUrl', () => {
  it('returns the override URL if it is provided', () => {
    const mockChainId = 123
    const mockUrl = 'https://override.url'
    CHAINS[mockChainId] = {
      ...CHAINS[ChainEnum.Polygon],
      requestAPIUrl: mockUrl,
    }

    const result = configUtil.getRequestAPIUrl(mockChainId)

    expect(result).toBe(mockUrl)

    delete CHAINS[mockChainId]
  })

  it('returns the correct URL for a given chain id in production', () => {
    const result = configUtil.getRequestAPIUrl(ChainEnum.Polygon)

    expect(result).toBe('https://Polygon.rnreader.huma.finance')
  })

  it('returns the correct URL for a given chain id in development', () => {
    const result = configUtil.getRequestAPIUrl(ChainEnum.Polygon, true)

    expect(result).toBe('https://dev.Polygon.rnreader.huma.finance')
  })
})

describe('getIdentityAPIUrl', () => {
  it('returns the correct URL for a mainnet chain id in production', () => {
    const result = configUtil.getIdentityAPIUrl(ChainEnum.Polygon)

    expect(result).toBe('https://mainnet.identity-verification.huma.finance')
  })

  it('returns the correct URL for a testnet chain id in production', () => {
    const result = configUtil.getIdentityAPIUrl(ChainEnum.Goerli)

    expect(result).toBe('https://testnet.identity-verification.huma.finance')
  })

  it('returns the correct URL for a mainnet chain id in development', () => {
    const result = configUtil.getIdentityAPIUrl(ChainEnum.Polygon, true)

    expect(result).toBe(
      'https://dev.mainnet.identity-verification.huma.finance',
    )
  })

  it('returns the correct URL for a testnet chain id in development', () => {
    const result = configUtil.getIdentityAPIUrl(ChainEnum.Goerli, true)

    expect(result).toBe(
      'https://dev.testnet.identity-verification.huma.finance',
    )
  })
})

describe('getKYCProviderBaseUrl', () => {
  it('returns the correct URL for a given provider and mainnet chain id', () => {
    const result = configUtil.getKYCProviderBaseUrl(
      'Securitize',
      ChainEnum.Polygon,
    )

    expect(result).toBe('https://id.securitize.io')
  })

  it('returns the correct URL for a given provider and testnet chain id', () => {
    const result = configUtil.getKYCProviderBaseUrl(
      'Securitize',
      ChainEnum.Goerli,
    )

    expect(result).toBe('https://id.sandbox.securitize.io')
  })

  it('throws an error if the provider is unknown', () => {
    expect(() =>
      configUtil.getKYCProviderBaseUrl('Unknown' as any, ChainEnum.Polygon),
    ).toThrow('Unknown KYC provider: Unknown')
  })
})
