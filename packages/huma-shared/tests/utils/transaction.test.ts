/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber, ethers } from 'ethers'

import {
  decodeLogs,
  getTransactionErrorFromError,
  getTransactionErrorFromHash,
  increaseGasLimit,
  isTxFailed,
  TxStateType,
} from '../../src/utils/transaction'

describe('isTxFailed', () => {
  it('returns true for failed transaction states', () => {
    expect(isTxFailed(TxStateType.Denied)).toBe(true)
    expect(isTxFailed(TxStateType.Invalid)).toBe(true)
    expect(isTxFailed(TxStateType.Failed)).toBe(true)
  })

  it('returns false for successful transaction states', () => {
    expect(isTxFailed(TxStateType.Success)).toBe(false)
    expect(isTxFailed(TxStateType.New)).toBe(false)
    expect(isTxFailed(TxStateType.GasEstimating)).toBe(false)
    expect(isTxFailed(TxStateType.Signing)).toBe(false)
    expect(isTxFailed(TxStateType.Confirming)).toBe(false)
  })
})

describe('increaseGasLimit', () => {
  it('returns the increased gas limit', () => {
    const estimatedGasLimit = BigNumber.from(100000)
    const increasedGasLimit = increaseGasLimit(estimatedGasLimit)
    const expectedGasLimit = BigNumber.from(150000)

    expect(increasedGasLimit).toEqual(expectedGasLimit)
  })

  it('throws an error when estimatedGasLimit is empty or NaN', () => {
    expect(() => increaseGasLimit(undefined as any)).toThrow(
      'Estimated gas limited error.',
    )
    expect(() => increaseGasLimit(null as any)).toThrow(
      'Estimated gas limited error.',
    )
  })
})

describe('getTransactionErrorFromHash', () => {
  it(`returns the contract error message when the code matches`, async () => {
    const sameValueErrorCode = '0x0811ff09'
    const provider = {
      getTransaction: jest.fn().mockResolvedValue({
        from: '0x123',
        to: '0x456',
        data: '0xabcdef',
        gasLimit: 100000,
        blockNumber: 12345,
      }),
      call: jest.fn().mockResolvedValue(sameValueErrorCode),
    } as any
    const txHash = '0x1234567890abcdef'

    const result = await getTransactionErrorFromHash(provider, txHash)

    expect(provider.getTransaction).toHaveBeenCalledWith(txHash)
    expect(provider.call).toHaveBeenCalledWith(
      { from: '0x123', to: '0x456', data: '0xabcdef', gasLimit: 100000 },
      12345,
    )
    expect(result).toBe('Same value')
  })

  it('returns the common error message when no contract error is found', async () => {
    const provider = {
      getTransaction: jest.fn().mockResolvedValue({
        from: '0x123',
        to: '0x456',
        data: '0xabcdef',
        gasLimit: 100000,
        blockNumber: 12345,
      }),
      call: jest.fn().mockResolvedValue('0x'),
    } as any
    const txHash = '0x1234567890abcdef'
    const expectedErrorMessage = 'Send transaction failed'

    const result = await getTransactionErrorFromHash(provider, txHash)

    expect(provider.getTransaction).toHaveBeenCalledWith(txHash)
    expect(provider.call).toHaveBeenCalledWith(
      { from: '0x123', to: '0x456', data: '0xabcdef', gasLimit: 100000 },
      12345,
    )
    expect(result).toBe(expectedErrorMessage)
  })

  it('returns the common error message when an error occurs', async () => {
    const provider = {
      getTransaction: jest.fn().mockRejectedValueOnce(new Error()),
      call: jest.fn().mockResolvedValue('0x'),
    } as any
    const txHash = '0x1234567890abcdef'
    const expectedErrorMessage = 'Send transaction failed'

    const result = await getTransactionErrorFromHash(provider, txHash)

    expect(provider.getTransaction).toHaveBeenCalledWith(txHash)
    expect(result).toBe(expectedErrorMessage)
  })
})

describe('getTransactionErrorFromError', () => {
  it('returns the contract error message when the error contains the error code', () => {
    const sameValueErrorCode = '0x0811ff09'
    const error1 = {
      error: {
        data: {
          originalError: {
            data: sameValueErrorCode,
          },
        },
      },
    }
    const error2 = {
      error: {
        data: {
          data: sameValueErrorCode,
        },
      },
    }
    const expectedErrorMessage = 'Same value'

    const result1 = getTransactionErrorFromError(error1)
    expect(result1).toBe(expectedErrorMessage)
    const result2 = getTransactionErrorFromError(error2)
    expect(result2).toBe(expectedErrorMessage)
  })

  it('returns null when the error does not contain the error code', () => {
    const error = {
      error: {
        data: {},
      },
    }

    const result = getTransactionErrorFromError(error)

    expect(result).toBeNull()
  })

  it('returns null when the error code does not match any contract error', () => {
    const error = {
      error: {
        data: {
          originalError: {
            data: '0xabcdef1234567890',
          },
        },
      },
    }

    const result = getTransactionErrorFromError(error)

    expect(result).toBeNull()
  })
})

describe('decodeLogs', () => {
  it('decodes the logs using the provided ABI', () => {
    const mockLog = {
      eventFragment: 'EventFragment',
      name: 'name',
      signature: 'signature',
      topic: 'topic',
      args: 'args',
    } as any
    ethers.utils.Interface.prototype.parseLog = jest.fn(() => mockLog)

    const txlogs = [
      {
        address: '0x123',
        topics: ['0x456'],
        data: '0xabcdef',
      },
    ]
    const abi = [
      {
        name: 'EventName',
        type: 'event',
        inputs: [
          {
            name: 'param1',
            type: 'uint256',
          },
          {
            name: 'param2',
            type: 'string',
          },
        ],
      },
    ]

    const result = decodeLogs(txlogs, abi)

    expect(result).toEqual([mockLog])
  })

  it('handles errors when decoding logs', () => {
    console.error = jest.fn()
    const txlogs = [
      {
        address: '0x123',
        topics: ['0x456'],
        data: '0xabcdef',
      },
    ]
    const abi = [
      {
        name: 'EventName',
        type: 'event',
        inputs: [
          {
            name: 'param1',
            type: 'uint256',
          },
          {
            name: 'param2',
            type: 'string',
          },
        ],
      },
    ]

    // Mock the necessary functions to simulate an error
    ethers.utils.Interface.prototype.parseLog = jest.fn(() => {
      throw new Error('Failed to parse log')
    })

    const result = decodeLogs(txlogs, abi)

    expect(result).toEqual([])
    expect(console.error).toHaveBeenCalledWith(new Error('Failed to parse log'))
  })
})
