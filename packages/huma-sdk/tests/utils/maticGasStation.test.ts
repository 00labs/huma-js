/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainEnum, requestGet } from '@huma-finance/core'

import { Overrides, ethers } from 'ethers'
import {
  getDefaultGasOptions,
  getPolygonGasOptions,
} from '../../src/utils/maticGasStation'

jest.mock('@huma-finance/core', () => ({
  requestGet: jest.fn(),
  ChainEnum: {
    Polygon: 137,
    Mumbai: 80001,
  },
}))

describe('getPolygonGasOptions', () => {
  test('should return default gas options if gas station throws error', async () => {
    ;(requestGet as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('something went wrong')),
    )
    const gasOptions = (await getPolygonGasOptions(ChainEnum.Mumbai)) as any

    expect(gasOptions.maxFeePerGas.toString()).toEqual(
      ethers.utils.parseUnits('40', 'gwei').toString(),
    )
    expect(gasOptions.maxPriorityFeePerGas.toString()).toEqual(
      ethers.utils.parseUnits('40', 'gwei').toString(),
    )
  })
  test('should return gas options from Polygon gas station', async () => {
    ;(requestGet as jest.Mock).mockImplementation((url) => {
      if (url === 'https://gasstation.polygon.technology/v2') {
        return Promise.resolve({
          fast: {
            maxFee: '50',
            maxPriorityFee: '50',
          },
        })
      }
      return Promise.reject(new Error('something went wrong'))
    })
    const gasOptions = (await getPolygonGasOptions(ChainEnum.Polygon)) as any

    expect(gasOptions.maxFeePerGas.toString()).toEqual(
      ethers.utils.parseUnits('50', 'gwei').toString(),
    )
    expect(gasOptions.maxPriorityFeePerGas.toString()).toEqual(
      ethers.utils.parseUnits('50', 'gwei').toString(),
    )
  })

  test('should return gas options from Polygon Mumbai gas station', async () => {
    ;(requestGet as jest.Mock).mockImplementation((url) => {
      if (url === 'https://gasstation-testnet.polygon.technology/v2') {
        return Promise.resolve({
          fast: {
            maxFee: '60',
            maxPriorityFee: '60',
          },
        })
      }
      return Promise.reject(new Error('something went wrong'))
    })
    const gasOptions = (await getPolygonGasOptions(ChainEnum.Mumbai)) as any

    expect(gasOptions.maxFeePerGas.toString()).toEqual(
      ethers.utils.parseUnits('60', 'gwei').toString(),
    )
    expect(gasOptions.maxPriorityFeePerGas.toString()).toEqual(
      ethers.utils.parseUnits('60', 'gwei').toString(),
    )
  })
})

describe('getDefaultGasOptions', () => {
  test('should return gas options if already set', async () => {
    const gasOpts: Overrides = {
      gasPrice: 20000000000, // 20 gwei
    }

    const result = await getDefaultGasOptions(gasOpts, 1)

    expect(result).toEqual(gasOpts)
  })

  test('should get gas options from Polygon gas station if network is Polygon and gas options are not set', async () => {
    ;(requestGet as jest.Mock).mockResolvedValue({
      fast: {
        maxFee: '50',
        maxPriorityFee: '50',
      },
    })

    const result = await getDefaultGasOptions({}, ChainEnum.Polygon)

    expect(result).toEqual({
      maxFeePerGas: ethers.BigNumber.from('50000000000'),
      maxPriorityFeePerGas: ethers.BigNumber.from('50000000000'),
    })
  })
})
