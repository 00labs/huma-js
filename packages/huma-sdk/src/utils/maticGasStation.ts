import { Overrides, ethers } from 'ethers'
import { ChainEnum, requestGet } from '@huma-finance/shared'

import { isPolygonNetwork } from './chain'

export async function getPolygonGasOptions(
  network: number,
): Promise<Overrides> {
  let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
  let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
  try {
    const url =
      network === ChainEnum.Polygon
        ? 'https://gasstation.polygon.technology/v2'
        : 'https://gasstation-testnet.polygon.technology/v2'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await requestGet(url)
    maxFeePerGas = ethers.utils.parseUnits(
      `${Math.ceil(data.fast.maxFee)}`,
      'gwei',
    )
    maxPriorityFeePerGas = ethers.utils.parseUnits(
      `${Math.ceil(data.fast.maxPriorityFee)}`,
      'gwei',
    )
  } catch {
    // ignore
  }

  return {
    maxFeePerGas,
    maxPriorityFeePerGas,
  }
}

export async function getPolygonscanGasOptions(
  network: number,
): Promise<Overrides> {
  // Use getPolygonGasOptions for testnet
  if (network !== ChainEnum.Polygon) {
    return getPolygonGasOptions(network)
  }

  let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
  let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await requestGet(
      'https://api.polygonscan.com/api?module=gastracker&action=gasoracle',
    )
    maxFeePerGas = ethers.utils.parseUnits(
      `${Math.ceil(data.result.FastGasPrice)}`,
      'gwei',
    )
    maxPriorityFeePerGas = ethers.utils.parseUnits(
      `${data.result.FastGasPrice - data.result.suggestBaseFee}`,
      'gwei',
    )
  } catch (error) {
    console.error(error)
  }

  return {
    maxFeePerGas,
    maxPriorityFeePerGas,
  }
}

export async function getDefaultGasOptions(
  gasOpts: Overrides,
  network: number,
) {
  // Return gasOpts if there are values already set
  if (Object.keys(gasOpts).length > 0) {
    return gasOpts
  }

  if (isPolygonNetwork(network)) {
    gasOpts = await getPolygonscanGasOptions(network)
  }

  return gasOpts
}
