/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers'
import type { Provider } from '@ethersproject/providers'
import type {
  ReceivableBackedCreditLine,
  ReceivableBackedCreditLineInterface,
} from '../ReceivableBackedCreditLine'

const _abi = [
  {
    inputs: [],
    name: 'attemptedDrawdownForNonrevolvingLine',
    type: 'error',
  },
  {
    inputs: [],
    name: 'creditLineExceeded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'creditLineNotInGoodStandingState',
    type: 'error',
  },
  {
    inputs: [],
    name: 'creditLineNotInStateForMakingPayment',
    type: 'error',
  },
  {
    inputs: [],
    name: 'creditLineNotInStateForMakingPrincipalPayment',
    type: 'error',
  },
  {
    inputs: [],
    name: 'creditNotInStateForDrawdown',
    type: 'error',
  },
  {
    inputs: [],
    name: 'drawdownNotAllowedInLatePaymentGracePeriod',
    type: 'error',
  },
  {
    inputs: [],
    name: 'firstDrawdownTooSoon',
    type: 'error',
  },
  {
    inputs: [],
    name: 'insufficientBorrowerFirstLossCover',
    type: 'error',
  },
  {
    inputs: [],
    name: 'insufficientReceivableAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'notAuthorizedCaller',
    type: 'error',
  },
  {
    inputs: [],
    name: 'notBorrower',
    type: 'error',
  },
  {
    inputs: [],
    name: 'notReceivableOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'paymentDetectionServiceAccountRequired',
    type: 'error',
  },
  {
    inputs: [],
    name: 'todo',
    type: 'error',
  },
  {
    inputs: [],
    name: 'zeroAddressProvided',
    type: 'error',
  },
  {
    inputs: [],
    name: 'zeroAmountProvided',
    type: 'error',
  },
  {
    inputs: [],
    name: 'zeroReceivableIdProvided',
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
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newDueDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountDue',
        type: 'uint256',
      },
    ],
    name: 'BillRefreshed',
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
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'CreditClosedAfterPayOff',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
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
        name: 'aprInBps',
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
        name: 'remainingPeriods',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'CreditInitiated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldCreditLimit',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newCreditLimit',
        type: 'uint256',
      },
    ],
    name: 'CreditLineChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'borrowAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'netAmountToBorrower',
        type: 'uint256',
      },
    ],
    name: 'DrawdownMade',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'receivableId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'receivableAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'DrawdownMadeWithReceivable',
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
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'yieldDuePaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'principalDuePaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unbilledPrincipalPaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'yieldPastDuePaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lateFeePaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'principalPastDuePaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'PaymentMade',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'receivableId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'PaymentMadeWithReceivable',
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
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nextDueDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'principalDue',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unbilledPrincipal',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'principalDuePaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unbilledPrincipalPaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'PrincipalPaymentMade',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'receivableId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'PrincipalPaymentMadeWithReceivable',
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
    name: 'creditManager',
    outputs: [
      {
        internalType: 'contract ICreditManager',
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
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint96',
            name: 'receivableAmount',
            type: 'uint96',
          },
          {
            internalType: 'uint64',
            name: 'receivableId',
            type: 'uint64',
          },
        ],
        internalType: 'struct ReceivableInput',
        name: 'receivableInput',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'drawdownWithReceivable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dueManager',
    outputs: [
      {
        internalType: 'contract ICreditDueManager',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'firstLossCover',
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
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
    ],
    name: 'getCreditRecord',
    outputs: [
      {
        components: [
          {
            internalType: 'uint96',
            name: 'unbilledPrincipal',
            type: 'uint96',
          },
          {
            internalType: 'uint64',
            name: 'nextDueDate',
            type: 'uint64',
          },
          {
            internalType: 'uint96',
            name: 'nextDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'yieldDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'totalPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint16',
            name: 'missedPeriods',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'remainingPeriods',
            type: 'uint16',
          },
          {
            internalType: 'enum CreditState',
            name: 'state',
            type: 'uint8',
          },
        ],
        internalType: 'struct CreditRecord',
        name: '',
        type: 'tuple',
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
    name: 'getDueDetail',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'lateFeeUpdatedDate',
            type: 'uint64',
          },
          {
            internalType: 'uint96',
            name: 'lateFee',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'principalPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'yieldPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'committed',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'accrued',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'paid',
            type: 'uint96',
          },
        ],
        internalType: 'struct DueDetail',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'getDueInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint96',
            name: 'unbilledPrincipal',
            type: 'uint96',
          },
          {
            internalType: 'uint64',
            name: 'nextDueDate',
            type: 'uint64',
          },
          {
            internalType: 'uint96',
            name: 'nextDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'yieldDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'totalPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint16',
            name: 'missedPeriods',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'remainingPeriods',
            type: 'uint16',
          },
          {
            internalType: 'enum CreditState',
            name: 'state',
            type: 'uint8',
          },
        ],
        internalType: 'struct CreditRecord',
        name: 'cr',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'lateFeeUpdatedDate',
            type: 'uint64',
          },
          {
            internalType: 'uint96',
            name: 'lateFee',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'principalPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'yieldPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'committed',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'accrued',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'paid',
            type: 'uint96',
          },
        ],
        internalType: 'struct DueDetail',
        name: 'dd',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'getNextBillRefreshDate',
    outputs: [
      {
        internalType: 'uint256',
        name: 'refreshDate',
        type: 'uint256',
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
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'receivableId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'makePaymentWithReceivable',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountPaid',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'paidoff',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'paymentReceivableId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'paymentAmount',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint96',
            name: 'receivableAmount',
            type: 'uint96',
          },
          {
            internalType: 'uint64',
            name: 'receivableId',
            type: 'uint64',
          },
        ],
        internalType: 'struct ReceivableInput',
        name: 'drawdownReceivableInput',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'drawdownAmount',
        type: 'uint256',
      },
    ],
    name: 'makePrincipalPaymentAndDrawdownWithReceivable',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountPaid',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'paidoff',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'receivableId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'makePrincipalPaymentWithReceivable',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountPaid',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'paidoff',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'poolSafe',
    outputs: [
      {
        internalType: 'contract IPoolSafe',
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
      {
        components: [
          {
            internalType: 'uint96',
            name: 'unbilledPrincipal',
            type: 'uint96',
          },
          {
            internalType: 'uint64',
            name: 'nextDueDate',
            type: 'uint64',
          },
          {
            internalType: 'uint96',
            name: 'nextDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'yieldDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'totalPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint16',
            name: 'missedPeriods',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'remainingPeriods',
            type: 'uint16',
          },
          {
            internalType: 'enum CreditState',
            name: 'state',
            type: 'uint8',
          },
        ],
        internalType: 'struct CreditRecord',
        name: 'cr',
        type: 'tuple',
      },
    ],
    name: 'setCreditRecord',
    outputs: [],
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
        internalType: 'bytes32',
        name: 'creditHash',
        type: 'bytes32',
      },
      {
        components: [
          {
            internalType: 'uint96',
            name: 'unbilledPrincipal',
            type: 'uint96',
          },
          {
            internalType: 'uint64',
            name: 'nextDueDate',
            type: 'uint64',
          },
          {
            internalType: 'uint96',
            name: 'nextDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'yieldDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'totalPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint16',
            name: 'missedPeriods',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'remainingPeriods',
            type: 'uint16',
          },
          {
            internalType: 'enum CreditState',
            name: 'state',
            type: 'uint8',
          },
        ],
        internalType: 'struct CreditRecord',
        name: 'cr',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'lateFeeUpdatedDate',
            type: 'uint64',
          },
          {
            internalType: 'uint96',
            name: 'lateFee',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'principalPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'yieldPastDue',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'committed',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'accrued',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'paid',
            type: 'uint96',
          },
        ],
        internalType: 'struct DueDetail',
        name: 'dd',
        type: 'tuple',
      },
    ],
    name: 'updateDueInfo',
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

export class ReceivableBackedCreditLine__factory {
  static readonly abi = _abi
  static createInterface(): ReceivableBackedCreditLineInterface {
    return new utils.Interface(_abi) as ReceivableBackedCreditLineInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): ReceivableBackedCreditLine {
    return new Contract(
      address,
      _abi,
      signerOrProvider,
    ) as ReceivableBackedCreditLine
  }
}
