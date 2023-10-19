/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers'
import type { Provider } from '@ethersproject/providers'
import type { Pool, PoolInterface } from '../Pool'

const _abi = [
  {
    inputs: [],
    name: 'zeroAddressProvided',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'refreshedTimestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'profit',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'loss',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lossRecovery',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'seniorTotalAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'juniorTotalAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'seniorTotalLoss',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'juniorTotalLoss',
        type: 'uint256',
      },
    ],
    name: 'PoolAssetsRefreshed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'poolConfig',
        type: 'address',
      },
    ],
    name: 'PoolConfigCacheUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newPoolConfig',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'oldPoolConfig',
        type: 'address',
      },
    ],
    name: 'PoolConfigChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'PoolDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'PoolEnabled',
    type: 'event',
  },
  {
    inputs: [],
    name: 'credit',
    outputs: [
      {
        internalType: 'contract IPoolCredit',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentTranchesAssets',
    outputs: [
      {
        internalType: 'uint96[2]',
        name: 'assets',
        type: 'uint96[2]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'disablePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'enablePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'epochManager',
    outputs: [
      {
        internalType: 'contract IEpochManager',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeManager',
    outputs: [
      {
        internalType: 'contract IPlatformFeeManager',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'firstLossCovers',
    outputs: [
      {
        internalType: 'contract IFirstLossCover',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract PoolConfig',
        name: '_poolConfig',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isPoolOn',
    outputs: [
      {
        internalType: 'bool',
        name: 'status',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolConfig',
    outputs: [
      {
        internalType: 'contract PoolConfig',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolOwnerOrEAFirstLossCover',
    outputs: [
      {
        internalType: 'contract IFirstLossCover',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolVault',
    outputs: [
      {
        internalType: 'contract IPoolVault',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'refreshPool',
    outputs: [
      {
        internalType: 'uint96[2]',
        name: 'assets',
        type: 'uint96[2]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract PoolConfig',
        name: '_poolConfig',
        type: 'address',
      },
    ],
    name: 'setPoolConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amounts',
        type: 'uint256',
      },
    ],
    name: 'submitRedemptionRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'trancheTotalAssets',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tranchesAssets',
    outputs: [
      {
        internalType: 'uint96',
        name: 'seniorTotalAssets',
        type: 'uint96',
      },
      {
        internalType: 'uint96',
        name: 'juniorTotalAssets',
        type: 'uint96',
      },
      {
        internalType: 'uint64',
        name: 'lastUpdatedTime',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tranchesLosses',
    outputs: [
      {
        internalType: 'uint96',
        name: 'seniorLoss',
        type: 'uint96',
      },
      {
        internalType: 'uint96',
        name: 'juniorLoss',
        type: 'uint96',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tranchesPolicy',
    outputs: [
      {
        internalType: 'contract ITranchesPolicy',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'updatePoolConfigData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint96[2]',
        name: 'assets',
        type: 'uint96[2]',
      },
    ],
    name: 'updateTrancheAssets',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export class Pool__factory {
  static readonly abi = _abi
  static createInterface(): PoolInterface {
    return new utils.Interface(_abi) as PoolInterface
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Pool {
    return new Contract(address, _abi, signerOrProvider) as Pool
  }
}
