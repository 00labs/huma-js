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

export type CreditConfigStruct = {
  creditLimit: PromiseOrValue<BigNumberish>
  committedAmount: PromiseOrValue<BigNumberish>
  periodDuration: PromiseOrValue<BigNumberish>
  numOfPeriods: PromiseOrValue<BigNumberish>
  yieldInBps: PromiseOrValue<BigNumberish>
  advanceRateInBps: PromiseOrValue<BigNumberish>
  revolving: PromiseOrValue<boolean>
  autoApproval: PromiseOrValue<boolean>
}

export type CreditConfigStructOutput = [
  BigNumber,
  BigNumber,
  number,
  number,
  number,
  number,
  boolean,
  boolean,
] & {
  creditLimit: BigNumber
  committedAmount: BigNumber
  periodDuration: number
  numOfPeriods: number
  yieldInBps: number
  advanceRateInBps: number
  revolving: boolean
  autoApproval: boolean
}

export interface CreditManagerInterface extends utils.Interface {
  functions: {
    'calendar()': FunctionFragment
    'credit()': FunctionFragment
    'creditBorrowerMap(bytes32)': FunctionFragment
    'getCreditConfig(bytes32)': FunctionFragment
    'humaConfig()': FunctionFragment
    'initialize(address)': FunctionFragment
    'isDefaultReady(bytes32)': FunctionFragment
    'onlyCreditBorrower(bytes32,address)': FunctionFragment
    'poolConfig()': FunctionFragment
    'setPoolConfig(address)': FunctionFragment
    'updatePoolConfigData()': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'calendar'
      | 'credit'
      | 'creditBorrowerMap'
      | 'getCreditConfig'
      | 'humaConfig'
      | 'initialize'
      | 'isDefaultReady'
      | 'onlyCreditBorrower'
      | 'poolConfig'
      | 'setPoolConfig'
      | 'updatePoolConfigData',
  ): FunctionFragment

  encodeFunctionData(functionFragment: 'calendar', values?: undefined): string
  encodeFunctionData(functionFragment: 'credit', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'creditBorrowerMap',
    values: [PromiseOrValue<BytesLike>],
  ): string
  encodeFunctionData(
    functionFragment: 'getCreditConfig',
    values: [PromiseOrValue<BytesLike>],
  ): string
  encodeFunctionData(functionFragment: 'humaConfig', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'initialize',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(
    functionFragment: 'isDefaultReady',
    values: [PromiseOrValue<BytesLike>],
  ): string
  encodeFunctionData(
    functionFragment: 'onlyCreditBorrower',
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>],
  ): string
  encodeFunctionData(functionFragment: 'poolConfig', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'setPoolConfig',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(
    functionFragment: 'updatePoolConfigData',
    values?: undefined,
  ): string

  decodeFunctionResult(functionFragment: 'calendar', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'credit', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'creditBorrowerMap',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'getCreditConfig',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'humaConfig', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'isDefaultReady',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'onlyCreditBorrower',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'poolConfig', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'setPoolConfig',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'updatePoolConfigData',
    data: BytesLike,
  ): Result

  events: {
    'CommittedCreditStarted(bytes32)': EventFragment
    'CreditConfigChanged(bytes32,uint256,uint256,uint8,uint256,uint256,bool,uint256,bool)': EventFragment
    'CreditPaused(bytes32)': EventFragment
    'DefaultTriggered(bytes32,uint256,uint256,uint256,address)': EventFragment
    'Initialized(uint8)': EventFragment
    'PoolConfigCacheUpdated(address)': EventFragment
    'PoolConfigChanged(address,address)': EventFragment
    'RemainingPeriodsExtended(bytes32,uint256,uint256,uint256,uint256,address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'CommittedCreditStarted'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'CreditConfigChanged'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'CreditPaused'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'DefaultTriggered'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'Initialized'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolConfigCacheUpdated'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'PoolConfigChanged'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'RemainingPeriodsExtended'): EventFragment
}

export interface CommittedCreditStartedEventObject {
  creditHash: string
}
export type CommittedCreditStartedEvent = TypedEvent<
  [string],
  CommittedCreditStartedEventObject
>

export type CommittedCreditStartedEventFilter =
  TypedEventFilter<CommittedCreditStartedEvent>

export interface CreditConfigChangedEventObject {
  creditHash: string
  creditLimit: BigNumber
  committedAmount: BigNumber
  periodDuration: number
  numOfPeriods: BigNumber
  yieldInBps: BigNumber
  revolving: boolean
  advanceRateInBps: BigNumber
  autoApproval: boolean
}
export type CreditConfigChangedEvent = TypedEvent<
  [
    string,
    BigNumber,
    BigNumber,
    number,
    BigNumber,
    BigNumber,
    boolean,
    BigNumber,
    boolean,
  ],
  CreditConfigChangedEventObject
>

export type CreditConfigChangedEventFilter =
  TypedEventFilter<CreditConfigChangedEvent>

export interface CreditPausedEventObject {
  creditHash: string
}
export type CreditPausedEvent = TypedEvent<[string], CreditPausedEventObject>

export type CreditPausedEventFilter = TypedEventFilter<CreditPausedEvent>

export interface DefaultTriggeredEventObject {
  creditHash: string
  principalLoss: BigNumber
  yieldLoss: BigNumber
  feesLoss: BigNumber
  by: string
}
export type DefaultTriggeredEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, string],
  DefaultTriggeredEventObject
