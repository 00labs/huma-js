/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jest/no-conditional-expect */
import {
  ChainEnum,
  CHAINS,
  findChainIdByName,
  getAddChainParameters,
  getWalletAddressAbbr,
  isChainEnum,
  supportedChainId,
  URLS,
} from '../../src/evm/utils/chain'

describe('isChainEnum', () => {
  it('should return true for valid chainId', () => {
    expect(isChainEnum(137)).toBe(true)
    expect(isChainEnum('5')).toBe(true)
  })

  it('should return false for invalid chainId', () => {
    expect(isChainEnum(999)).toBe(false)
    expect(isChainEnum('invalid')).toBe(false)
  })

  it('should return false for undefined chainId', () => {
    expect(isChainEnum(undefined)).toBe(false)
  })

  it('should return false for null chainId', () => {
    expect(isChainEnum(null as any)).toBe(false)
  })
})

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
