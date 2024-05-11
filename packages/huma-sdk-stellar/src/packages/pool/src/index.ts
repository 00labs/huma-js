import { ContractSpec, Address } from '@stellar/stellar-sdk';
import { Buffer } from "buffer";
import {
  AssembledTransaction,
  ContractClient,
  ContractClientOptions,
} from '@stellar/stellar-sdk/lib/contract_client/index.js';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/lib/contract_client';
import { Result } from '@stellar/stellar-sdk/lib/rust_types/index.js';
export * from '@stellar/stellar-sdk'
export * from '@stellar/stellar-sdk/lib/contract_client/index.js'
export * from '@stellar/stellar-sdk/lib/rust_types/index.js'

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAC2UYACIEXQQL2UMEXG5CBG2F2574AW5IZA37K2H2XYKRDEXFAV5GTI",
  }
} as const

export type ClientDataKey = {tag: "PoolManager", values: void} | {tag: "Credit", values: void};

export type ConfigDataKey = {tag: "PoolName", values: void} | {tag: "UnderlyingToken", values: void} | {tag: "TrancheAddresses", values: void} | {tag: "TranchesPolicyType", values: void} | {tag: "PoolSettings", values: void} | {tag: "LPConfig", values: void} | {tag: "FrontLoadingFeeStructure", values: void} | {tag: "FeeStructure", values: void};


export interface PoolNameChangedEvent {
  name: string;
}


export interface PoolSettingsChangedEvent {
  default_grace_period_days: u32;
  late_payment_grace_period_days: u32;
  max_credit_line: u128;
  min_deposit_amount: u128;
  pay_period_duration: PayPeriodDuration;
  principal_only_payment_allowed: boolean;
}


export interface LPConfigChangedEvent {
  fixed_senior_yield_bps: u32;
  liquidity_cap: u128;
  max_senior_junior_ratio: u32;
  tranches_risk_adjustment_bps: u32;
  withdrawal_lockout_period_days: u32;
}


export interface FrontLoadingFeesChangedEvent {
  front_loading_fee_bps: u32;
  front_loading_fee_flat: u128;
}


export interface FeeStructureChangedEvent {
  late_fee_bps: u32;
  min_principal_rate_bps: u32;
  yield_bps: u32;
}


export interface TrancheChangedEvent {
  index: u32;
  tranche: string;
}


export interface TranchesPolicyTypeChangedEvent {
  policy_type: TranchesPolicyType;
}


/**
 * Event for the distribution of profit in the pool.
 * # Fields:
 * * `profit` - The amount of profit distributed.
 * * `senior_total_assets` - The total amount of senior assets post profit distribution.
 * * `junior_total_assets` - The total amount of junior assets post profit distribution.
 */
export interface ProfitDistributedEvent {
  junior_total_assets: u128;
  profit: u128;
  senior_total_assets: u128;
}


/**
 * Event for the distribution of loss in the pool.
 * # Fields:
 * * `loss` - The amount of loss distributed.
 * * `senior_total_assets` - The total amount of senior assets post loss distribution.
 * * `junior_total_assets` - The total amount of junior assets post loss distribution.
 * * `senior_total_loss` - The total amount of loss the senior tranche suffered post loss distribution.
 * * `junior_total_loss` - The total amount of loss the junior tranche suffered post loss distribution.
 */
export interface LossDistributedEvent {
  junior_total_assets: u128;
  junior_total_loss: u128;
  loss: u128;
  senior_total_assets: u128;
  senior_total_loss: u128;
}


/**
 * Event for the distribution of loss recovery in the pool.
 * # Fields:
 * * `loss_recovery` - The amount of loss recovery distributed.
 * * `senior_total_assets` - The total amount of senior assets post loss recovery distribution.
 * * `junior_total_assets` - The total amount of junior assets post loss recovery distribution.
 * * `senior_total_loss` - The remaining amount of loss the senior tranche suffered post loss recovery distribution.
 * * `junior_total_loss` - The remaining amount of loss the junior tranche suffered post loss recovery distribution.
 */
export interface LossRecoveryDistributedEvent {
  junior_total_assets: u128;
  junior_total_loss: u128;
  loss_recovery: u128;
  senior_total_assets: u128;
  senior_total_loss: u128;
}

export type PoolStorageDataKey = {tag: "Status", values: void} | {tag: "TrancheAssets", values: void} | {tag: "TrancheLosses", values: void} | {tag: "UnprocessedTrancheProfits", values: void};


/**
 * The senior yield tracker has been refreshed.
 * # Fields:
 * * `total_assets` - The total assets in the senior tranche after the refresh.
 * * `unpaid_yield` - The amount of unpaid yield to the senior tranche after the refresh.
 * * `last_updated_date` - The last time the tracker was updated after the refresh.
 */
export interface YieldTrackerRefreshedEvent {
  last_updated_date: u64;
  total_assets: u128;
  unpaid_yield: u128;
}

export type FixedSeniorYieldTranchesPolicyDataKey = {tag: "SeniorYieldTracker", values: void};


export interface SeniorYieldTracker {
  last_updated_date: u64;
  total_assets: u128;
  unpaid_yield: u128;
}


export interface FixedSeniorYieldTranchesPolicy {
  placeholder: boolean;
}


