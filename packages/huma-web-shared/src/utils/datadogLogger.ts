import { datadogRum } from '@datadog/browser-rum'
import {
  ChainEnum,
  POOL_NAME,
  POOL_TYPE,
  SolanaChainEnum,
  StellarChainEnum,
} from '@huma-finance/shared'

const ddLoggerEnabled =
  import.meta.env.VITE_DATADOG_APPLICATION_ID &&
  import.meta.env.VITE_DATADOG_CLIENT_TOKEN

export const initRUMLogger = () => {
  if (ddLoggerEnabled) {
    datadogRum.init({
      applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID!,
      clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN!,
      site: 'datadoghq.com',
      service: 'huma-dapp',
      env: 'production',
      version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      trackViewsManually: true,
    })
  }
}

export const logActionRaw = (action: string, context?: Object) => {
  if (ddLoggerEnabled) {
    datadogRum.addAction(action, { ...context })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logErrorRaw = (err: any, context?: Object) => {
  if (ddLoggerEnabled) {
    datadogRum.addError(err, { ...context })
  }
  console.error(err)
}

export const logTimingRaw = (name: string, time?: number | undefined) => {
  if (ddLoggerEnabled) {
    datadogRum.addTiming(name, time)
  }
}

export type LoggingContext = {
  flow: 'Supply' | 'Withdraw'
  poolName: POOL_NAME
  poolType: POOL_TYPE
  chainId: ChainEnum | SolanaChainEnum | StellarChainEnum
  chainType: 'EVM' | 'Solana' | 'Stellar'
}

// Explicitly defining the actions type so we can funnel
// based on expected values and avoid typos
export type LoggingActions =
  | 'StartFlow'
  | 'ExitFlow'
  | 'Evaluation'
  | 'ApproveLender'
  | 'ChooseTranche'
  | 'ChooseAmount'
  | 'ApproveAllowance'
  | 'Transaction'
  | 'SigningTransaction'
  | 'SendingTransaction'
  | 'TransactionError'
  | 'TransactionSuccess'
  | 'ConfirmTransfer'
  | 'ShowRetryScreenDueToExpiration'
  | 'UnknownError'
  | 'Success'
  | 'PointsEarned'
  | 'SetInitialStep'

export class LoggingContextHelper {
  #context: LoggingContext | null

  constructor(context?: LoggingContext) {
    this.#context = context ?? null
  }

  logAction(action: LoggingActions, additionalContext: Object) {
    logActionRaw(
      this.#context
        ? `${this.#context.chainType}-${this.#context.flow}-${action}`
        : action,
      this.#context
        ? { ...this.#context, ...additionalContext }
        : additionalContext,
    )
  }

  logError(err: Error) {
    logErrorRaw(err, this.#context ?? {})
  }

  static logTiming(name: string, time?: number) {
    logTimingRaw(name, time)
  }
}

export const setSessionInfo = (info: {
  account?: string
  evmAddress?: string
  solanaAddress?: string
  stellarAddress?: string
  chainId?: number
}) => {
  const { account, evmAddress, solanaAddress, stellarAddress } = info
  if (!ddLoggerEnabled) {
    return
  }

  if (account) {
    datadogRum.setUserProperty('id', account)
    datadogRum.setUserProperty('account', account)
  }

  if (evmAddress) {
    datadogRum.setUserProperty('evmAddress', evmAddress)
  }

  if (solanaAddress) {
    datadogRum.setUserProperty('solanaAddress', solanaAddress)
  }

  if (stellarAddress) {
    datadogRum.setUserProperty('stellarAddress', stellarAddress)
  }
}
