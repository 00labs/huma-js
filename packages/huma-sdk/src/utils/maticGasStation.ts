import { Overrides, ethers } from 'ethers'
import { ChainEnum, requestGet } from '@huma-shan/core'

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

export async function getDefaultGasOptions(
  gasOpts: Overrides,
  network: number,
) {
  // Return gasOpts if there are values already set
  if (Object.keys(gasOpts).length > 0) {
    return gasOpts
  }

  if (isPolygonNetwork(network)) {
    gasOpts = await getPolygonGasOptions(network)
  }

  return gasOpts
}
