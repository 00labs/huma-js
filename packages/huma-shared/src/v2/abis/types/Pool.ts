/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/providers'
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from './common'

export interface PoolInterface extends utils.Interface {
  functions: {
    'currentTranchesAssets()': FunctionFragment
    'disablePool()': FunctionFragment
    'distributeLoss(uint256)': FunctionFragment
    'distributeLossRecovery(uint256)': FunctionFragment
    'distributeProfit(uint256)': FunctionFragment
    'enablePool()': FunctionFragment
    'epochManager()': FunctionFragment
    'feeManager()': FunctionFragment
    'getFirstLossCoverAvailableCap(address,uint256)': FunctionFragment
    'getFirstLossCovers()': FunctionFragment
    'getReservedAssetsForFirstLossCovers()': FunctionFragment
    'initialize(address)': FunctionFragment
    'isPoolOn()': FunctionFragment
    'poolConfig()': FunctionFragment
    'poolSafe()': FunctionFragment
    'readyForFirstLossCoverWithdrawal()': FunctionFragment
    'setPoolConfig(address)': FunctionFragment
    'setReadyForFirstLossCoverWithdrawal(bool)': FunctionFragment
    'syncFirstLossCovers()': FunctionFragment
    'totalAssets()': FunctionFragment
    'trancheTotalAssets(uint256)': FunctionFragment
    'tranchesAssets()': FunctionFragment
    'tranchesLosses()': FunctionFragment
    'tranchesPolicy()': FunctionFragment
    'updatePoolConfigData()': FunctionFragment
    'updateTranchesAssets(uint96[2])': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'currentTranchesAssets'
      | 'disablePool'
      | 'distributeLoss'
      | 'distributeLossRecovery'
      | 'distributeProfit'
      | 'enablePool'
      | 'epochManager'
      | 'feeManager'
      | 'getFirstLossCoverAvailableCap'
      | 'getFirstLossCovers'
      | 'getReservedAssetsForFirstLossCovers'
      | 'initialize'
      | 'isPoolOn'
      | 'poolConfig'
      | 'poolSafe'
      | 'readyForFirstLossCoverWithdrawal'
      | 'setPoolConfig'
      | 'setReadyForFirstLossCoverWithdrawal'
      | 'syncFirstLossCovers'
      | 'totalAssets'
      | 'trancheTotalAssets'
      | 'tranchesAssets'
      | 'tranchesLosses'
      | 'tranchesPolicy'
      | 'updatePoolConfigData'
      | 'updateTranchesAssets',
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'currentTranchesAssets',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'disablePool',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'distributeLoss',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'distributeLossRecovery',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'distributeProfit',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(functionFragment: 'enablePool', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'epochManager',
    values?: undefined,
  ): string
  encodeFunctionData(functionFragment: 'feeManager', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'getFirstLossCoverAvailableCap',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'getFirstLossCovers',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'getReservedAssetsForFirstLossCovers',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'initialize',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(functionFragment: 'isPoolOn', values?: undefined): string
  encodeFunctionData(functionFragment: 'poolConfig', values?: undefined): string
  encodeFunctionData(functionFragment: 'poolSafe', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'readyForFirstLossCoverWithdrawal',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'setPoolConfig',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(
    functionFragment: 'setReadyForFirstLossCoverWithdrawal',
    values: [PromiseOrValue<boolean>],
  ): string
  encodeFunctionData(
    functionFragment: 'syncFirstLossCovers',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'totalAssets',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'trancheTotalAssets',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'tranchesAssets',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'tranchesLosses',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'tranchesPolicy',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'updatePoolConfigData',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'updateTranchesAssets',
    values: [[PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]],
  ): string

  decodeFunctionResult(
    functionFragment: 'currentTranchesAssets',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'disablePool', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'distributeLoss',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'distributeLossRecovery',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'distributeProfit',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'enablePool', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'epochManager',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'feeManager', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'getFirstLossCoverAvailableCap',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'getFirstLossCovers',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'getReservedAssetsForFirstLossCovers',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'isPoolOn', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'poolConfig', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'poolSafe', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'readyForFirstLossCoverWithdrawal',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'setPoolConfig',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'setReadyForFirstLossCoverWithdrawal',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'syncFirstLossCovers',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'totalAssets', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'trancheTotalAssets',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'tranchesAssets',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'tranchesLosses',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'tranchesPolicy',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'updatePoolConfigData',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'updateTranchesAssets',
    data: BytesLike,
  ): Result

  events: {
    'Initialized(uint8)': EventFragment
    'LossDistributed(uint256,uint256,uint256,uint256,uint256)': EventFragment
    'LossRecoveryDistributed(uint256,uint256,uint256,uint256,uint256)': EventFragment
    'PoolAssetsRefreshed(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)': EventFragment
    'PoolConfigCacheUpdated(address)': EventFragment
    'PoolConfigChanged(address,address)': EventFragment
    'PoolDisabled(address)': EventFragment
    'PoolEnabled(address)': EventFragment
    'PoolReadyForFirstLossCoverWithdrawal(address,bool)': EventFragment
    'ProfitDistributed(uint256,uint256,uint256)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'Initialized'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LossDistributed'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LossRecoveryDistributed'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolAssetsRefreshed'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolConfigCacheUpdated'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolConfigChanged'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolDisabled'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolEnabled'): EventFragment
  getEvent(
    nameOrSignatureOrTopic: 'PoolReadyForFirstLossCoverWithdrawal',
  ): EventFragment
  getEvent(nameOrSignatureOrTopic: 'ProfitDistributed'): EventFragment
}

export interface InitializedEventObject {
  version: number
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>

export interface LossDistributedEventObject {
  loss: BigNumber
  seniorTotalAssets: BigNumber
  juniorTotalAssets: BigNumber
  seniorTotalLoss: BigNumber
  juniorTotalLoss: BigNumber
}
export type LossDistributedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
  LossDistributedEventObject
>

export type LossDistributedEventFilter = TypedEventFilter<LossDistributedEvent>

export interface LossRecoveryDistributedEventObject {
  lossRecovery: BigNumber
  seniorTotalAssets: BigNumber
  juniorTotalAssets: BigNumber
  seniorTotalLoss: BigNumber
  juniorTotalLoss: BigNumber
}
export type LossRecoveryDistributedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
  LossRecoveryDistributedEventObject
>

export type LossRecoveryDistributedEventFilter =
  TypedEventFilter<LossRecoveryDistributedEvent>

export interface PoolAssetsRefreshedEventObject {
  refreshedTimestamp: BigNumber
  profit: BigNumber
  loss: BigNumber
  lossRecovery: BigNumber
  seniorTotalAssets: BigNumber
  juniorTotalAssets: BigNumber
  seniorTotalLoss: BigNumber
  juniorTotalLoss: BigNumber
}
export type PoolAssetsRefreshedEvent = TypedEvent<
  [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
  ],
  PoolAssetsRefreshedEventObject
>

export type PoolAssetsRefreshedEventFilter =
  TypedEventFilter<PoolAssetsRefreshedEvent>

export interface PoolConfigCacheUpdatedEventObject {
  poolConfig: string
}
export type PoolConfigCacheUpdatedEvent = TypedEvent<
  [string],
  PoolConfigCacheUpdatedEventObject
>

export type PoolConfigCacheUpdatedEventFilter =
  TypedEventFilter<PoolConfigCacheUpdatedEvent>

export interface PoolConfigChangedEventObject {
  newPoolConfig: string
  oldPoolConfig: string
}
export type PoolConfigChangedEvent = TypedEvent<
  [string, string],
  PoolConfigChangedEventObject
>

export type PoolConfigChangedEventFilter =
  TypedEventFilter<PoolConfigChangedEvent>

export interface PoolDisabledEventObject {
  by: string
}
export type PoolDisabledEvent = TypedEvent<[string], PoolDisabledEventObject>

export type PoolDisabledEventFilter = TypedEventFilter<PoolDisabledEvent>

export interface PoolEnabledEventObject {
  by: string
}
export type PoolEnabledEvent = TypedEvent<[string], PoolEnabledEventObject>

export type PoolEnabledEventFilter = TypedEventFilter<PoolEnabledEvent>

export interface PoolReadyForFirstLossCoverWithdrawalEventObject {
  by: string
  ready: boolean
}
export type PoolReadyForFirstLossCoverWithdrawalEvent = TypedEvent<
  [string, boolean],
  PoolReadyForFirstLossCoverWithdrawalEventObject
>

export type PoolReadyForFirstLossCoverWithdrawalEventFilter =
  TypedEventFilter<PoolReadyForFirstLossCoverWithdrawalEvent>

export interface ProfitDistributedEventObject {
  profit: BigNumber
  seniorTotalAssets: BigNumber
  juniorTotalAssets: BigNumber
}
export type ProfitDistributedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  ProfitDistributedEventObject
>

export type ProfitDistributedEventFilter =
  TypedEventFilter<ProfitDistributedEvent>

export interface Pool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: PoolInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    currentTranchesAssets(
      overrides?: CallOverrides,
    ): Promise<[[BigNumber, BigNumber]] & { assets: [BigNumber, BigNumber] }>

    disablePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    distributeLoss(
      loss: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    distributeLossRecovery(
      lossRecovery: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    distributeProfit(
      profit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    enablePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    epochManager(overrides?: CallOverrides): Promise<[string]>

    feeManager(overrides?: CallOverrides): Promise<[string]>

    getFirstLossCoverAvailableCap(
      coverAddress: PromiseOrValue<string>,
      poolAssets: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { availableCap: BigNumber }>

    getFirstLossCovers(overrides?: CallOverrides): Promise<[string[]]>

    getReservedAssetsForFirstLossCovers(
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { reservedAssets: BigNumber }>

    initialize(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    isPoolOn(
      overrides?: CallOverrides,
    ): Promise<[boolean] & { status: boolean }>

    poolConfig(overrides?: CallOverrides): Promise<[string]>

    poolSafe(overrides?: CallOverrides): Promise<[string]>

    readyForFirstLossCoverWithdrawal(
      overrides?: CallOverrides,
    ): Promise<[boolean]>

    setPoolConfig(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    setReadyForFirstLossCoverWithdrawal(
      ready: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    syncFirstLossCovers(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    totalAssets(overrides?: CallOverrides): Promise<[BigNumber]>

    trancheTotalAssets(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>

    tranchesAssets(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        seniorTotalAssets: BigNumber
        juniorTotalAssets: BigNumber
        lastProfitDistributedTime: BigNumber
      }
    >

    tranchesLosses(
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber] & { seniorLoss: BigNumber; juniorLoss: BigNumber }
    >

    tranchesPolicy(overrides?: CallOverrides): Promise<[string]>

    updatePoolConfigData(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    updateTranchesAssets(
      assets: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>
  }

  currentTranchesAssets(
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber]>

  disablePool(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  distributeLoss(
    loss: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  distributeLossRecovery(
    lossRecovery: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  distributeProfit(
    profit: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  enablePool(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  epochManager(overrides?: CallOverrides): Promise<string>

  feeManager(overrides?: CallOverrides): Promise<string>

  getFirstLossCoverAvailableCap(
    coverAddress: PromiseOrValue<string>,
    poolAssets: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  getFirstLossCovers(overrides?: CallOverrides): Promise<string[]>

  getReservedAssetsForFirstLossCovers(
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  initialize(
    _poolConfig: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  isPoolOn(overrides?: CallOverrides): Promise<boolean>

  poolConfig(overrides?: CallOverrides): Promise<string>

  poolSafe(overrides?: CallOverrides): Promise<string>

  readyForFirstLossCoverWithdrawal(overrides?: CallOverrides): Promise<boolean>

  setPoolConfig(
    _poolConfig: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  setReadyForFirstLossCoverWithdrawal(
    ready: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  syncFirstLossCovers(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  totalAssets(overrides?: CallOverrides): Promise<BigNumber>

  trancheTotalAssets(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  tranchesAssets(overrides?: CallOverrides): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      seniorTotalAssets: BigNumber
      juniorTotalAssets: BigNumber
      lastProfitDistributedTime: BigNumber
    }
  >

  tranchesLosses(
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber] & { seniorLoss: BigNumber; juniorLoss: BigNumber }
  >

  tranchesPolicy(overrides?: CallOverrides): Promise<string>

  updatePoolConfigData(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  updateTranchesAssets(
    assets: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  callStatic: {
    currentTranchesAssets(
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber]>

    disablePool(overrides?: CallOverrides): Promise<void>

    distributeLoss(
      loss: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>

    distributeLossRecovery(
      lossRecovery: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>

    distributeProfit(
      profit: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>

    enablePool(overrides?: CallOverrides): Promise<void>

    epochManager(overrides?: CallOverrides): Promise<string>

    feeManager(overrides?: CallOverrides): Promise<string>

    getFirstLossCoverAvailableCap(
      coverAddress: PromiseOrValue<string>,
      poolAssets: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    getFirstLossCovers(overrides?: CallOverrides): Promise<string[]>

    getReservedAssetsForFirstLossCovers(
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    initialize(
      _poolConfig: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    isPoolOn(overrides?: CallOverrides): Promise<boolean>

    poolConfig(overrides?: CallOverrides): Promise<string>

    poolSafe(overrides?: CallOverrides): Promise<string>

    readyForFirstLossCoverWithdrawal(
      overrides?: CallOverrides,
    ): Promise<boolean>

    setPoolConfig(
      _poolConfig: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    setReadyForFirstLossCoverWithdrawal(
      ready: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<void>

    syncFirstLossCovers(overrides?: CallOverrides): Promise<void>

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>

    trancheTotalAssets(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    tranchesAssets(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        seniorTotalAssets: BigNumber
        juniorTotalAssets: BigNumber
        lastProfitDistributedTime: BigNumber
      }
    >

    tranchesLosses(
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber] & { seniorLoss: BigNumber; juniorLoss: BigNumber }
    >

    tranchesPolicy(overrides?: CallOverrides): Promise<string>

    updatePoolConfigData(overrides?: CallOverrides): Promise<void>

    updateTranchesAssets(
      assets: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: CallOverrides,
    ): Promise<void>
  }

  filters: {
    'Initialized(uint8)'(version?: null): InitializedEventFilter
    Initialized(version?: null): InitializedEventFilter

    'LossDistributed(uint256,uint256,uint256,uint256,uint256)'(
      loss?: null,
      seniorTotalAssets?: null,
      juniorTotalAssets?: null,
      seniorTotalLoss?: null,
      juniorTotalLoss?: null,
    ): LossDistributedEventFilter
    LossDistributed(
      loss?: null,
      seniorTotalAssets?: null,
      juniorTotalAssets?: null,
      seniorTotalLoss?: null,
      juniorTotalLoss?: null,
    ): LossDistributedEventFilter

    'LossRecoveryDistributed(uint256,uint256,uint256,uint256,uint256)'(
      lossRecovery?: null,
      seniorTotalAssets?: null,
      juniorTotalAssets?: null,
      seniorTotalLoss?: null,
      juniorTotalLoss?: null,
    ): LossRecoveryDistributedEventFilter
    LossRecoveryDistributed(
      lossRecovery?: null,
      seniorTotalAssets?: null,
      juniorTotalAssets?: null,
      seniorTotalLoss?: null,
      juniorTotalLoss?: null,
    ): LossRecoveryDistributedEventFilter

    'PoolAssetsRefreshed(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)'(
      refreshedTimestamp?: null,
      profit?: null,
      loss?: null,
      lossRecovery?: null,
      seniorTotalAssets?: null,
      juniorTotalAssets?: null,
      seniorTotalLoss?: null,
      juniorTotalLoss?: null,
    ): PoolAssetsRefreshedEventFilter
    PoolAssetsRefreshed(
      refreshedTimestamp?: null,
      profit?: null,
      loss?: null,
      lossRecovery?: null,
      seniorTotalAssets?: null,
      juniorTotalAssets?: null,
      seniorTotalLoss?: null,
      juniorTotalLoss?: null,
    ): PoolAssetsRefreshedEventFilter

    'PoolConfigCacheUpdated(address)'(
      poolConfig?: PromiseOrValue<string> | null,
    ): PoolConfigCacheUpdatedEventFilter
    PoolConfigCacheUpdated(
      poolConfig?: PromiseOrValue<string> | null,
    ): PoolConfigCacheUpdatedEventFilter

    'PoolConfigChanged(address,address)'(
      newPoolConfig?: PromiseOrValue<string> | null,
      oldPoolConfig?: PromiseOrValue<string> | null,
    ): PoolConfigChangedEventFilter
    PoolConfigChanged(
      newPoolConfig?: PromiseOrValue<string> | null,
      oldPoolConfig?: PromiseOrValue<string> | null,
    ): PoolConfigChangedEventFilter

    'PoolDisabled(address)'(
      by?: PromiseOrValue<string> | null,
    ): PoolDisabledEventFilter
    PoolDisabled(by?: PromiseOrValue<string> | null): PoolDisabledEventFilter

    'PoolEnabled(address)'(
      by?: PromiseOrValue<string> | null,
    ): PoolEnabledEventFilter
    PoolEnabled(by?: PromiseOrValue<string> | null): PoolEnabledEventFilter

    'PoolReadyForFirstLossCoverWithdrawal(address,bool)'(
      by?: PromiseOrValue<string> | null,
      ready?: null,
    ): PoolReadyForFirstLossCoverWithdrawalEventFilter
    PoolReadyForFirstLossCoverWithdrawal(
      by?: PromiseOrValue<string> | null,
      ready?: null,
    ): PoolReadyForFirstLossCoverWithdrawalEventFilter

    'ProfitDistributed(uint256,uint256,uint256)'(
      profit?: null,
      seniorTotalAssets?: null,
      juniorTotalAssets?: null,
    ): ProfitDistributedEventFilter
    ProfitDistributed(
      profit?: null,
      seniorTotalAssets?: null,
      juniorTotalAssets?: null,
    ): ProfitDistributedEventFilter
  }

  estimateGas: {
    currentTranchesAssets(overrides?: CallOverrides): Promise<BigNumber>

    disablePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    distributeLoss(
      loss: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    distributeLossRecovery(
      lossRecovery: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    distributeProfit(
      profit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    enablePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    epochManager(overrides?: CallOverrides): Promise<BigNumber>

    feeManager(overrides?: CallOverrides): Promise<BigNumber>

    getFirstLossCoverAvailableCap(
      coverAddress: PromiseOrValue<string>,
      poolAssets: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    getFirstLossCovers(overrides?: CallOverrides): Promise<BigNumber>

    getReservedAssetsForFirstLossCovers(
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    initialize(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    isPoolOn(overrides?: CallOverrides): Promise<BigNumber>

    poolConfig(overrides?: CallOverrides): Promise<BigNumber>

    poolSafe(overrides?: CallOverrides): Promise<BigNumber>

    readyForFirstLossCoverWithdrawal(
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    setPoolConfig(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    setReadyForFirstLossCoverWithdrawal(
      ready: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    syncFirstLossCovers(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>

    trancheTotalAssets(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    tranchesAssets(overrides?: CallOverrides): Promise<BigNumber>

    tranchesLosses(overrides?: CallOverrides): Promise<BigNumber>

    tranchesPolicy(overrides?: CallOverrides): Promise<BigNumber>

    updatePoolConfigData(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    updateTranchesAssets(
      assets: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>
  }

  populateTransaction: {
    currentTranchesAssets(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    disablePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    distributeLoss(
      loss: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    distributeLossRecovery(
      lossRecovery: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    distributeProfit(
      profit: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    enablePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    epochManager(overrides?: CallOverrides): Promise<PopulatedTransaction>

    feeManager(overrides?: CallOverrides): Promise<PopulatedTransaction>

    getFirstLossCoverAvailableCap(
      coverAddress: PromiseOrValue<string>,
      poolAssets: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    getFirstLossCovers(overrides?: CallOverrides): Promise<PopulatedTransaction>

    getReservedAssetsForFirstLossCovers(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    initialize(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    isPoolOn(overrides?: CallOverrides): Promise<PopulatedTransaction>

    poolConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>

    poolSafe(overrides?: CallOverrides): Promise<PopulatedTransaction>

    readyForFirstLossCoverWithdrawal(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    setPoolConfig(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    setReadyForFirstLossCoverWithdrawal(
      ready: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    syncFirstLossCovers(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    totalAssets(overrides?: CallOverrides): Promise<PopulatedTransaction>

    trancheTotalAssets(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    tranchesAssets(overrides?: CallOverrides): Promise<PopulatedTransaction>

    tranchesLosses(overrides?: CallOverrides): Promise<PopulatedTransaction>

    tranchesPolicy(overrides?: CallOverrides): Promise<PopulatedTransaction>

    updatePoolConfigData(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    updateTranchesAssets(
      assets: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>
  }
}