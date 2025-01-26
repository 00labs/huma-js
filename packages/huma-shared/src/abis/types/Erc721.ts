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

export interface Erc721Interface extends utils.Interface {
  functions: {
    'approve(address,uint256)': FunctionFragment
    'balanceOf(address)': FunctionFragment
    'baseURI()': FunctionFragment
    'burn(uint256)': FunctionFragment
    'getApproved(uint256)': FunctionFragment
    'isApprovedForAll(address,address)': FunctionFragment
    'mint(uint256)': FunctionFragment
    'name()': FunctionFragment
    'owner()': FunctionFragment
    'ownerOf(uint256)': FunctionFragment
    'pause()': FunctionFragment
    'paused()': FunctionFragment
    'proxyInfo(address)': FunctionFragment
    'punkContract()': FunctionFragment
    'registerProxy()': FunctionFragment
    'renounceOwnership()': FunctionFragment
    'safeTransferFrom(address,address,uint256)': FunctionFragment
    'safeTransferFrom(address,address,uint256,bytes)': FunctionFragment
    'setApprovalForAll(address,bool)': FunctionFragment
    'setBaseURI(string)': FunctionFragment
    'supportsInterface(bytes4)': FunctionFragment
    'symbol()': FunctionFragment
    'tokenByIndex(uint256)': FunctionFragment
    'tokenOfOwnerByIndex(address,uint256)': FunctionFragment
    'tokenURI(uint256)': FunctionFragment
    'totalSupply()': FunctionFragment
    'transferFrom(address,address,uint256)': FunctionFragment
    'transferOwnership(address)': FunctionFragment
    'unpause()': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'approve'
      | 'balanceOf'
      | 'baseURI'
      | 'burn'
      | 'getApproved'
      | 'isApprovedForAll'
      | 'mint'
      | 'name'
      | 'owner'
      | 'ownerOf'
      | 'pause'
      | 'paused'
      | 'proxyInfo'
      | 'punkContract'
      | 'registerProxy'
      | 'renounceOwnership'
      | 'safeTransferFrom(address,address,uint256)'
      | 'safeTransferFrom(address,address,uint256,bytes)'
      | 'setApprovalForAll'
      | 'setBaseURI'
      | 'supportsInterface'
      | 'symbol'
      | 'tokenByIndex'
      | 'tokenOfOwnerByIndex'
      | 'tokenURI'
      | 'totalSupply'
      | 'transferFrom'
      | 'transferOwnership'
      | 'unpause',
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'approve',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'balanceOf',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(functionFragment: 'baseURI', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'burn',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'getApproved',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'isApprovedForAll',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string
  encodeFunctionData(
    functionFragment: 'mint',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(functionFragment: 'name', values?: undefined): string
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'ownerOf',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(functionFragment: 'pause', values?: undefined): string
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'proxyInfo',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(
    functionFragment: 'punkContract',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'registerProxy',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'renounceOwnership',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'safeTransferFrom(address,address,uint256)',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string
  encodeFunctionData(
    functionFragment: 'safeTransferFrom(address,address,uint256,bytes)',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
    ],
  ): string
  encodeFunctionData(
    functionFragment: 'setApprovalForAll',
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>],
  ): string
  encodeFunctionData(
    functionFragment: 'setBaseURI',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(
    functionFragment: 'supportsInterface',
    values: [PromiseOrValue<BytesLike>],
  ): string
  encodeFunctionData(functionFragment: 'symbol', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'tokenByIndex',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'tokenOfOwnerByIndex',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'tokenURI',
    values: [PromiseOrValue<BigNumberish>],
  ): string
  encodeFunctionData(
    functionFragment: 'totalSupply',
    values?: undefined,
  ): string
  encodeFunctionData(
    functionFragment: 'transferFrom',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string
  encodeFunctionData(
    functionFragment: 'transferOwnership',
    values: [PromiseOrValue<string>],
  ): string
  encodeFunctionData(functionFragment: 'unpause', values?: undefined): string

  decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'baseURI', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'burn', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getApproved', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'isApprovedForAll',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'mint', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'ownerOf', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'pause', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'proxyInfo', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'punkContract',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'registerProxy',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'renounceOwnership',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'safeTransferFrom(address,address,uint256)',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'safeTransferFrom(address,address,uint256,bytes)',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'setApprovalForAll',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'setBaseURI', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'supportsInterface',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'tokenByIndex',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'tokenOfOwnerByIndex',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'tokenURI', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'transferFrom',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'transferOwnership',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'unpause', data: BytesLike): Result

  events: {
    'Approval(address,address,uint256)': EventFragment
    'ApprovalForAll(address,address,bool)': EventFragment
    'OwnershipTransferred(address,address)': EventFragment
    'Paused(address)': EventFragment
    'ProxyRegistered(address,address)': EventFragment
    'Transfer(address,address,uint256)': EventFragment
    'Unpaused(address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'Approval'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'ApprovalForAll'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'ProxyRegistered'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment
}

export interface ApprovalEventObject {
  owner: string
  approved: string
  tokenId: BigNumber
}
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  ApprovalEventObject
>

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>

export interface ApprovalForAllEventObject {
  owner: string
  operator: string
  approved: boolean
}
export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  ApprovalForAllEventObject
>

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>

export interface OwnershipTransferredEventObject {
  previousOwner: string
  newOwner: string
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>

export interface PausedEventObject {
  account: string
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>

export type PausedEventFilter = TypedEventFilter<PausedEvent>

export interface ProxyRegisteredEventObject {
  user: string
  proxy: string
}
export type ProxyRegisteredEvent = TypedEvent<
  [string, string],
  ProxyRegisteredEventObject
>

export type ProxyRegisteredEventFilter = TypedEventFilter<ProxyRegisteredEvent>

export interface TransferEventObject {
  from: string
  to: string
  tokenId: BigNumber
}
export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  TransferEventObject
>

export type TransferEventFilter = TypedEventFilter<TransferEvent>

export interface UnpausedEventObject {
  account: string
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>

export interface Erc721 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: Erc721Interface

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
    approve(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>

    baseURI(overrides?: CallOverrides): Promise<[string]>

    burn(
      punkIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    getApproved(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string]>

    isApprovedForAll(
      owner: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>

    mint(
      punkIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    name(overrides?: CallOverrides): Promise<[string]>

    owner(overrides?: CallOverrides): Promise<[string]>

    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string]>

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    paused(overrides?: CallOverrides): Promise<[boolean]>

    proxyInfo(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string]>

    punkContract(overrides?: CallOverrides): Promise<[string]>

    registerProxy(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    'safeTransferFrom(address,address,uint256)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    'safeTransferFrom(address,address,uint256,bytes)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    setApprovalForAll(
      to: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    setBaseURI(
      baseUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>

    symbol(overrides?: CallOverrides): Promise<[string]>

    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>

    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string]>

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>

    transferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>
  }

  approve(
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  balanceOf(
    owner: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  baseURI(overrides?: CallOverrides): Promise<string>

  burn(
    punkIndex: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  getApproved(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>

  isApprovedForAll(
    owner: PromiseOrValue<string>,
    operator: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<boolean>

  mint(
    punkIndex: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  name(overrides?: CallOverrides): Promise<string>

  owner(overrides?: CallOverrides): Promise<string>

  ownerOf(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  paused(overrides?: CallOverrides): Promise<boolean>

  proxyInfo(
    user: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<string>

  punkContract(overrides?: CallOverrides): Promise<string>

  registerProxy(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  'safeTransferFrom(address,address,uint256)'(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  'safeTransferFrom(address,address,uint256,bytes)'(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  setApprovalForAll(
    to: PromiseOrValue<string>,
    approved: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  setBaseURI(
    baseUri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides,
  ): Promise<boolean>

  symbol(overrides?: CallOverrides): Promise<string>

  tokenByIndex(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  tokenOfOwnerByIndex(
    owner: PromiseOrValue<string>,
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>

  tokenURI(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>

  transferFrom(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>

  callStatic: {
    approve(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    baseURI(overrides?: CallOverrides): Promise<string>

    burn(
      punkIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>

    getApproved(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>

    isApprovedForAll(
      owner: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<boolean>

    mint(
      punkIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>

    name(overrides?: CallOverrides): Promise<string>

    owner(overrides?: CallOverrides): Promise<string>

    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>

    pause(overrides?: CallOverrides): Promise<void>

    paused(overrides?: CallOverrides): Promise<boolean>

    proxyInfo(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>

    punkContract(overrides?: CallOverrides): Promise<string>

    registerProxy(overrides?: CallOverrides): Promise<void>

    renounceOwnership(overrides?: CallOverrides): Promise<void>

    'safeTransferFrom(address,address,uint256)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>

    'safeTransferFrom(address,address,uint256,bytes)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<void>

    setApprovalForAll(
      to: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<void>

    setBaseURI(
      baseUri: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<boolean>

    symbol(overrides?: CallOverrides): Promise<string>

    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>

    transferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>

    unpause(overrides?: CallOverrides): Promise<void>
  }

  filters: {
    'Approval(address,address,uint256)'(
      owner?: PromiseOrValue<string> | null,
      approved?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
    ): ApprovalEventFilter
    Approval(
      owner?: PromiseOrValue<string> | null,
      approved?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
    ): ApprovalEventFilter

    'ApprovalForAll(address,address,bool)'(
      owner?: PromiseOrValue<string> | null,
      operator?: PromiseOrValue<string> | null,
      approved?: null,
    ): ApprovalForAllEventFilter
    ApprovalForAll(
      owner?: PromiseOrValue<string> | null,
      operator?: PromiseOrValue<string> | null,
      approved?: null,
    ): ApprovalForAllEventFilter

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter

    'Paused(address)'(account?: null): PausedEventFilter
    Paused(account?: null): PausedEventFilter

    'ProxyRegistered(address,address)'(
      user?: null,
      proxy?: null,
    ): ProxyRegisteredEventFilter
    ProxyRegistered(user?: null, proxy?: null): ProxyRegisteredEventFilter

    'Transfer(address,address,uint256)'(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
    ): TransferEventFilter
    Transfer(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
    ): TransferEventFilter

    'Unpaused(address)'(account?: null): UnpausedEventFilter
    Unpaused(account?: null): UnpausedEventFilter
  }

  estimateGas: {
    approve(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    baseURI(overrides?: CallOverrides): Promise<BigNumber>

    burn(
      punkIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    getApproved(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    isApprovedForAll(
      owner: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    mint(
      punkIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    name(overrides?: CallOverrides): Promise<BigNumber>

    owner(overrides?: CallOverrides): Promise<BigNumber>

    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    paused(overrides?: CallOverrides): Promise<BigNumber>

    proxyInfo(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    punkContract(overrides?: CallOverrides): Promise<BigNumber>

    registerProxy(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    'safeTransferFrom(address,address,uint256)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    'safeTransferFrom(address,address,uint256,bytes)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    setApprovalForAll(
      to: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    setBaseURI(
      baseUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    symbol(overrides?: CallOverrides): Promise<BigNumber>

    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>

    transferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>
  }

  populateTransaction: {
    approve(
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    balanceOf(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    baseURI(overrides?: CallOverrides): Promise<PopulatedTransaction>

    burn(
      punkIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    getApproved(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    isApprovedForAll(
      owner: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    mint(
      punkIndex: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>

    ownerOf(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>

    proxyInfo(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    punkContract(overrides?: CallOverrides): Promise<PopulatedTransaction>

    registerProxy(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    'safeTransferFrom(address,address,uint256)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    'safeTransferFrom(address,address,uint256,bytes)'(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    setApprovalForAll(
      to: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    setBaseURI(
      baseUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>

    tokenByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    tokenOfOwnerByIndex(
      owner: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>

    transferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>
  }
}