export interface RiskAdjustedTranchesPolicy {
  placeholder: boolean;
}

export type TranchesPolicyType = {tag: "FixedSeniorYield", values: void} | {tag: "RiskAdjusted", values: void};


export interface TrancheLosses {
  losses: Array<u128>;
}

export const Errors = {
  8: {message:""},
  51: {message:""},
  52: {message:""},
  53: {message:""},
  54: {message:""},
  55: {message:""},
  71: {message:""},
  72: {message:""},
  73: {message:""},
  74: {message:""},
  75: {message:""},
  76: {message:""},
  77: {message:""},
  78: {message:""},
  79: {message:""},
  81: {message:""},
  82: {message:""},
  91: {message:""},
  92: {message:""},
  93: {message:""},
  94: {message:""},
  95: {message:""},
  96: {message:""},
  97: {message:""},
  98: {message:""},
  101: {message:""},
  201: {message:""},
  210: {message:""},
  211: {message:""},
  212: {message:""},
  213: {message:""},
  221: {message:""},
  222: {message:""},
  214: {message:""},
  202: {message:""},
  203: {message:""},
  204: {message:""},
  215: {message:""},
  205: {message:""},
  206: {message:""},
  220: {message:""},
  207: {message:""},
  219: {message:""},
  208: {message:""},
  209: {message:""},
  216: {message:""},
  217: {message:""},
  218: {message:""},
  301: {message:""}
}
export type PayPeriodDuration = {tag: "Monthly", values: void} | {tag: "Quarterly", values: void} | {tag: "SemiAnnually", values: void};


export interface PoolSettings {
  default_grace_period_days: u32;
  late_payment_grace_period_days: u32;
  max_credit_line: u128;
  min_deposit_amount: u128;
  pay_period_duration: PayPeriodDuration;
  principal_only_payment_allowed: boolean;
}


export interface LPConfig {
  fixed_senior_yield_bps: u32;
  liquidity_cap: u128;
  max_senior_junior_ratio: u32;
  tranches_risk_adjustment_bps: u32;
  withdrawal_lockout_period_days: u32;
}


export interface FrontLoadingFeeStructure {
  front_loading_fee_bps: u32;
  front_loading_fee_flat: u128;
}


export interface FeeStructure {
  late_fee_bps: u32;
  min_principal_rate_bps: u32;
  yield_bps: u32;
}


export interface TrancheAddresses {
  addrs: Array<Option<string>>;
}


export interface TrancheAssets {
  assets: Array<u128>;
}


export interface UnprocessedTrancheProfits {
  profits: Array<u128>;
}


/**
 * The minimum and maximum amount that can be deposited into a tranche.
 */
export interface DepositLimits {
  max: u128;
  min: u128;
}


export interface CurrentEpoch {
  end_time: u64;
  id: u64;
}

