/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers'
import type { Provider } from '@ethersproject/providers'
import type { CreditManager, CreditManagerInterface } from '../CreditManager'

const _abi = [
  {
    inputs: [],
    name: 'notBorrower',
    type: 'error',
  },
  {
    inputs: [],
    name: 'zeroAddressProvided',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
    ],
    name: 'CommittedCreditStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'creditLimit',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'committedAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum PayPeriodDuration',
        name: 'periodDuration',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numOfPeriods',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'yieldInBps',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'revolving',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'advanceRateInBps',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'autoApproval',
        type: 'bool',
      },
    ],
    name: 'CreditConfigChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
    ],
    name: 'CreditPaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'principalLoss',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'yieldLoss',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feesLoss',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'DefaultTriggered',
    type: 'event',
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
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldRemainingPeriods',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newRemainingPeriods',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldMaturityDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newMaturityDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'RemainingPeriodsExtended',
    type: 'event',
  },
  {
    inputs: [],
    name: 'calendar',
    outputs: [
      {
        internalType: 'contract ICalendar',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'credit',
    outputs: [
      {
        internalType: 'contract ICredit',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'creditBorrowerMap',
    outputs: [
      {
        internalType: 'address',
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
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
    ],
    name: 'getCreditConfig',
    outputs: [
      {
        components: [
          {
            internalType: 'uint96',
            name: 'creditLimit',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'committedAmount',
            type: 'uint96',
          },
          {
            internalType: 'enum PayPeriodDuration',
            name: 'periodDuration',
            type: 'uint8',
          },
          {
            internalType: 'uint16',
            name: 'numOfPeriods',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'yieldInBps',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'advanceRateInBps',
            type: 'uint16',
          },
          {
            internalType: 'bool',
            name: 'revolving',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'autoApproval',
            type: 'bool',
          },
        ],
        internalType: 'struct CreditConfig',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'humaConfig',
    outputs: [
      {
        internalType: 'contract HumaConfig',
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
    inputs: [
      {
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
    ],
    name: 'isDefaultReady',
    outputs: [
      {
        internalType: 'bool',
        name: 'isDefault',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'onlyCreditBorrower',
    outputs: [],
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
    inputs: [],
    name: 'updatePoolConfigData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export class CreditManager__factory {
  static readonly abi = _abi
  static createInterface(): CreditManagerInterface {
    return new utils.Interface(_abi) as CreditManagerInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): CreditManager {
    return new Contract(address, _abi, signerOrProvider) as CreditManager
  }
}