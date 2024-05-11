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
    contractId: "CA525T5NVARC4VHMBURM56O7EFMZ4PSMYCOTFTZPHAYQTVD2A35WFEPQ",
  }
} as const

export type ClientDataKey = {tag: "Pool", values: void} | {tag: "PoolManager", values: void} | {tag: "UnderlyingToken", values: void};

export type DataKey = {tag: "Balance", values: readonly [string]} | {tag: "TotalSupply", values: void};


/**
 * An epoch has been processed.
 * # Fields:
 * * `epoch_id` - The epoch ID.
 * * `shares_requested` - The number of tranche shares that were requested for redemption.
 * * `shares_processed` - The number of tranche shares that have been redeemed.
 * * `amount_processed` - The amount of the underlying pool asset token redeemed in this epoch.
 */
export interface EpochProcessedEvent {
  amount_processed: u128;
  epoch_id: u64;
  shares_processed: u128;
  shares_requested: u128;
}


/**
 * A lender has been added.
 * # Fields:
 * * `account` - The address of the lender.
 * * `reinvest_yield` - A flag indicating whether the lender is reinvesting or not.
 */
export interface LenderAddedEvent {
  account: string;
  reinvest_yield: boolean;
}


/**
 * A lender has been removed.
 * # Fields:
 * * `account` - The address of the lender.
 */
export interface LenderRemovedEvent {
  account: string;
}


/**
 * A deposit has been made to the tranche.
 * # Fields:
 * * `sender` - The address that made the deposit.
 * * `assets` - The amount measured in the underlying asset.
 * * `shares` - The number of shares minted for this deposit.
 */
export interface LiquidityDepositedEvent {
  assets: u128;
  sender: string;
  shares: u128;
}


/**
 * A disbursement to the lender for a processed redemption.
 * # Fields:
 * * `account` - The account whose shares have been redeemed.
 * * `amount_disbursed` - The amount of the disbursement.
 */
export interface LenderFundDisbursedEvent {
  account: string;
  amount_disbursed: u128;
}


/**
 * A lender has withdrawn all their assets after pool closure.
 * # Fields:
 * * `account` - The lender who has withdrawn.
 * * `shares` - The number of shares burned.
 * * `assets` - The amount that was withdrawn.
 */
export interface LenderFundWithdrawnEvent {
  account: string;
  assets: u128;
  shares: u128;
}


/**
 * A redemption request has been added.
 * # Fields:
 * * `epoch_id` - The epoch ID.
 * * `account` - The account whose shares to be redeemed.
 * * `shares` - The number of shares to be redeemed.
 */
export interface RedemptionRequestAddedEvent {
  account: string;
  epoch_id: u64;
  shares: u128;
}


/**
 * A redemption request has been canceled.
 * # Fields:
 * * `epoch_id` - The epoch ID.
 * * `account` - The account whose request to be canceled.
 * * `shares` - The number of shares to be included in the cancellation.
 */
export interface RedemptionRequestCanceledEvent {
  account: string;
  epoch_id: u64;
  shares: u128;
}


/**
 * Yield has been paid to the investor.
 * # Fields:
 * * `account` - The account who has received the yield distribution.
 * * `yields` - The amount of yield distributed.
 * * `shares` - The number of shares burned for this distribution.
 */
export interface YieldPaidOutEvent {
  account: string;
  shares: u128;
  yields: u128;
}


/**
 * Yield payout to the investor has failed.
 * # Fields:
 * * `account` - The account who should have received the yield distribution.
 * * `yields` - The amount of yield that should have been distributed.
 * * `shares` - The number of shares that should have been burned for this distribution.
 * * `reason` - The reason why the payout failed.
 */
export interface YieldPayoutFailedEvent {
  account: string;
  reason: string;
  shares: u128;
  yields: u128;
}


/**
 * The yield reinvestment setting has been updated.
 * # Fields:
 * * `account` - The account whose setting has been updated.
 * * `reinvest_yield` - A flag indicating whether the lender is reinvesting or not.
 */
