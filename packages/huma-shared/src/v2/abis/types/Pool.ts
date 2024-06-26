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
  PayableOverrides,
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
    'closePool()': FunctionFragment
    'credit()': FunctionFragment
    'creditManager()': FunctionFragment
    'currentTranchesAssets()': FunctionFragment
    'disablePool()': FunctionFragment
    'distributeLoss(uint256)': FunctionFragment
    'distributeLossRecovery(uint256)': FunctionFragment
    'distributeProfit(uint256)': FunctionFragment
    'enablePool()': FunctionFragment
    'epochManager()': FunctionFragment
    'feeManager()': FunctionFragment
    'getFirstLossCovers()': FunctionFragment
    'getTrancheAvailableCap(uint256)': FunctionFragment
    'initialize(address)': FunctionFragment
    'isPoolClosed()': FunctionFragment
    'isPoolOn()': FunctionFragment
    'juniorTranche()': FunctionFragment
    'poolConfig()': FunctionFragment
    'poolSafe()': FunctionFragment
    'proxiableUUID()': FunctionFragment
    'readyForFirstLossCoverWithdrawal()': FunctionFragment
    'seniorTranche()': FunctionFragment
    'setPoolConfig(address)': FunctionFragment
    'setReadyForFirstLossCoverWithdrawal(bool)': FunctionFragment
    'totalAssets()': FunctionFragment
    'trancheTotalAssets(uint256)': FunctionFragment
    'tranchesAssets()': FunctionFragment
    'tranchesLosses()': FunctionFragment
    'tranchesPolicy()': FunctionFragment
    'updatePoolConfigData()': FunctionFragment
    'updateTranchesAssets(uint96[2])': FunctionFragment
    'upgradeTo(address)': FunctionFragment
    'upgradeToAndCall(address,bytes)': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'closePool'
      | 'credit'
      | 'creditManager'
      | 'currentTranchesAssets'
      | 'disablePool'
      | 'distributeLoss'
      | 'distributeLossRecovery'
      | 'distributeProfit'
      | 'enablePool'
      | 'epochManager'
      | 'feeManager'
      | 'getFirstLossCovers'
      | 'getTrancheAvailableCap'
      | 'initialize'
      | 'isPoolClosed'
      | 'isPoolOn'
      | 'juniorTranche'
      | 'poolConfig'
      | 'poolSafe'
      | 'proxiableUUID'
      | 'readyForFirstLossCoverWithdrawal'
      | 'seniorTranche'
      | 'setPoolConfig'
      | 'setReadyForFirstLossCoverWithdrawal'
      | 'totalAssets'
      | 'trancheTotalAssets'
      | 'tranchesAssets'
      | 'tranchesLosses'
      | 'tranchesPolicy'
      | 'updatePoolConfigData'
      | 'updateTranchesAssets'
      | 'upgradeTo'
      | 'upgradeToAndCall',
  ): FunctionFragment

  encodeFunctionData(functionFragment: 'closePool', values?: undefined): string
  encodeFunctionData(functionFragment: 'credit', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'creditManager',
    values?: undefined,
  ): string
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
    functionFragment: 'getFirstLossCovers',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'getTrancheAvailableCap',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'initialize',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(
    functionFragment: 'isPoolClosed',
    values?: undefined,
  ): string
  encodeFunctionData(functionFragment: 'isPoolOn', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'juniorTranche',
    values?: undefined,
  ): string
  encodeFunctionData(functionFragment: 'poolConfig', values?: undefined): string
  encodeFunctionData(functionFragment: 'poolSafe', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'proxiableUUID',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'readyForFirstLossCoverWithdrawal',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'seniorTranche',
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
  encodeFunctionData(
    functionFragment: 'upgradeTo',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(
    functionFragment: 'upgradeToAndCall',
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>],
  ): string

  decodeFunctionResult(functionFragment: 'closePool', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'credit', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'creditManager',
    data: BytesLike,
  ): Result
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
    functionFragment: 'getFirstLossCovers',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'getTrancheAvailableCap',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'isPoolClosed',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'isPoolOn', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'juniorTranche',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'poolConfig', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'poolSafe', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'proxiableUUID',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'readyForFirstLossCoverWithdrawal',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'seniorTranche',
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
  decodeFunctionResult(functionFragment: 'upgradeTo', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'upgradeToAndCall',
    data: BytesLike,
  ): Result

  events: {
    'AdminChanged(address,address)': EventFragment
    'BeaconUpgraded(address)': EventFragment
    'FirstLossCoverWithdrawalReadinessChanged(address,bool)': EventFragment
    'Initialized(uint8)': EventFragment
    'LossDistributed(uint256,uint256,uint256,uint256,uint256)': EventFragment
    'LossRecoveryDistributed(uint256,uint256,uint256,uint256,uint256)': EventFragment
    'PoolClosed(address)': EventFragment
    'PoolConfigCacheUpdated(address)': EventFragment
    'PoolConfigChanged(address,address)': EventFragment
    'PoolDisabled(address)': EventFragment
    'PoolEnabled(address)': EventFragment
    'ProfitDistributed(uint256,uint256,uint256)': EventFragment
    'Upgraded(address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'AdminChanged'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'BeaconUpgraded'): EventFragment
  getEvent(
    nameOrSignatureOrTopic: 'FirstLossCoverWithdrawalReadinessChanged',
  ): EventFragment
  getEvent(nameOrSignatureOrTopic: 'Initialized'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LossDistributed'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LossRecoveryDistributed'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolClosed'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolConfigCacheUpdated'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolConfigChanged'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolDisabled'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolEnabled'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'ProfitDistributed'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'Upgraded'): EventFragment
}

export interface AdminChangedEventObject {
  previousAdmin: string
  newAdmin: string
}
export type AdminChangedEvent = TypedEvent<
  [string, string],
  AdminChangedEventObject
>

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>

export interface BeaconUpgradedEventObject {
  beacon: string
}
export type BeaconUpgradedEvent = TypedEvent<
  [string],
  BeaconUpgradedEventObject
>

export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>

export interface FirstLossCoverWithdrawalReadinessChangedEventObject {
  by: string
  ready: boolean
}
export type FirstLossCoverWithdrawalReadinessChangedEvent = TypedEvent<
  [string, boolean],
  FirstLossCoverWithdrawalReadinessChangedEventObject
>

export type FirstLossCoverWithdrawalReadinessChangedEventFilter =
  TypedEventFilter<FirstLossCoverWithdrawalReadinessChangedEvent>

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

export interface PoolClosedEventObject {
  by: string
}
export type PoolClosedEvent = TypedEvent<[string], PoolClosedEventObject>

export type PoolClosedEventFilter = TypedEventFilter<PoolClosedEvent>

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

export interface UpgradedEventObject {
  implementation: string
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>

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
    closePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    credit(overrides?: CallOverrides): Promise<[string]>

    creditManager(overrides?: CallOverrides): Promise<[string]>

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

    getFirstLossCovers(overrides?: CallOverrides): Promise<[string[]]>

    getTrancheAvailableCap(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { availableCap: BigNumber }>

    initialize(
      poolConfig_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    isPoolClosed(
      overrides?: CallOverrides,
    ): Promise<[boolean] & { isClosed: boolean }>

    isPoolOn(overrides?: CallOverrides): Promise<[boolean] & { isOn: boolean }>

    juniorTranche(overrides?: CallOverrides): Promise<[string]>

    poolConfig(overrides?: CallOverrides): Promise<[string]>

    poolSafe(overrides?: CallOverrides): Promise<[string]>

    proxiableUUID(overrides?: CallOverrides): Promise<[string]>

    readyForFirstLossCoverWithdrawal(
      overrides?: CallOverrides,
    ): Promise<[boolean]>

    seniorTranche(overrides?: CallOverrides): Promise<[string]>

    setPoolConfig(
      poolConfig_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    setReadyForFirstLossCoverWithdrawal(
      isReady: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    totalAssets(overrides?: CallOverrides): Promise<[BigNumber]>

    trancheTotalAssets(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>

    tranchesAssets(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber] & {
        seniorTotalAssets: BigNumber
        juniorTotalAssets: BigNumber
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

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>
  }

  closePool(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  credit(overrides?: CallOverrides): Promise<string>

  creditManager(overrides?: CallOverrides): Promise<string>

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

  getFirstLossCovers(overrides?: CallOverrides): Promise<string[]>

  getTrancheAvailableCap(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  initialize(
    poolConfig_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  isPoolClosed(overrides?: CallOverrides): Promise<boolean>

  isPoolOn(overrides?: CallOverrides): Promise<boolean>

  juniorTranche(overrides?: CallOverrides): Promise<string>

  poolConfig(overrides?: CallOverrides): Promise<string>

  poolSafe(overrides?: CallOverrides): Promise<string>

  proxiableUUID(overrides?: CallOverrides): Promise<string>

  readyForFirstLossCoverWithdrawal(overrides?: CallOverrides): Promise<boolean>

  seniorTranche(overrides?: CallOverrides): Promise<string>

  setPoolConfig(
    poolConfig_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  setReadyForFirstLossCoverWithdrawal(
    isReady: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  totalAssets(overrides?: CallOverrides): Promise<BigNumber>

  trancheTotalAssets(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  tranchesAssets(overrides?: CallOverrides): Promise<
    [BigNumber, BigNumber] & {
      seniorTotalAssets: BigNumber
      juniorTotalAssets: BigNumber
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

  upgradeTo(
    newImplementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  upgradeToAndCall(
    newImplementation: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  callStatic: {
    closePool(overrides?: CallOverrides): Promise<void>

    credit(overrides?: CallOverrides): Promise<string>

    creditManager(overrides?: CallOverrides): Promise<string>

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

    getFirstLossCovers(overrides?: CallOverrides): Promise<string[]>

    getTrancheAvailableCap(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    initialize(
      poolConfig_: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    isPoolClosed(overrides?: CallOverrides): Promise<boolean>

    isPoolOn(overrides?: CallOverrides): Promise<boolean>

    juniorTranche(overrides?: CallOverrides): Promise<string>

    poolConfig(overrides?: CallOverrides): Promise<string>

    poolSafe(overrides?: CallOverrides): Promise<string>

    proxiableUUID(overrides?: CallOverrides): Promise<string>

    readyForFirstLossCoverWithdrawal(
      overrides?: CallOverrides,
    ): Promise<boolean>

    seniorTranche(overrides?: CallOverrides): Promise<string>

    setPoolConfig(
      poolConfig_: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    setReadyForFirstLossCoverWithdrawal(
      isReady: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<void>

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>

    trancheTotalAssets(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    tranchesAssets(overrides?: CallOverrides): Promise<
      [BigNumber, BigNumber] & {
        seniorTotalAssets: BigNumber
        juniorTotalAssets: BigNumber
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

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<void>
  }

  filters: {
    'AdminChanged(address,address)'(
      previousAdmin?: null,
      newAdmin?: null,
    ): AdminChangedEventFilter
    AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter

    'BeaconUpgraded(address)'(
      beacon?: PromiseOrValue<string> | null,
    ): BeaconUpgradedEventFilter
    BeaconUpgraded(
      beacon?: PromiseOrValue<string> | null,
    ): BeaconUpgradedEventFilter

    'FirstLossCoverWithdrawalReadinessChanged(address,bool)'(
      by?: PromiseOrValue<string> | null,
      ready?: null,
    ): FirstLossCoverWithdrawalReadinessChangedEventFilter
    FirstLossCoverWithdrawalReadinessChanged(
      by?: PromiseOrValue<string> | null,
      ready?: null,
    ): FirstLossCoverWithdrawalReadinessChangedEventFilter

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

    'PoolClosed(address)'(
      by?: PromiseOrValue<string> | null,
    ): PoolClosedEventFilter
    PoolClosed(by?: PromiseOrValue<string> | null): PoolClosedEventFilter

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

    'Upgraded(address)'(
      implementation?: PromiseOrValue<string> | null,
    ): UpgradedEventFilter
    Upgraded(
      implementation?: PromiseOrValue<string> | null,
    ): UpgradedEventFilter
  }

  estimateGas: {
    closePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    credit(overrides?: CallOverrides): Promise<BigNumber>

    creditManager(overrides?: CallOverrides): Promise<BigNumber>

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

    getFirstLossCovers(overrides?: CallOverrides): Promise<BigNumber>

    getTrancheAvailableCap(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    initialize(
      poolConfig_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    isPoolClosed(overrides?: CallOverrides): Promise<BigNumber>

    isPoolOn(overrides?: CallOverrides): Promise<BigNumber>

    juniorTranche(overrides?: CallOverrides): Promise<BigNumber>

    poolConfig(overrides?: CallOverrides): Promise<BigNumber>

    poolSafe(overrides?: CallOverrides): Promise<BigNumber>

    proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>

    readyForFirstLossCoverWithdrawal(
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    seniorTranche(overrides?: CallOverrides): Promise<BigNumber>

    setPoolConfig(
      poolConfig_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    setReadyForFirstLossCoverWithdrawal(
      isReady: PromiseOrValue<boolean>,
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

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>
  }

  populateTransaction: {
    closePool(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    credit(overrides?: CallOverrides): Promise<PopulatedTransaction>

    creditManager(overrides?: CallOverrides): Promise<PopulatedTransaction>

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

    getFirstLossCovers(overrides?: CallOverrides): Promise<PopulatedTransaction>

    getTrancheAvailableCap(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    initialize(
      poolConfig_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    isPoolClosed(overrides?: CallOverrides): Promise<PopulatedTransaction>

    isPoolOn(overrides?: CallOverrides): Promise<PopulatedTransaction>

    juniorTranche(overrides?: CallOverrides): Promise<PopulatedTransaction>

    poolConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>

    poolSafe(overrides?: CallOverrides): Promise<PopulatedTransaction>

    proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>

    readyForFirstLossCoverWithdrawal(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    seniorTranche(overrides?: CallOverrides): Promise<PopulatedTransaction>

    setPoolConfig(
      poolConfig_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    setReadyForFirstLossCoverWithdrawal(
      isReady: PromiseOrValue<boolean>,
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

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>
  }
}
