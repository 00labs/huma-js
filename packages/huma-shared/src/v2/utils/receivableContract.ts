import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { Receivable } from '../abis/types/Receivable'
import { POOL_NAME, getContract } from '../../utils'
import { getPoolConfigContractV2 } from './poolContract'
import RECEIVABLE_V2_ABI from '../abis/Receivable.json'

export async function getReceivableContractV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider,
): Promise<Receivable | null> {
  const poolConfigContract = await getPoolConfigContractV2(poolName, provider)

  if (!poolConfigContract) {
    throw new Error('Could not find PoolConfig contract')
  }

  const receivableAsset = await poolConfigContract.receivableAsset()

  return getContract<Receivable>(receivableAsset, RECEIVABLE_V2_ABI, provider)
}

export async function getReceivableTokenIdFromReferenceId(
  referenceId: string,
  creator: string,
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider,
): Promise<BigNumber> {
  const contract = await getReceivableContractV2(poolName, provider)
  if (!contract) {
    throw new Error('Could not find Receivable contract')
  }

  const referenceIdHash = await contract.getReferenceIdHash(
    referenceId,
    creator,
  )

  return contract.referenceIdHashToTokenId(referenceIdHash)
}

export async function getReceivableReferenceAlreadyExists(
  referenceId: string,
  signerAddress: string,
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider,
): Promise<boolean> {
  const tokenId = await getReceivableTokenIdFromReferenceId(
    referenceId,
    signerAddress,
    poolName,
    provider,
  )

  return !tokenId.isZero()
}