export interface ReinvestYieldConfigSetEvent {
  account: string;
  reinvest_yield: boolean;
}

export type TrancheVaultDataKey = {tag: "ApprovedLender", values: readonly [string]} | {tag: "DepositRecord", values: readonly [string]} | {tag: "YieldPayoutLenders", values: void} | {tag: "LenderRedemptionRecord", values: readonly [string]} | {tag: "EpochRedemptionSummary", values: readonly [u64]};


export interface DepositRecord {
  last_deposit_time: u64;
  principal: u128;
  reinvest_yield: boolean;
}


export interface LenderRedemptionRecord {
  next_epoch_id_to_process: u64;
  num_shares_requested: u128;
  principal_requested: u128;
  total_amount_processed: u128;
  total_amount_withdrawn: u128;
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


export interface TokenMetadata {
  decimal: u32;
  name: string;
  symbol: string;
}


export interface EpochRedemptionSummary {
  epoch_id: u64;
  total_amount_processed: u128;
  total_shares_processed: u128;
  total_shares_requested: u128;
}


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({name, symbol, underlying_token, pool, pool_manager}: {name: string, symbol: string, underlying_token: string, pool: string, pool_manager: string}, options?: {
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
   * Construct and simulate a add_approved_lender transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_approved_lender: ({caller, lender, reinvest_yield}: {caller: string, lender: string, reinvest_yield: boolean}, options?: {
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
   * Construct and simulate a remove_approved_lender transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_approved_lender: ({caller, lender}: {caller: string, lender: string}, options?: {
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
   * Construct and simulate a set_reinvest_yield transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_reinvest_yield: ({caller, lender, reinvest_yield}: {caller: string, lender: string, reinvest_yield: boolean}, options?: {
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
   * Construct and simulate a make_initial_deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  make_initial_deposit: ({caller, assets}: {caller: string, assets: u128}, options?: {
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
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({lender, assets}: {lender: string, assets: u128}, options?: {
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
   * Construct and simulate a pay_out_yield_to_lenders transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pay_out_yield_to_lenders: ({caller}: {caller: string}, options?: {
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
   * Construct and simulate a add_redemption_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_redemption_request: ({lender, shares}: {lender: string, shares: u128}, options?: {
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
   * Construct and simulate a cancel_redemption_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  cancel_redemption_request: ({lender, shares}: {lender: string, shares: u128}, options?: {
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
   * Construct and simulate a disburse transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  disburse: ({lender}: {lender: string}, options?: {
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
   * Construct and simulate a withdraw_after_pool_closure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_after_pool_closure: ({lender}: {lender: string}, options?: {
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
   * Construct and simulate a execute_redemption_summary transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  execute_redemption_summary: ({summary}: {summary: EpochRedemptionSummary}, options?: {
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
   * Construct and simulate a cancellable_redemption_shares transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  cancellable_redemption_shares: ({lender}: {lender: string}, options?: {
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
   * Construct and simulate a withdrawable_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdrawable_assets: ({lender}: {lender: string}, options?: {
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
   * Construct and simulate a get_latest_redemption_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_latest_redemption_record: ({lender}: {lender: string}, options?: {
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
  }) => Promise<AssembledTransaction<LenderRedemptionRecord>>

  /**
   * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_supply: (options?: {
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
   * Construct and simulate a balance_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance_of: ({account}: {account: string}, options?: {
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
   * Construct and simulate a total_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_assets: (options?: {
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
   * Construct and simulate a total_assets_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_assets_of: ({account}: {account: string}, options?: {
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
   * Construct and simulate a convert_to_shares transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  convert_to_shares: ({assets}: {assets: u128}, options?: {
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
   * Construct and simulate a convert_to_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  convert_to_assets: ({shares}: {shares: u128}, options?: {
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
   * Construct and simulate a is_approved_lender transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_approved_lender: ({account}: {account: string}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_deposit_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_deposit_record: ({account}: {account: string}, options?: {
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
  }) => Promise<AssembledTransaction<DepositRecord>>

  /**
   * Construct and simulate a get_epoch_redemption_summary transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_epoch_redemption_summary: ({epoch_id}: {epoch_id: u64}, options?: {
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
  }) => Promise<AssembledTransaction<EpochRedemptionSummary>>

  /**
   * Construct and simulate a get_redemption_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_redemption_record: ({account}: {account: string}, options?: {
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
  }) => Promise<AssembledTransaction<LenderRedemptionRecord>>

  /**
   * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  allowance: ({_from, _spender}: {_from: string, _spender: string}, options?: {
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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve: ({_from, _spender, _amount, _expiration_ledger}: {_from: string, _spender: string, _amount: i128, _expiration_ledger: u32}, options?: {
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
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({id}: {id: string}, options?: {
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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: {
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
   * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_from: ({_spender, _from, _to, _amount}: {_spender: string, _from: string, _to: string, _amount: i128}, options?: {
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
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn: ({from, amount}: {from: string, amount: i128}, options?: {
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
   * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn_from: ({_spender, _from, _amount}: {_spender: string, _from: string, _amount: i128}, options?: {
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
   * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  decimals: (options?: {
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
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  name: (options?: {
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
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  symbol: (options?: {
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

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAADAAAAAAAAAAAAAAAEUG9vbAAAAAAAAAAAAAAAC1Bvb2xNYW5hZ2VyAAAAAAAAAAAAAAAAD1VuZGVybHlpbmdUb2tlbgA=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABQAAAAAAAAAEbmFtZQAAABAAAAAAAAAABnN5bWJvbAAAAAAAEAAAAAAAAAAQdW5kZXJseWluZ190b2tlbgAAABMAAAAAAAAABHBvb2wAAAATAAAAAAAAAAxwb29sX21hbmFnZXIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAATYWRkX2FwcHJvdmVkX2xlbmRlcgAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAAAAAAOcmVpbnZlc3RfeWllbGQAAAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAWcmVtb3ZlX2FwcHJvdmVkX2xlbmRlcgAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAASc2V0X3JlaW52ZXN0X3lpZWxkAAAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAAAAAAOcmVpbnZlc3RfeWllbGQAAAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAUbWFrZV9pbml0aWFsX2RlcG9zaXQAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABmFzc2V0cwAAAAAACgAAAAEAAAAK",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAACAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAAAAAABmFzc2V0cwAAAAAACgAAAAEAAAAK",
        "AAAAAAAAAAAAAAAYcGF5X291dF95aWVsZF90b19sZW5kZXJzAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAWYWRkX3JlZGVtcHRpb25fcmVxdWVzdAAAAAAAAgAAAAAAAAAGbGVuZGVyAAAAAAATAAAAAAAAAAZzaGFyZXMAAAAAAAoAAAAA",
        "AAAAAAAAAAAAAAAZY2FuY2VsX3JlZGVtcHRpb25fcmVxdWVzdAAAAAAAAAIAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAAAAAAGc2hhcmVzAAAAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAIZGlzYnVyc2UAAAABAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAbd2l0aGRyYXdfYWZ0ZXJfcG9vbF9jbG9zdXJlAAAAAAEAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAaZXhlY3V0ZV9yZWRlbXB0aW9uX3N1bW1hcnkAAAAAAAEAAAAAAAAAB3N1bW1hcnkAAAAH0AAAABZFcG9jaFJlZGVtcHRpb25TdW1tYXJ5AAAAAAAA",
        "AAAAAAAAAAAAAAAdY2FuY2VsbGFibGVfcmVkZW1wdGlvbl9zaGFyZXMAAAAAAAABAAAAAAAAAAZsZW5kZXIAAAAAABMAAAABAAAACg==",
        "AAAAAAAAAAAAAAATd2l0aGRyYXdhYmxlX2Fzc2V0cwAAAAABAAAAAAAAAAZsZW5kZXIAAAAAABMAAAABAAAACg==",
        "AAAAAAAAAAAAAAAcZ2V0X2xhdGVzdF9yZWRlbXB0aW9uX3JlY29yZAAAAAEAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAEAAAfQAAAAFkxlbmRlclJlZGVtcHRpb25SZWNvcmQAAA==",
        "AAAAAAAAAAAAAAAMdG90YWxfc3VwcGx5AAAAAAAAAAEAAAAK",
        "AAAAAAAAAAAAAAAKYmFsYW5jZV9vZgAAAAAAAQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAo=",
        "AAAAAAAAAAAAAAAMdG90YWxfYXNzZXRzAAAAAAAAAAEAAAAK",
        "AAAAAAAAAAAAAAAPdG90YWxfYXNzZXRzX29mAAAAAAEAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAK",
        "AAAAAAAAAAAAAAARY29udmVydF90b19zaGFyZXMAAAAAAAABAAAAAAAAAAZhc3NldHMAAAAAAAoAAAABAAAACg==",
        "AAAAAAAAAAAAAAARY29udmVydF90b19hc3NldHMAAAAAAAABAAAAAAAAAAZzaGFyZXMAAAAAAAoAAAABAAAACg==",
        "AAAAAAAAAAAAAAASaXNfYXBwcm92ZWRfbGVuZGVyAAAAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAAAQ==",
        "AAAAAAAAAAAAAAASZ2V0X2RlcG9zaXRfcmVjb3JkAAAAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAH0AAAAA1EZXBvc2l0UmVjb3JkAAAA",
        "AAAAAAAAAAAAAAAcZ2V0X2Vwb2NoX3JlZGVtcHRpb25fc3VtbWFyeQAAAAEAAAAAAAAACGVwb2NoX2lkAAAABgAAAAEAAAfQAAAAFkVwb2NoUmVkZW1wdGlvblN1bW1hcnkAAA==",
        "AAAAAAAAAAAAAAAVZ2V0X3JlZGVtcHRpb25fcmVjb3JkAAAAAAAAAQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAB9AAAAAWTGVuZGVyUmVkZW1wdGlvblJlY29yZAAA",
        "AAAAAAAAAAAAAAAJYWxsb3dhbmNlAAAAAAAAAgAAAAAAAAAFX2Zyb20AAAAAAAATAAAAAAAAAAhfc3BlbmRlcgAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAAVfZnJvbQAAAAAAABMAAAAAAAAACF9zcGVuZGVyAAAAEwAAAAAAAAAHX2Ftb3VudAAAAAALAAAAAAAAABJfZXhwaXJhdGlvbl9sZWRnZXIAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAACF9zcGVuZGVyAAAAEwAAAAAAAAAFX2Zyb20AAAAAAAATAAAAAAAAAANfdG8AAAAAEwAAAAAAAAAHX2Ftb3VudAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAIX3NwZW5kZXIAAAATAAAAAAAAAAVfZnJvbQAAAAAAABMAAAAAAAAAB19hbW91bnQAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAADwAAAAAAAAASWmVyb0Ftb3VudFByb3ZpZGVkAAAAAAABAAAAAAAAABNVbnN1cHBvcnRlZEZ1bmN0aW9uAAAAAAIAAAAAAAAAFFBvb2xPcGVyYXRvclJlcXVpcmVkAAAAFQAAAAAAAAAOTGVuZGVyUmVxdWlyZWQAAAAAABYAAAAAAAAAIkF1dGhvcml6ZWRJbml0aWFsRGVwb3NpdG9yUmVxdWlyZWQAAAAAABcAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAMwAAAAAAAAAOQWxyZWFkeUFMZW5kZXIAAAAAADQAAAAAAAAAHVJlaW52ZXN0WWllbGRPcHRpb25BbHJlYWR5U2V0AAAAAAAANQAAAAAAAAAgWWllbGRQYXlvdXRMZW5kZXJDYXBhY2l0eVJlYWNoZWQAAAA2AAAAAAAAABNEZXBvc2l0QW1vdW50VG9vTG93AAAAAFEAAAAAAAAAG1RyYW5jaGVMaXF1aWRpdHlDYXBFeGNlZWRlZAAAAABSAAAAAAAAABBaZXJvU2hhcmVzTWludGVkAAAAUwAAAAAAAAAQV2l0aGRyYXdUb29FYXJseQAAAFQAAAAAAAAAHEluc3VmZmljaWVudFNoYXJlc0ZvclJlcXVlc3QAAABVAAAAAAAAAA9Qb29sSXNOb3RDbG9zZWQAAAAAVg==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAAAAAAAAAAAAAtUb3RhbFN1cHBseQA=",
        "AAAAAQAAAUVBbiBlcG9jaCBoYXMgYmVlbiBwcm9jZXNzZWQuCiMgRmllbGRzOgoqIGBlcG9jaF9pZGAgLSBUaGUgZXBvY2ggSUQuCiogYHNoYXJlc19yZXF1ZXN0ZWRgIC0gVGhlIG51bWJlciBvZiB0cmFuY2hlIHNoYXJlcyB0aGF0IHdlcmUgcmVxdWVzdGVkIGZvciByZWRlbXB0aW9uLgoqIGBzaGFyZXNfcHJvY2Vzc2VkYCAtIFRoZSBudW1iZXIgb2YgdHJhbmNoZSBzaGFyZXMgdGhhdCBoYXZlIGJlZW4gcmVkZWVtZWQuCiogYGFtb3VudF9wcm9jZXNzZWRgIC0gVGhlIGFtb3VudCBvZiB0aGUgdW5kZXJseWluZyBwb29sIGFzc2V0IHRva2VuIHJlZGVlbWVkIGluIHRoaXMgZXBvY2guAAAAAAAAAAAAABNFcG9jaFByb2Nlc3NlZEV2ZW50AAAAAAQAAAAAAAAAEGFtb3VudF9wcm9jZXNzZWQAAAAKAAAAAAAAAAhlcG9jaF9pZAAAAAYAAAAAAAAAEHNoYXJlc19wcm9jZXNzZWQAAAAKAAAAAAAAABBzaGFyZXNfcmVxdWVzdGVkAAAACg==",
        "AAAAAQAAAJxBIGxlbmRlciBoYXMgYmVlbiBhZGRlZC4KIyBGaWVsZHM6CiogYGFjY291bnRgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGxlbmRlci4KKiBgcmVpbnZlc3RfeWllbGRgIC0gQSBmbGFnIGluZGljYXRpbmcgd2hldGhlciB0aGUgbGVuZGVyIGlzIHJlaW52ZXN0aW5nIG9yIG5vdC4AAAAAAAAAEExlbmRlckFkZGVkRXZlbnQAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAADnJlaW52ZXN0X3lpZWxkAAAAAAAB",
        "AAAAAQAAAE1BIGxlbmRlciBoYXMgYmVlbiByZW1vdmVkLgojIEZpZWxkczoKKiBgYWNjb3VudGAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgbGVuZGVyLgAAAAAAAAAAAAASTGVuZGVyUmVtb3ZlZEV2ZW50AAAAAAABAAAAAAAAAAdhY2NvdW50AAAAABM=",
        "AAAAAQAAANZBIGRlcG9zaXQgaGFzIGJlZW4gbWFkZSB0byB0aGUgdHJhbmNoZS4KIyBGaWVsZHM6CiogYHNlbmRlcmAgLSBUaGUgYWRkcmVzcyB0aGF0IG1hZGUgdGhlIGRlcG9zaXQuCiogYGFzc2V0c2AgLSBUaGUgYW1vdW50IG1lYXN1cmVkIGluIHRoZSB1bmRlcmx5aW5nIGFzc2V0LgoqIGBzaGFyZXNgIC0gVGhlIG51bWJlciBvZiBzaGFyZXMgbWludGVkIGZvciB0aGlzIGRlcG9zaXQuAAAAAAAAAAAAF0xpcXVpZGl0eURlcG9zaXRlZEV2ZW50AAAAAAMAAAAAAAAABmFzc2V0cwAAAAAACgAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAZzaGFyZXMAAAAAAAo=",
        "AAAAAQAAALRBIGRpc2J1cnNlbWVudCB0byB0aGUgbGVuZGVyIGZvciBhIHByb2Nlc3NlZCByZWRlbXB0aW9uLgojIEZpZWxkczoKKiBgYWNjb3VudGAgLSBUaGUgYWNjb3VudCB3aG9zZSBzaGFyZXMgaGF2ZSBiZWVuIHJlZGVlbWVkLgoqIGBhbW91bnRfZGlzYnVyc2VkYCAtIFRoZSBhbW91bnQgb2YgdGhlIGRpc2J1cnNlbWVudC4AAAAAAAAAGExlbmRlckZ1bmREaXNidXJzZWRFdmVudAAAAAIAAAAAAAAAB2FjY291bnQAAAAAEwAAAAAAAAAQYW1vdW50X2Rpc2J1cnNlZAAAAAo=",
        "AAAAAQAAAMdBIGxlbmRlciBoYXMgd2l0aGRyYXduIGFsbCB0aGVpciBhc3NldHMgYWZ0ZXIgcG9vbCBjbG9zdXJlLgojIEZpZWxkczoKKiBgYWNjb3VudGAgLSBUaGUgbGVuZGVyIHdobyBoYXMgd2l0aGRyYXduLgoqIGBzaGFyZXNgIC0gVGhlIG51bWJlciBvZiBzaGFyZXMgYnVybmVkLgoqIGBhc3NldHNgIC0gVGhlIGFtb3VudCB0aGF0IHdhcyB3aXRoZHJhd24uAAAAAAAAAAAYTGVuZGVyRnVuZFdpdGhkcmF3bkV2ZW50AAAAAwAAAAAAAAAHYWNjb3VudAAAAAATAAAAAAAAAAZhc3NldHMAAAAAAAoAAAAAAAAABnNoYXJlcwAAAAAACg==",
        "AAAAAQAAALRBIHJlZGVtcHRpb24gcmVxdWVzdCBoYXMgYmVlbiBhZGRlZC4KIyBGaWVsZHM6CiogYGVwb2NoX2lkYCAtIFRoZSBlcG9jaCBJRC4KKiBgYWNjb3VudGAgLSBUaGUgYWNjb3VudCB3aG9zZSBzaGFyZXMgdG8gYmUgcmVkZWVtZWQuCiogYHNoYXJlc2AgLSBUaGUgbnVtYmVyIG9mIHNoYXJlcyB0byBiZSByZWRlZW1lZC4AAAAAAAAAG1JlZGVtcHRpb25SZXF1ZXN0QWRkZWRFdmVudAAAAAADAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAACGVwb2NoX2lkAAAABgAAAAAAAAAGc2hhcmVzAAAAAAAK",
        "AAAAAQAAAMxBIHJlZGVtcHRpb24gcmVxdWVzdCBoYXMgYmVlbiBjYW5jZWxlZC4KIyBGaWVsZHM6CiogYGVwb2NoX2lkYCAtIFRoZSBlcG9jaCBJRC4KKiBgYWNjb3VudGAgLSBUaGUgYWNjb3VudCB3aG9zZSByZXF1ZXN0IHRvIGJlIGNhbmNlbGVkLgoqIGBzaGFyZXNgIC0gVGhlIG51bWJlciBvZiBzaGFyZXMgdG8gYmUgaW5jbHVkZWQgaW4gdGhlIGNhbmNlbGxhdGlvbi4AAAAAAAAAHlJlZGVtcHRpb25SZXF1ZXN0Q2FuY2VsZWRFdmVudAAAAAAAAwAAAAAAAAAHYWNjb3VudAAAAAATAAAAAAAAAAhlcG9jaF9pZAAAAAYAAAAAAAAABnNoYXJlcwAAAAAACg==",
        "AAAAAQAAAN9ZaWVsZCBoYXMgYmVlbiBwYWlkIHRvIHRoZSBpbnZlc3Rvci4KIyBGaWVsZHM6CiogYGFjY291bnRgIC0gVGhlIGFjY291bnQgd2hvIGhhcyByZWNlaXZlZCB0aGUgeWllbGQgZGlzdHJpYnV0aW9uLgoqIGB5aWVsZHNgIC0gVGhlIGFtb3VudCBvZiB5aWVsZCBkaXN0cmlidXRlZC4KKiBgc2hhcmVzYCAtIFRoZSBudW1iZXIgb2Ygc2hhcmVzIGJ1cm5lZCBmb3IgdGhpcyBkaXN0cmlidXRpb24uAAAAAAAAAAARWWllbGRQYWlkT3V0RXZlbnQAAAAAAAADAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAABnNoYXJlcwAAAAAACgAAAAAAAAAGeWllbGRzAAAAAAAK",
        "AAAAAQAAAUZZaWVsZCBwYXlvdXQgdG8gdGhlIGludmVzdG9yIGhhcyBmYWlsZWQuCiMgRmllbGRzOgoqIGBhY2NvdW50YCAtIFRoZSBhY2NvdW50IHdobyBzaG91bGQgaGF2ZSByZWNlaXZlZCB0aGUgeWllbGQgZGlzdHJpYnV0aW9uLgoqIGB5aWVsZHNgIC0gVGhlIGFtb3VudCBvZiB5aWVsZCB0aGF0IHNob3VsZCBoYXZlIGJlZW4gZGlzdHJpYnV0ZWQuCiogYHNoYXJlc2AgLSBUaGUgbnVtYmVyIG9mIHNoYXJlcyB0aGF0IHNob3VsZCBoYXZlIGJlZW4gYnVybmVkIGZvciB0aGlzIGRpc3RyaWJ1dGlvbi4KKiBgcmVhc29uYCAtIFRoZSByZWFzb24gd2h5IHRoZSBwYXlvdXQgZmFpbGVkLgAAAAAAAAAAABZZaWVsZFBheW91dEZhaWxlZEV2ZW50AAAAAAAEAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAABnJlYXNvbgAAAAAAEAAAAAAAAAAGc2hhcmVzAAAAAAAKAAAAAAAAAAZ5aWVsZHMAAAAAAAo=",
        "AAAAAQAAAMVUaGUgeWllbGQgcmVpbnZlc3RtZW50IHNldHRpbmcgaGFzIGJlZW4gdXBkYXRlZC4KIyBGaWVsZHM6CiogYGFjY291bnRgIC0gVGhlIGFjY291bnQgd2hvc2Ugc2V0dGluZyBoYXMgYmVlbiB1cGRhdGVkLgoqIGByZWludmVzdF95aWVsZGAgLSBBIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBsZW5kZXIgaXMgcmVpbnZlc3Rpbmcgb3Igbm90LgAAAAAAAAAAAAAbUmVpbnZlc3RZaWVsZENvbmZpZ1NldEV2ZW50AAAAAAIAAAAAAAAAB2FjY291bnQAAAAAEwAAAAAAAAAOcmVpbnZlc3RfeWllbGQAAAAAAAE=",
        "AAAAAgAAAAAAAAAAAAAAE1RyYW5jaGVWYXVsdERhdGFLZXkAAAAABQAAAAEAAAAAAAAADkFwcHJvdmVkTGVuZGVyAAAAAAABAAAAEwAAAAEAAAAAAAAADURlcG9zaXRSZWNvcmQAAAAAAAABAAAAEwAAAAAAAAAAAAAAEllpZWxkUGF5b3V0TGVuZGVycwAAAAAAAQAAAAAAAAAWTGVuZGVyUmVkZW1wdGlvblJlY29yZAAAAAAAAQAAABMAAAABAAAAAAAAABZFcG9jaFJlZGVtcHRpb25TdW1tYXJ5AAAAAAABAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADURlcG9zaXRSZWNvcmQAAAAAAAADAAAAAAAAABFsYXN0X2RlcG9zaXRfdGltZQAAAAAAAAYAAAAAAAAACXByaW5jaXBhbAAAAAAAAAoAAAAAAAAADnJlaW52ZXN0X3lpZWxkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAAFkxlbmRlclJlZGVtcHRpb25SZWNvcmQAAAAAAAUAAAAAAAAAGG5leHRfZXBvY2hfaWRfdG9fcHJvY2VzcwAAAAYAAAAAAAAAFG51bV9zaGFyZXNfcmVxdWVzdGVkAAAACgAAAAAAAAATcHJpbmNpcGFsX3JlcXVlc3RlZAAAAAAKAAAAAAAAABZ0b3RhbF9hbW91bnRfcHJvY2Vzc2VkAAAAAAAKAAAAAAAAABZ0b3RhbF9hbW91bnRfd2l0aGRyYXduAAAAAAAK",
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
        "AAAAAgAAAAAAAAAAAAAAClBvb2xTdGF0dXMAAAAAAAMAAAAAAAAAAAAAAANPZmYAAAAAAAAAAAAAAAACT24AAAAAAAAAAAAAAAAABkNsb3NlZAAA",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA=",
        "AAAAAQAAAAAAAAAAAAAAFkVwb2NoUmVkZW1wdGlvblN1bW1hcnkAAAAAAAQAAAAAAAAACGVwb2NoX2lkAAAABgAAAAAAAAAWdG90YWxfYW1vdW50X3Byb2Nlc3NlZAAAAAAACgAAAAAAAAAWdG90YWxfc2hhcmVzX3Byb2Nlc3NlZAAAAAAACgAAAAAAAAAWdG90YWxfc2hhcmVzX3JlcXVlc3RlZAAAAAAACg==" ]),
      options
    )
  }

  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        add_approved_lender: this.txFromJSON<null>,
        remove_approved_lender: this.txFromJSON<null>,
        set_reinvest_yield: this.txFromJSON<null>,
        make_initial_deposit: this.txFromJSON<u128>,
        deposit: this.txFromJSON<u128>,
        pay_out_yield_to_lenders: this.txFromJSON<null>,
        add_redemption_request: this.txFromJSON<null>,
        cancel_redemption_request: this.txFromJSON<null>,
        disburse: this.txFromJSON<null>,
        withdraw_after_pool_closure: this.txFromJSON<null>,
        execute_redemption_summary: this.txFromJSON<null>,
        cancellable_redemption_shares: this.txFromJSON<u128>,
        withdrawable_assets: this.txFromJSON<u128>,
        get_latest_redemption_record: this.txFromJSON<LenderRedemptionRecord>,
        total_supply: this.txFromJSON<u128>,
        balance_of: this.txFromJSON<u128>,
        total_assets: this.txFromJSON<u128>,
        total_assets_of: this.txFromJSON<u128>,
        convert_to_shares: this.txFromJSON<u128>,
        convert_to_assets: this.txFromJSON<u128>,
        is_approved_lender: this.txFromJSON<boolean>,
        get_deposit_record: this.txFromJSON<DepositRecord>,
        get_epoch_redemption_summary: this.txFromJSON<EpochRedemptionSummary>,
        get_redemption_record: this.txFromJSON<LenderRedemptionRecord>,
        allowance: this.txFromJSON<i128>,
        approve: this.txFromJSON<null>,
        balance: this.txFromJSON<i128>,
        transfer: this.txFromJSON<null>,
        transfer_from: this.txFromJSON<null>,
        burn: this.txFromJSON<null>,
        burn_from: this.txFromJSON<null>,
        decimals: this.txFromJSON<u32>,
        name: this.txFromJSON<string>,
        symbol: this.txFromJSON<string>
  }
}