>

export type DefaultTriggeredEventFilter =
  TypedEventFilter<DefaultTriggeredEvent>

export interface InitializedEventObject {
  version: number
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>

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

export interface RemainingPeriodsExtendedEventObject {
  creditHash: string
  oldRemainingPeriods: BigNumber
  newRemainingPeriods: BigNumber
  oldMaturityDate: BigNumber
  newMaturityDate: BigNumber
  by: string
}
export type RemainingPeriodsExtendedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber, string],
  RemainingPeriodsExtendedEventObject
>

export type RemainingPeriodsExtendedEventFilter =
  TypedEventFilter<RemainingPeriodsExtendedEvent>

export interface CreditManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: CreditManagerInterface

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
    calendar(overrides?: CallOverrides): Promise<[string]>

    credit(overrides?: CallOverrides): Promise<[string]>

    creditBorrowerMap(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<[string]>

    getCreditConfig(
      creditHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<[CreditConfigStructOutput]>

    humaConfig(overrides?: CallOverrides): Promise<[string]>

    initialize(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    isDefaultReady(
      creditHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<[boolean] & { isDefault: boolean }>

    onlyCreditBorrower(
      creditHash: PromiseOrValue<BytesLike>,
      borrower: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[void]>

    poolConfig(overrides?: CallOverrides): Promise<[string]>

    setPoolConfig(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    updatePoolConfigData(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>
  }

  calendar(overrides?: CallOverrides): Promise<string>

  credit(overrides?: CallOverrides): Promise<string>

  creditBorrowerMap(
    arg0: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides,
  ): Promise<string>

  getCreditConfig(
    creditHash: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides,
  ): Promise<CreditConfigStructOutput>

  humaConfig(overrides?: CallOverrides): Promise<string>

  initialize(
    _poolConfig: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  isDefaultReady(
    creditHash: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides,
  ): Promise<boolean>

  onlyCreditBorrower(
    creditHash: PromiseOrValue<BytesLike>,
    borrower: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<void>

  poolConfig(overrides?: CallOverrides): Promise<string>

  setPoolConfig(
    _poolConfig: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  updatePoolConfigData(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  callStatic: {
    calendar(overrides?: CallOverrides): Promise<string>

    credit(overrides?: CallOverrides): Promise<string>

    creditBorrowerMap(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<string>

    getCreditConfig(
      creditHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<CreditConfigStructOutput>

    humaConfig(overrides?: CallOverrides): Promise<string>

    initialize(
      _poolConfig: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    isDefaultReady(
      creditHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<boolean>

    onlyCreditBorrower(
      creditHash: PromiseOrValue<BytesLike>,
      borrower: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    poolConfig(overrides?: CallOverrides): Promise<string>

    setPoolConfig(
      _poolConfig: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    updatePoolConfigData(overrides?: CallOverrides): Promise<void>
  }

  filters: {
    'CommittedCreditStarted(bytes32)'(
      creditHash?: PromiseOrValue<BytesLike> | null,
    ): CommittedCreditStartedEventFilter
    CommittedCreditStarted(
      creditHash?: PromiseOrValue<BytesLike> | null,
    ): CommittedCreditStartedEventFilter

    'CreditConfigChanged(bytes32,uint256,uint256,uint8,uint256,uint256,bool,uint256,bool)'(
      creditHash?: PromiseOrValue<BytesLike> | null,
      creditLimit?: null,
      committedAmount?: null,
      periodDuration?: null,
      numOfPeriods?: null,
      yieldInBps?: null,
      revolving?: null,
      advanceRateInBps?: null,
      autoApproval?: null,
    ): CreditConfigChangedEventFilter
    CreditConfigChanged(
      creditHash?: PromiseOrValue<BytesLike> | null,
      creditLimit?: null,
      committedAmount?: null,
      periodDuration?: null,
      numOfPeriods?: null,
      yieldInBps?: null,
      revolving?: null,
      advanceRateInBps?: null,
      autoApproval?: null,
    ): CreditConfigChangedEventFilter

    'CreditPaused(bytes32)'(
      creditHash?: PromiseOrValue<BytesLike> | null,
    ): CreditPausedEventFilter
    CreditPaused(
      creditHash?: PromiseOrValue<BytesLike> | null,
    ): CreditPausedEventFilter

    'DefaultTriggered(bytes32,uint256,uint256,uint256,address)'(
      creditHash?: PromiseOrValue<BytesLike> | null,
      principalLoss?: null,
      yieldLoss?: null,
      feesLoss?: null,
      by?: null,
    ): DefaultTriggeredEventFilter
    DefaultTriggered(
      creditHash?: PromiseOrValue<BytesLike> | null,
      principalLoss?: null,
      yieldLoss?: null,
      feesLoss?: null,
      by?: null,
    ): DefaultTriggeredEventFilter

    'Initialized(uint8)'(version?: null): InitializedEventFilter
    Initialized(version?: null): InitializedEventFilter

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

    'RemainingPeriodsExtended(bytes32,uint256,uint256,uint256,uint256,address)'(
      creditHash?: PromiseOrValue<BytesLike> | null,
      oldRemainingPeriods?: null,
      newRemainingPeriods?: null,
      oldMaturityDate?: null,
      newMaturityDate?: null,
      by?: null,
    ): RemainingPeriodsExtendedEventFilter
    RemainingPeriodsExtended(
      creditHash?: PromiseOrValue<BytesLike> | null,
      oldRemainingPeriods?: null,
      newRemainingPeriods?: null,
      oldMaturityDate?: null,
      newMaturityDate?: null,
      by?: null,
    ): RemainingPeriodsExtendedEventFilter
  }

  estimateGas: {
    calendar(overrides?: CallOverrides): Promise<BigNumber>

    credit(overrides?: CallOverrides): Promise<BigNumber>

    creditBorrowerMap(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    getCreditConfig(
      creditHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    humaConfig(overrides?: CallOverrides): Promise<BigNumber>

    initialize(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    isDefaultReady(
      creditHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    onlyCreditBorrower(
      creditHash: PromiseOrValue<BytesLike>,
      borrower: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    poolConfig(overrides?: CallOverrides): Promise<BigNumber>

    setPoolConfig(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    updatePoolConfigData(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>
  }

  populateTransaction: {
    calendar(overrides?: CallOverrides): Promise<PopulatedTransaction>

    credit(overrides?: CallOverrides): Promise<PopulatedTransaction>

    creditBorrowerMap(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    getCreditConfig(
      creditHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    humaConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>

    initialize(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    isDefaultReady(
      creditHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    onlyCreditBorrower(
      creditHash: PromiseOrValue<BytesLike>,
      borrower: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    poolConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>

    setPoolConfig(
      _poolConfig: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    updatePoolConfigData(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>
  }
}