export type PoolStatus = {tag: "Off", values: void} | {tag: "On", values: void} | {tag: "Closed", values: void};


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({pool_manager, credit, pool_name, underlying_token, junior_tranche, senior_tranche, tranches_policy}: {pool_manager: string, credit: string, pool_name: string, underlying_token: string, junior_tranche: Option<string>, senior_tranche: Option<string>, tranches_policy: TranchesPolicyType}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_pool_manager transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_manager: ({addr, caller}: {addr: string, caller: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_credit: ({addr, caller}: {addr: string, caller: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_underlying_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_underlying_token: ({addr, caller}: {addr: string, caller: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_tranche_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_tranche_address: ({caller, addr, index}: {caller: string, addr: string, index: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_tranches_policy_type transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_tranches_policy_type: ({caller, policy_type}: {caller: string, policy_type: TranchesPolicyType}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_pool_name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_name: ({caller, name}: {caller: string, name: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_pool_settings transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_settings: ({caller, max_credit_line, min_deposit_amount, pay_period_duration, late_payment_grace_period_days, default_grace_period_days, principal_only_payment_allowed}: {caller: string, max_credit_line: u128, min_deposit_amount: u128, pay_period_duration: PayPeriodDuration, late_payment_grace_period_days: u32, default_grace_period_days: u32, principal_only_payment_allowed: boolean}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_lp_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_lp_config: ({caller, liquidity_cap, max_senior_junior_ratio, fixed_senior_yield_bps, tranches_risk_adjustment_bps, withdrawal_lockout_period_days}: {caller: string, liquidity_cap: u128, max_senior_junior_ratio: u32, fixed_senior_yield_bps: u32, tranches_risk_adjustment_bps: u32, withdrawal_lockout_period_days: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_front_loading_fee_structure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_front_loading_fee_structure: ({caller, front_loading_fee_flat, front_loading_fee_bps}: {caller: string, front_loading_fee_flat: u128, front_loading_fee_bps: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_fee_structure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_fee_structure: ({caller, yield_bps, min_principal_rate_bps, late_fee_bps}: {caller: string, yield_bps: u32, min_principal_rate_bps: u32, late_fee_bps: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a send_tokens transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  send_tokens: ({to, amount, caller}: {to: string, amount: u128, caller: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a distribute_profit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_profit: ({caller, profit}: {caller: string, profit: u128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a distribute_loss transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_loss: ({loss}: {loss: u128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a distribute_loss_recovery transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_loss_recovery: ({loss_recovery}: {loss_recovery: u128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a update_tranche_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_tranche_assets: ({caller, tranche_assets}: {caller: string, tranche_assets: TrancheAssets}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a add_tranche_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_tranche_assets: ({addr, amount}: {addr: string, amount: u128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a reduce_tranche_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  reduce_tranche_assets: ({addr, amount}: {addr: string, amount: u128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a reset_unprocessed_profits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  reset_unprocessed_profits: ({addr}: {addr: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_pool_manager transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_manager: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_credit: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_underlying_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_underlying_token: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_pool_name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_name: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_tranche_addresses transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_addresses: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<TrancheAddresses>>

  /**
   * Construct and simulate a get_tranche_index_from_addr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_index_from_addr: ({addr}: {addr: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_tranches_policy_type transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranches_policy_type: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<TranchesPolicyType>>

  /**
   * Construct and simulate a get_pool_settings transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_settings: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<PoolSettings>>

  /**
   * Construct and simulate a get_lp_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_lp_config: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<LPConfig>>

  /**
   * Construct and simulate a get_front_loading_fee_structure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_front_loading_fee_structure: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<FrontLoadingFeeStructure>>

  /**
   * Construct and simulate a get_fee_structure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_fee_structure: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<FeeStructure>>

  /**
   * Construct and simulate a get_tranche_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_assets: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<TrancheAssets>>

  /**
   * Construct and simulate a get_tranche_total_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_total_assets: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a get_tranche_assets_by_addr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_assets_by_addr: ({addr}: {addr: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a get_tranche_available_cap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_available_cap: ({index}: {index: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a get_total_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_total_balance: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a get_unprocessed_tranche_profits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_unprocessed_tranche_profits: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<UnprocessedTrancheProfits>>

  /**
   * Construct and simulate a get_tranche_losses transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_losses: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<TrancheLosses>>

  /**
   * Construct and simulate a get_senior_yield_tracker transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_senior_yield_tracker: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<SeniorYieldTracker>>

  /**
   * Construct and simulate a get_tranche_deposit_limits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_deposit_limits: ({addr}: {addr: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<DepositLimits>>

  /**
   * Construct and simulate a get_available_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_available_balance: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u128>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAACAAAAAAAAAAAAAAALUG9vbE1hbmFnZXIAAAAAAAAAAAAAAAAGQ3JlZGl0AAA=",
        "AAAAAgAAAAAAAAAAAAAADUNvbmZpZ0RhdGFLZXkAAAAAAAAIAAAAAAAAAAAAAAAIUG9vbE5hbWUAAAAAAAAAAAAAAA9VbmRlcmx5aW5nVG9rZW4AAAAAAAAAAAAAAAAQVHJhbmNoZUFkZHJlc3NlcwAAAAAAAAAAAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAAAAAAAAAAAMUG9vbFNldHRpbmdzAAAAAAAAAAAAAAAITFBDb25maWcAAAAAAAAAAAAAABhGcm9udExvYWRpbmdGZWVTdHJ1Y3R1cmUAAAAAAAAAAAAAAAxGZWVTdHJ1Y3R1cmU=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABwAAAAAAAAAMcG9vbF9tYW5hZ2VyAAAAEwAAAAAAAAAGY3JlZGl0AAAAAAATAAAAAAAAAAlwb29sX25hbWUAAAAAAAAQAAAAAAAAABB1bmRlcmx5aW5nX3Rva2VuAAAAEwAAAAAAAAAOanVuaW9yX3RyYW5jaGUAAAAAA+gAAAATAAAAAAAAAA5zZW5pb3JfdHJhbmNoZQAAAAAD6AAAABMAAAAAAAAAD3RyYW5jaGVzX3BvbGljeQAAAAfQAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAA==",
        "AAAAAAAAAAAAAAAQc2V0X3Bvb2xfbWFuYWdlcgAAAAIAAAAAAAAABGFkZHIAAAATAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAKc2V0X2NyZWRpdAAAAAAAAgAAAAAAAAAEYWRkcgAAABMAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAUc2V0X3VuZGVybHlpbmdfdG9rZW4AAAACAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAATc2V0X3RyYW5jaGVfYWRkcmVzcwAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABGFkZHIAAAATAAAAAAAAAAVpbmRleAAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAYc2V0X3RyYW5jaGVzX3BvbGljeV90eXBlAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAtwb2xpY3lfdHlwZQAAAAfQAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAA==",
        "AAAAAAAAAAAAAAANc2V0X3Bvb2xfbmFtZQAAAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEbmFtZQAAABAAAAAA",
        "AAAAAAAAAAAAAAARc2V0X3Bvb2xfc2V0dGluZ3MAAAAAAAAHAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAebGF0ZV9wYXltZW50X2dyYWNlX3BlcmlvZF9kYXlzAAAAAAAEAAAAAAAAABlkZWZhdWx0X2dyYWNlX3BlcmlvZF9kYXlzAAAAAAAABAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAABAAAAAA==",
        "AAAAAAAAAAAAAAANc2V0X2xwX2NvbmZpZwAAAAAAAAYAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAFmZpeGVkX3Nlbmlvcl95aWVsZF9icHMAAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAfc2V0X2Zyb250X2xvYWRpbmdfZmVlX3N0cnVjdHVyZQAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAARc2V0X2ZlZV9zdHJ1Y3R1cmUAAAAAAAAEAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQAAAAAAAAAFm1pbl9wcmluY2lwYWxfcmF0ZV9icHMAAAAAAAQAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAA",
        "AAAAAAAAAAAAAAALc2VuZF90b2tlbnMAAAAAAwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAARZGlzdHJpYnV0ZV9wcm9maXQAAAAAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABnByb2ZpdAAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAAPZGlzdHJpYnV0ZV9sb3NzAAAAAAEAAAAAAAAABGxvc3MAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAYZGlzdHJpYnV0ZV9sb3NzX3JlY292ZXJ5AAAAAQAAAAAAAAANbG9zc19yZWNvdmVyeQAAAAAAAAoAAAAA",
        "AAAAAAAAAAAAAAAVdXBkYXRlX3RyYW5jaGVfYXNzZXRzAAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAA50cmFuY2hlX2Fzc2V0cwAAAAAH0AAAAA1UcmFuY2hlQXNzZXRzAAAAAAAAAA==",
        "AAAAAAAAAAAAAAASYWRkX3RyYW5jaGVfYXNzZXRzAAAAAAACAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAVcmVkdWNlX3RyYW5jaGVfYXNzZXRzAAAAAAAAAgAAAAAAAAAEYWRkcgAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAAZcmVzZXRfdW5wcm9jZXNzZWRfcHJvZml0cwAAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAQZ2V0X3Bvb2xfbWFuYWdlcgAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAKZ2V0X2NyZWRpdAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAUZ2V0X3VuZGVybHlpbmdfdG9rZW4AAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAANZ2V0X3Bvb2xfbmFtZQAAAAAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAVZ2V0X3RyYW5jaGVfYWRkcmVzc2VzAAAAAAAAAAAAAAEAAAfQAAAAEFRyYW5jaGVBZGRyZXNzZXM=",
        "AAAAAAAAAAAAAAAbZ2V0X3RyYW5jaGVfaW5kZXhfZnJvbV9hZGRyAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAYZ2V0X3RyYW5jaGVzX3BvbGljeV90eXBlAAAAAAAAAAEAAAfQAAAAElRyYW5jaGVzUG9saWN5VHlwZQAA",
        "AAAAAAAAAAAAAAARZ2V0X3Bvb2xfc2V0dGluZ3MAAAAAAAAAAAAAAQAAB9AAAAAMUG9vbFNldHRpbmdz",
        "AAAAAAAAAAAAAAANZ2V0X2xwX2NvbmZpZwAAAAAAAAAAAAABAAAH0AAAAAhMUENvbmZpZw==",
        "AAAAAAAAAAAAAAAfZ2V0X2Zyb250X2xvYWRpbmdfZmVlX3N0cnVjdHVyZQAAAAAAAAAAAQAAB9AAAAAYRnJvbnRMb2FkaW5nRmVlU3RydWN0dXJl",
        "AAAAAAAAAAAAAAARZ2V0X2ZlZV9zdHJ1Y3R1cmUAAAAAAAAAAAAAAQAAB9AAAAAMRmVlU3RydWN0dXJl",
        "AAAAAAAAAAAAAAASZ2V0X3RyYW5jaGVfYXNzZXRzAAAAAAAAAAAAAQAAB9AAAAANVHJhbmNoZUFzc2V0cwAAAA==",
        "AAAAAAAAAAAAAAAYZ2V0X3RyYW5jaGVfdG90YWxfYXNzZXRzAAAAAAAAAAEAAAAK",
        "AAAAAAAAAAAAAAAaZ2V0X3RyYW5jaGVfYXNzZXRzX2J5X2FkZHIAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAAAo=",
        "AAAAAAAAAAAAAAAZZ2V0X3RyYW5jaGVfYXZhaWxhYmxlX2NhcAAAAAAAAAEAAAAAAAAABWluZGV4AAAAAAAABAAAAAEAAAAK",
        "AAAAAAAAAAAAAAARZ2V0X3RvdGFsX2JhbGFuY2UAAAAAAAAAAAAAAQAAAAo=",
        "AAAAAAAAAAAAAAAfZ2V0X3VucHJvY2Vzc2VkX3RyYW5jaGVfcHJvZml0cwAAAAAAAAAAAQAAB9AAAAAZVW5wcm9jZXNzZWRUcmFuY2hlUHJvZml0cwAAAA==",
        "AAAAAAAAAAAAAAASZ2V0X3RyYW5jaGVfbG9zc2VzAAAAAAAAAAAAAQAAB9AAAAANVHJhbmNoZUxvc3NlcwAAAA==",
        "AAAAAAAAAAAAAAAYZ2V0X3Nlbmlvcl95aWVsZF90cmFja2VyAAAAAAAAAAEAAAfQAAAAElNlbmlvcllpZWxkVHJhY2tlcgAA",
        "AAAAAAAAAAAAAAAaZ2V0X3RyYW5jaGVfZGVwb3NpdF9saW1pdHMAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAB9AAAAANRGVwb3NpdExpbWl0cwAAAA==",
        "AAAAAAAAAAAAAAAVZ2V0X2F2YWlsYWJsZV9iYWxhbmNlAAAAAAAAAAAAAAEAAAAK",
        "AAAAAQAAAAAAAAAAAAAAFFBvb2xOYW1lQ2hhbmdlZEV2ZW50AAAAAQAAAAAAAAAEbmFtZQAAABA=",
        "AAAAAQAAAAAAAAAAAAAAGFBvb2xTZXR0aW5nc0NoYW5nZWRFdmVudAAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAAFExQQ29uZmlnQ2hhbmdlZEV2ZW50AAAABQAAAAAAAAAWZml4ZWRfc2VuaW9yX3lpZWxkX2JwcwAAAAAABAAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAHEZyb250TG9hZGluZ0ZlZXNDaGFuZ2VkRXZlbnQAAAACAAAAAAAAABVmcm9udF9sb2FkaW5nX2ZlZV9icHMAAAAAAAAEAAAAAAAAABZmcm9udF9sb2FkaW5nX2ZlZV9mbGF0AAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAAGEZlZVN0cnVjdHVyZUNoYW5nZWRFdmVudAAAAAMAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAAFm1pbl9wcmluY2lwYWxfcmF0ZV9icHMAAAAAAAQAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAE1RyYW5jaGVDaGFuZ2VkRXZlbnQAAAAAAgAAAAAAAAAFaW5kZXgAAAAAAAAEAAAAAAAAAAd0cmFuY2hlAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAHlRyYW5jaGVzUG9saWN5VHlwZUNoYW5nZWRFdmVudAAAAAAAAQAAAAAAAAALcG9saWN5X3R5cGUAAAAH0AAAABJUcmFuY2hlc1BvbGljeVR5cGUAAA==",
        "AAAAAQAAARZFdmVudCBmb3IgdGhlIGRpc3RyaWJ1dGlvbiBvZiBwcm9maXQgaW4gdGhlIHBvb2wuCiMgRmllbGRzOgoqIGBwcm9maXRgIC0gVGhlIGFtb3VudCBvZiBwcm9maXQgZGlzdHJpYnV0ZWQuCiogYHNlbmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBzZW5pb3IgYXNzZXRzIHBvc3QgcHJvZml0IGRpc3RyaWJ1dGlvbi4KKiBganVuaW9yX3RvdGFsX2Fzc2V0c2AgLSBUaGUgdG90YWwgYW1vdW50IG9mIGp1bmlvciBhc3NldHMgcG9zdCBwcm9maXQgZGlzdHJpYnV0aW9uLgAAAAAAAAAAABZQcm9maXREaXN0cmlidXRlZEV2ZW50AAAAAAADAAAAAAAAABNqdW5pb3JfdG90YWxfYXNzZXRzAAAAAAoAAAAAAAAABnByb2ZpdAAAAAAACgAAAAAAAAATc2VuaW9yX3RvdGFsX2Fzc2V0cwAAAAAK",
        "AAAAAQAAAdZFdmVudCBmb3IgdGhlIGRpc3RyaWJ1dGlvbiBvZiBsb3NzIGluIHRoZSBwb29sLgojIEZpZWxkczoKKiBgbG9zc2AgLSBUaGUgYW1vdW50IG9mIGxvc3MgZGlzdHJpYnV0ZWQuCiogYHNlbmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBzZW5pb3IgYXNzZXRzIHBvc3QgbG9zcyBkaXN0cmlidXRpb24uCiogYGp1bmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBqdW5pb3IgYXNzZXRzIHBvc3QgbG9zcyBkaXN0cmlidXRpb24uCiogYHNlbmlvcl90b3RhbF9sb3NzYCAtIFRoZSB0b3RhbCBhbW91bnQgb2YgbG9zcyB0aGUgc2VuaW9yIHRyYW5jaGUgc3VmZmVyZWQgcG9zdCBsb3NzIGRpc3RyaWJ1dGlvbi4KKiBganVuaW9yX3RvdGFsX2xvc3NgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBsb3NzIHRoZSBqdW5pb3IgdHJhbmNoZSBzdWZmZXJlZCBwb3N0IGxvc3MgZGlzdHJpYnV0aW9uLgAAAAAAAAAAABRMb3NzRGlzdHJpYnV0ZWRFdmVudAAAAAUAAAAAAAAAE2p1bmlvcl90b3RhbF9hc3NldHMAAAAACgAAAAAAAAARanVuaW9yX3RvdGFsX2xvc3MAAAAAAAAKAAAAAAAAAARsb3NzAAAACgAAAAAAAAATc2VuaW9yX3RvdGFsX2Fzc2V0cwAAAAAKAAAAAAAAABFzZW5pb3JfdG90YWxfbG9zcwAAAAAAAAo=",
        "AAAAAQAAAh1FdmVudCBmb3IgdGhlIGRpc3RyaWJ1dGlvbiBvZiBsb3NzIHJlY292ZXJ5IGluIHRoZSBwb29sLgojIEZpZWxkczoKKiBgbG9zc19yZWNvdmVyeWAgLSBUaGUgYW1vdW50IG9mIGxvc3MgcmVjb3ZlcnkgZGlzdHJpYnV0ZWQuCiogYHNlbmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBzZW5pb3IgYXNzZXRzIHBvc3QgbG9zcyByZWNvdmVyeSBkaXN0cmlidXRpb24uCiogYGp1bmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBqdW5pb3IgYXNzZXRzIHBvc3QgbG9zcyByZWNvdmVyeSBkaXN0cmlidXRpb24uCiogYHNlbmlvcl90b3RhbF9sb3NzYCAtIFRoZSByZW1haW5pbmcgYW1vdW50IG9mIGxvc3MgdGhlIHNlbmlvciB0cmFuY2hlIHN1ZmZlcmVkIHBvc3QgbG9zcyByZWNvdmVyeSBkaXN0cmlidXRpb24uCiogYGp1bmlvcl90b3RhbF9sb3NzYCAtIFRoZSByZW1haW5pbmcgYW1vdW50IG9mIGxvc3MgdGhlIGp1bmlvciB0cmFuY2hlIHN1ZmZlcmVkIHBvc3QgbG9zcyByZWNvdmVyeSBkaXN0cmlidXRpb24uAAAAAAAAAAAAABxMb3NzUmVjb3ZlcnlEaXN0cmlidXRlZEV2ZW50AAAABQAAAAAAAAATanVuaW9yX3RvdGFsX2Fzc2V0cwAAAAAKAAAAAAAAABFqdW5pb3JfdG90YWxfbG9zcwAAAAAAAAoAAAAAAAAADWxvc3NfcmVjb3ZlcnkAAAAAAAAKAAAAAAAAABNzZW5pb3JfdG90YWxfYXNzZXRzAAAAAAoAAAAAAAAAEXNlbmlvcl90b3RhbF9sb3NzAAAAAAAACg==",
        "AAAAAgAAAAAAAAAAAAAAElBvb2xTdG9yYWdlRGF0YUtleQAAAAAABAAAAAAAAAAAAAAABlN0YXR1cwAAAAAAAAAAAAAAAAANVHJhbmNoZUFzc2V0cwAAAAAAAAAAAAAAAAAADVRyYW5jaGVMb3NzZXMAAAAAAAAAAAAAAAAAABlVbnByb2Nlc3NlZFRyYW5jaGVQcm9maXRzAAAA",
        "AAAAAQAAAStUaGUgc2VuaW9yIHlpZWxkIHRyYWNrZXIgaGFzIGJlZW4gcmVmcmVzaGVkLgojIEZpZWxkczoKKiBgdG90YWxfYXNzZXRzYCAtIFRoZSB0b3RhbCBhc3NldHMgaW4gdGhlIHNlbmlvciB0cmFuY2hlIGFmdGVyIHRoZSByZWZyZXNoLgoqIGB1bnBhaWRfeWllbGRgIC0gVGhlIGFtb3VudCBvZiB1bnBhaWQgeWllbGQgdG8gdGhlIHNlbmlvciB0cmFuY2hlIGFmdGVyIHRoZSByZWZyZXNoLgoqIGBsYXN0X3VwZGF0ZWRfZGF0ZWAgLSBUaGUgbGFzdCB0aW1lIHRoZSB0cmFja2VyIHdhcyB1cGRhdGVkIGFmdGVyIHRoZSByZWZyZXNoLgAAAAAAAAAAGllpZWxkVHJhY2tlclJlZnJlc2hlZEV2ZW50AAAAAAADAAAAAAAAABFsYXN0X3VwZGF0ZWRfZGF0ZQAAAAAAAAYAAAAAAAAADHRvdGFsX2Fzc2V0cwAAAAoAAAAAAAAADHVucGFpZF95aWVsZAAAAAo=",
        "AAAAAgAAAAAAAAAAAAAAJUZpeGVkU2VuaW9yWWllbGRUcmFuY2hlc1BvbGljeURhdGFLZXkAAAAAAAABAAAAAAAAAAAAAAASU2VuaW9yWWllbGRUcmFja2VyAAA=",
        "AAAAAQAAAAAAAAAAAAAAElNlbmlvcllpZWxkVHJhY2tlcgAAAAAAAwAAAAAAAAARbGFzdF91cGRhdGVkX2RhdGUAAAAAAAAGAAAAAAAAAAx0b3RhbF9hc3NldHMAAAAKAAAAAAAAAAx1bnBhaWRfeWllbGQAAAAK",
        "AAAAAQAAAAAAAAAAAAAAHkZpeGVkU2VuaW9yWWllbGRUcmFuY2hlc1BvbGljeQAAAAAAAQAAAAAAAAALcGxhY2Vob2xkZXIAAAAAAQ==",
        "AAAAAQAAAAAAAAAAAAAAGlJpc2tBZGp1c3RlZFRyYW5jaGVzUG9saWN5AAAAAAABAAAAAAAAAAtwbGFjZWhvbGRlcgAAAAAB",
        "AAAAAgAAAAAAAAAAAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAgAAAAAAAAAAAAAAEEZpeGVkU2VuaW9yWWllbGQAAAAAAAAAAAAAAAxSaXNrQWRqdXN0ZWQ=",
        "AAAAAQAAAAAAAAAAAAAADVRyYW5jaGVMb3NzZXMAAAAAAAABAAAAAAAAAAZsb3NzZXMAAAAAA+oAAAAK",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAMQAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAIAAAAAAAAABJaZXJvQW1vdW50UHJvdmlkZWQAAAAAADMAAAAAAAAAC1plcm9QZXJpb2RzAAAAADQAAAAAAAAAIEludmFsaWRCYXNpc1BvaW50SGlnaGVyVGhhbjEwMDAwAAAANQAAAAAAAAAcSW5zdWZmaWNpZW50QW1vdW50Rm9yUmVxdWVzdAAAADYAAAAAAAAAE1Vuc3VwcG9ydGVkRnVuY3Rpb24AAAAANwAAAAAAAAAaQm9ycm93ZXJPclNlbnRpbmVsUmVxdWlyZWQAAAAAAEcAAAAAAAAAHFBvb2xPd25lck9ySHVtYU93bmVyUmVxdWlyZWQAAABIAAAAAAAAABRQb29sT3BlcmF0b3JSZXF1aXJlZAAAAEkAAAAAAAAADlBhdXNlclJlcXVpcmVkAAAAAABKAAAAAAAAABtQb29sT3duZXJPclNlbnRpbmVsUmVxdWlyZWQAAAAASwAAAAAAAAAUQm9ycm93ZXJPckVBUmVxdWlyZWQAAABMAAAAAAAAABBCb3Jyb3dlclJlcXVpcmVkAAAATQAAAAAAAAATUG9vbE1hbmFnZXJSZXF1aXJlZAAAAABOAAAAAAAAACBBdXRob3JpemVkQ29udHJhY3RDYWxsZXJSZXF1aXJlZAAAAE8AAAAAAAAAH1Byb3RvY29sRmVlSGlnaGVyVGhhblVwcGVyTGltaXQAAAAAUQAAAAAAAAAQUHJvdG9jb2xJc1BhdXNlZAAAAFIAAAAAAAAAFkFkbWluUmV3YXJkUmF0ZVRvb0hpZ2gAAAAAAFsAAAAAAAAAFk1pbkRlcG9zaXRBbW91bnRUb29Mb3cAAAAAAFwAAAAAAAAAHUxhdGVQYXltZW50R3JhY2VQZXJpb2RUb29Mb25nAAAAAAAAXQAAAAAAAAAVSW52YWxpZFRyYW5jaGVBZGRyZXNzAAAAAAAAXgAAAAAAAAALUG9vbElzTm90T24AAAAAXwAAAAAAAAAeUG9vbE93bmVySW5zdWZmaWNpZW50TGlxdWlkaXR5AAAAAABgAAAAAAAAACRFdmFsdWF0aW9uQWdlbnRJbnN1ZmZpY2llbnRMaXF1aWRpdHkAAABhAAAAAAAAAA9Qb29sSXNOb3RDbG9zZWQAAAAAYgAAAAAAAAAZU3RhcnREYXRlTGF0ZXJUaGFuRW5kRGF0ZQAAAAAAAGUAAAAAAAAAG0NyZWRpdE5vdEluU3RhdGVGb3JBcHByb3ZhbAAAAADJAAAAAAAAACFDb21taXR0ZWRBbW91bnRFeGNlZWRzQ3JlZGl0TGltaXQAAAAAAADSAAAAAAAAADZDcmVkaXRXaXRob3V0Q29tbWl0bWVudFNob3VsZEhhdmVOb0Rlc2lnbmF0ZWRTdGFydERhdGUAAAAAANMAAAAAAAAAHERlc2lnbmF0ZWRTdGFydERhdGVJblRoZVBhc3QAAADUAAAAAAAAADFQYXlQZXJpb2RzVG9vTG93Rm9yQ3JlZGl0c1dpdGhEZXNpZ25hdGVkU3RhcnREYXRlAAAAAAAA1QAAAAAAAAAgQm9ycm93QW1vdW50TGVzc1RoYW5QbGF0Zm9ybUZlZXMAAADdAAAAAAAAACVBdHRlbXB0ZWREcmF3ZG93bk9uTm9uUmV2b2x2aW5nQ3JlZGl0AAAAAAAA3gAAAAAAAAAeQ29tbWl0dGVkQ3JlZGl0Q2Fubm90QmVTdGFydGVkAAAAAADWAAAAAAAAABNDcmVkaXRMaW1pdEV4Y2VlZGVkAAAAAMoAAAAAAAAAKERyYXdkb3duTm90QWxsb3dlZEluRmluYWxQZXJpb2RBbmRCZXlvbmQAAADLAAAAAAAAACJJbnN1ZmZpY2llbnRQb29sQmFsYW5jZUZvckRyYXdkb3duAAAAAADMAAAAAAAAABVGaXJzdERyYXdkb3duVG9vRWFybHkAAAAAAADXAAAAAAAAABtDcmVkaXROb3RJblN0YXRlRm9yRHJhd2Rvd24AAAAAzQAAAAAAAAArRHJhd2Rvd25Ob3RBbGxvd2VkQWZ0ZXJEdWVEYXRlV2l0aFVucGFpZER1ZQAAAADOAAAAAAAAABJDcmVkaXRMaW1pdFRvb0hpZ2gAAAAAANwAAAAAAAAAIENyZWRpdE5vdEluU3RhdGVGb3JNYWtpbmdQYXltZW50AAAAzwAAAAAAAAApQ3JlZGl0Tm90SW5TdGF0ZUZvck1ha2luZ1ByaW5jaXBhbFBheW1lbnQAAAAAAADbAAAAAAAAAB5EZWZhdWx0SGFzQWxyZWFkeUJlZW5UcmlnZ2VyZWQAAAAAANAAAAAAAAAAGERlZmF1bHRUcmlnZ2VyZWRUb29FYXJseQAAANEAAAAAAAAAGUNyZWRpdE5vdEluU3RhdGVGb3JVcGRhdGUAAAAAAADYAAAAAAAAABtDcmVkaXRIYXNPdXRzdGFuZGluZ0JhbGFuY2UAAAAA2QAAAAAAAAAeQ3JlZGl0SGFzVW5mdWxmaWxsZWRDb21taXRtZW50AAAAAADaAAAAAAAAABNFcG9jaENsb3NlZFRvb0Vhcmx5AAAAAS0=",
        "AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5",
        "AAAAAQAAAAAAAAAAAAAADFBvb2xTZXR0aW5ncwAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAACExQQ29uZmlnAAAABQAAAAAAAAAWZml4ZWRfc2VuaW9yX3lpZWxkX2JwcwAAAAAABAAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAGEZyb250TG9hZGluZ0ZlZVN0cnVjdHVyZQAAAAIAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAADEZlZVN0cnVjdHVyZQAAAAMAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAAFm1pbl9wcmluY2lwYWxfcmF0ZV9icHMAAAAAAAQAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAEFRyYW5jaGVBZGRyZXNzZXMAAAABAAAAAAAAAAVhZGRycwAAAAAAA+oAAAPoAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADVRyYW5jaGVBc3NldHMAAAAAAAABAAAAAAAAAAZhc3NldHMAAAAAA+oAAAAK",
        "AAAAAQAAAAAAAAAAAAAAGVVucHJvY2Vzc2VkVHJhbmNoZVByb2ZpdHMAAAAAAAABAAAAAAAAAAdwcm9maXRzAAAAA+oAAAAK",
        "AAAAAQAAAERUaGUgbWluaW11bSBhbmQgbWF4aW11bSBhbW91bnQgdGhhdCBjYW4gYmUgZGVwb3NpdGVkIGludG8gYSB0cmFuY2hlLgAAAAAAAAANRGVwb3NpdExpbWl0cwAAAAAAAAIAAAAAAAAAA21heAAAAAAKAAAAAAAAAANtaW4AAAAACg==",
        "AAAAAQAAAAAAAAAAAAAADEN1cnJlbnRFcG9jaAAAAAIAAAAAAAAACGVuZF90aW1lAAAABgAAAAAAAAACaWQAAAAAAAY=",
        "AAAAAgAAAAAAAAAAAAAAClBvb2xTdGF0dXMAAAAAAAMAAAAAAAAAAAAAAANPZmYAAAAAAAAAAAAAAAACT24AAAAAAAAAAAAAAAAABkNsb3NlZAAA" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        set_pool_manager: this.txFromJSON<null>,
        set_credit: this.txFromJSON<null>,
        set_underlying_token: this.txFromJSON<null>,
        set_tranche_address: this.txFromJSON<null>,
        set_tranches_policy_type: this.txFromJSON<null>,
        set_pool_name: this.txFromJSON<null>,
        set_pool_settings: this.txFromJSON<null>,
        set_lp_config: this.txFromJSON<null>,
        set_front_loading_fee_structure: this.txFromJSON<null>,
        set_fee_structure: this.txFromJSON<null>,
        send_tokens: this.txFromJSON<null>,
        distribute_profit: this.txFromJSON<null>,
        distribute_loss: this.txFromJSON<null>,
        distribute_loss_recovery: this.txFromJSON<null>,
        update_tranche_assets: this.txFromJSON<null>,
        add_tranche_assets: this.txFromJSON<null>,
        reduce_tranche_assets: this.txFromJSON<null>,
        reset_unprocessed_profits: this.txFromJSON<null>,
        get_pool_manager: this.txFromJSON<string>,
        get_credit: this.txFromJSON<string>,
        get_underlying_token: this.txFromJSON<string>,
        get_pool_name: this.txFromJSON<string>,
        get_tranche_addresses: this.txFromJSON<TrancheAddresses>,
        get_tranche_index_from_addr: this.txFromJSON<u32>,
        get_tranches_policy_type: this.txFromJSON<TranchesPolicyType>,
        get_pool_settings: this.txFromJSON<PoolSettings>,
        get_lp_config: this.txFromJSON<LPConfig>,
        get_front_loading_fee_structure: this.txFromJSON<FrontLoadingFeeStructure>,
        get_fee_structure: this.txFromJSON<FeeStructure>,
        get_tranche_assets: this.txFromJSON<TrancheAssets>,
        get_tranche_total_assets: this.txFromJSON<u128>,
        get_tranche_assets_by_addr: this.txFromJSON<u128>,
        get_tranche_available_cap: this.txFromJSON<u128>,
        get_total_balance: this.txFromJSON<u128>,
        get_unprocessed_tranche_profits: this.txFromJSON<UnprocessedTrancheProfits>,
        get_tranche_losses: this.txFromJSON<TrancheLosses>,
        get_senior_yield_tracker: this.txFromJSON<SeniorYieldTracker>,
        get_tranche_deposit_limits: this.txFromJSON<DepositLimits>,
        get_available_balance: this.txFromJSON<u128>
  }
}