import { datadogRum } from '@datadog/browser-rum'
import {
  ChainEnum,
  CHAINS,
  POOL_NAME,
  POOL_TYPE,
  SolanaChainEnum,
  STELLAR_CHAINS,
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
  | 'ConnectWallet'
  | 'KYCKYBApproved'
  | 'AgreementAccepted'
  | 'Accredited'
  | 'CloseNotifi'
  | 'OpenNotifi'
export const logActionRaw = (action: LoggingActions, context?: Object) => {
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
}
export class LoggingContextHelper {
  #context: LoggingContext | null

  constructor(context?: LoggingContext) {
    this.#context = context ?? null
  }

  logAction(action: LoggingActions, additionalContext: Object) {
    logActionRaw(
      action,
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
  const { account, evmAddress, solanaAddress, stellarAddress, chainId } = info
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

  if (chainId) {
    if (Object.values(StellarChainEnum).includes(chainId as number)) {
      datadogRum.setUserProperty('network', STELLAR_CHAINS[chainId]?.name)
    } else if (Object.values(ChainEnum).includes(chainId as number)) {
      datadogRum.setUserProperty('network', CHAINS[chainId]?.name)
    } else if (Object.values(SolanaChainEnum).includes(chainId as number)) {
      datadogRum.setUserProperty(
        'network',
        chainId === SolanaChainEnum.SolanaMainnet // The name on the SolanaChainEnum doesn't include "Solana"
          ? 'SolanaMainnet'
          : 'SolanaTestnet',
      )
    }
  }
}
