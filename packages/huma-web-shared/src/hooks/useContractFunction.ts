import { Contract, ContractReceipt } from '@ethersproject/contracts'
import {
  TransactionReceipt,
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'
import {
  getTransactionErrorFromError,
  getTransactionErrorFromHash,
  increaseGasLimit,
  TxStateType,
} from '@huma-finance/shared'
import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

interface TxStateManagement {
  state: TxStateType
  txHash: string
  txReceipt: ContractReceipt | undefined
  loading: boolean
  failReason: string
}

const txInitManagement: TxStateManagement = {
  state: TxStateType.New,
  txHash: '',
  txReceipt: undefined,
  loading: false,
  failReason: '',
}

export const txAtom = atomWithReset(txInitManagement)
export const sendTxAtom = atom(
  (get) => get(txAtom),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (
    get,
    set,
    payload: {
      contract: Contract
      method: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params: any[]
      provider: Web3Provider | undefined
    },
  ) => {
    const { contract, method, params, provider } = payload
    try {
      set(txAtom, { ...get(txAtom), loading: true })
      const gasLimit = await contract.estimateGas[method](...params)
      set(txAtom, {
        ...get(txAtom),
        state: TxStateType.Signing,
      })
      const tx: TransactionResponse = await contract[method](...params, {
        gasLimit: increaseGasLimit(gasLimit),
      })
      set(txAtom, {
        ...get(txAtom),
        state: TxStateType.Confirming,
        txHash: tx.hash,
      })

      const txReceipt: TransactionReceipt = await tx.wait()
      set(txAtom, { ...get(txAtom), txReceipt })

      // tx was mined successfully
      if (txReceipt.status === 1) {
        set(txAtom, {
          ...get(txAtom),
          state: TxStateType.Success,
          loading: false,
        })
      } else {
        let failReason = 'Send transaction failed'
        if (provider) {
          const failReasonReturned = await getTransactionErrorFromHash(
            provider,
            tx.hash,
          )
          if (failReasonReturned) {
            failReason = failReasonReturned
          }
        }
        set(txAtom, {
          ...get(txAtom),
          state: TxStateType.Failed,
          loading: false,
          failReason,
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e)
      const contractErrorMessage = getTransactionErrorFromError(e)
      if (contractErrorMessage) {
        set(txAtom, {
          ...get(txAtom),
          state: TxStateType.Failed,
          loading: false,
          failReason: contractErrorMessage,
        })
        return
      }

      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        set(txAtom, {
          ...get(txAtom),
          state: TxStateType.Denied,
          loading: false,
          failReason: 'User has rejected the transaction',
        })
        return
      }

      set(txAtom, {
        ...get(txAtom),
        state: TxStateType.Invalid,
        loading: false,
        failReason: e.reason || `Send transaction failed`,
      })
    }
  },
)
