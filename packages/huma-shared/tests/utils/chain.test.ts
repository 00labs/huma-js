/* eslint-disable jest/no-conditional-expect */
import {
  ChainEnum,
  CHAINS,
  findChainIdByName,
  getAddChainParameters,
  getWalletAddressAbbr,
  supportedChainId,
  URLS,
} from '../../src/utils/chain'

describe('getAddChainParameters', () => {
  it('returns the chain parameters if the chain information is extended', () => {
    const result = getAddChainParameters(ChainEnum.Polygon)

    expect(result).toEqual({
      chainId: ChainEnum.Polygon,
      chainName: CHAINS[ChainEnum.Polygon].name,
      // @ts-ignore
      nativeCurrency: CHAINS[ChainEnum.Polygon].nativeCurrency,
      rpcUrls: CHAINS[ChainEnum.Polygon].urls,
    })
  })
})

describe('URLS', () => {
  it('contains the URLs of all chains', () => {
    Object.keys(CHAINS).forEach((chainId) => {
      const chain = CHAINS[Number(chainId)]
      if (chain.urls.length) {
        expect(URLS[Number(chainId)]).toEqual(chain.urls)
      } else {
        expect(URLS[Number(chainId)]).toBeUndefined()
      }
    })
  })
})

describe('getWalletAddressAbbr', () => {
  it('returns the address if the address is not provided', () => {
    const result = getWalletAddressAbbr('')

    expect(result).toBe('')
  })

  it('returns the abbreviated address if the address is provided', () => {
    const result = getWalletAddressAbbr('0x1234567890abcdef')

    expect(result).toBe('0x1234...cdef')
  })
})

describe('supportedChainId', () => {
  it('returns the chain id if the chain id is supported', () => {
    const result = supportedChainId(ChainEnum.Polygon)

    expect(result).toBe(ChainEnum.Polygon)
  })

  it('returns the chain id if the chain id is a string and is supported', () => {
    //  @ts-ignore
    const result = supportedChainId(String(ChainEnum.Polygon))
    expect(result).toBe(ChainEnum.Polygon)
  })

  it('returns undefined if the chain id is not supported', () => {
    const result = supportedChainId(123)

    expect(result).toBeUndefined()
  })

  it('returns undefined if the chain id is a string and is not supported', () => {
    //  @ts-ignore
    const result = supportedChainId('123')

    expect(result).toBeUndefined()
  })

  it('returns undefined if the chain id is not provided', () => {
    const result = supportedChainId(undefined)

    expect(result).toBeUndefined()
  })
})

describe('findChainIdByName', () => {
  it('returns the chain id if the chain name is found', () => {
    const result = findChainIdByName('Polygon')

    expect(result).toBe(ChainEnum.Polygon)
  })

  it('returns undefined if the chain name is not found', () => {
    const result = findChainIdByName('NonexistentChain')

    expect(result).toBeUndefined()
  })

  it('returns undefined if the chain name is not provided', () => {
    const result = findChainIdByName('')

    expect(result).toBeUndefined()
  })
})
