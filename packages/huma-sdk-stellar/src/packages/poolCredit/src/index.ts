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
    contractId: "CBLRPVB4NXFF2I5I4FRRHU72PX6PJVL5YIEQIIJWKK2SUGS6Q3P2HXPR",
  }
} as const

export type ClientDataKey = {tag: "Pool", values: void} | {tag: "PoolManager", values: void};

export type CreditDataKey = {tag: "CreditConfig", values: readonly [Buffer]} | {tag: "CreditRecord", values: readonly [Buffer]} | {tag: "DueDetail", values: readonly [Buffer]} | {tag: "Borrower", values: readonly [Buffer]};


/**
 * A credit has been approved.
 * # Fields:
 * * `borrower` - The address of the borrower.
 * * `credit_hash` - The hash of the credit.
 * * `credit_limit` - The maximum amount that can be borrowed.
 * * `period_duration` - The duration of each pay period, e.g., monthly, quarterly, or semi-annually.
 * * `remaining_periods` - The number of periods before the credit expires.
 * * `yield_bps` - The expected yield expressed in basis points, where 1% is 100, and 100% is 10,000.
 * * `committed_amount` - The amount that the borrower has committed to use. If the used credit
 * is less than this amount, the borrower will be charged yield using this amount.
 * * `designated_start_date` - The date after which the credit can start.
 * * `revolving` - A flag indicating if repeated borrowing is allowed.
 */
export interface CreditApprovedEvent {
  borrower: string;
  committed_amount: u128;
  credit_hash: Buffer;
  credit_limit: u128;
  designated_start_date: u64;
  period_duration: PayPeriodDuration;
  remaining_periods: u32;
  revolving: boolean;
  yield_bps: u32;
}


/**
 * Account billing info refreshed with the updated due amount and date.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 * * `new_due_date` - The updated due date of the bill.
 * * `next_due` - The amount of next due on the bill.
 * * `total_past_due` - The total amount of past due on the bill.
 */
export interface BillRefreshedEvent {
  credit_hash: Buffer;
  new_due_date: u64;
  next_due: u128;
  total_past_due: u128;
}


/**
 * A credit has been borrowed from.
 * # Fields:
 * * `borrower` - The address of the borrower.
 * * `borrow_amount` - The amount the user has borrowed.
 * * `net_amount_to_borrower` - The borrowing amount minus the fees that are charged upfront.
 */
export interface DrawdownMadeEvent {
  borrow_amount: u128;
  borrower: string;
  net_amount_to_borrower: u128;
}


/**
 * A payment has been made against the credit.
 * # Fields:
 * * `borrower` - The address of the borrower.
 * * `amount` - The payback amount.
 * * `next_due_date` - The due date of the next payment.
 * * `yield_due` - The yield due on the credit after processing the payment.
 * * `principal_due` - The principal due on the credit after processing the payment.
 * * `yield_due_paid` - The amount of this payment applied to yield due in the current billing cycle.
 * * `principal_due_paid` - The amount of this payment applied to principal due in the current billing cycle.
 * * `unbilled_principal_paid` - The amount of this payment applied to unbilled principal.
 * * `yield_past_due_paid` - The amount of this payment applied to yield past due.
 * * `late_fee_paid` - The amount of this payment applied to late fee.
 * * `principal_past_due_paid` - The amount of this payment applied to principal past due.
 */
export interface PaymentMadeEvent {
  amount: u128;
  borrower: string;
  late_fee_paid: u128;
  next_due_date: u64;
  principal_due: u128;
  principal_due_paid: u128;
  principal_past_due_paid: u128;
  unbilled_principal_paid: u128;
  yield_due: u128;
  yield_due_paid: u128;
  yield_past_due_paid: u128;
}


/**
 * A principal payment has been made against the credit.
 * # Fields:
 * * `borrower` - The address of the borrower.
 * * `payer` - The address from which the money is coming.
 * * `amount` - The payback amount.
 * * `next_due_date` - The due date of the next payment.
 * * `principal_due` - The principal due on the credit after processing the payment.
 * * `unbilled_principal` - The unbilled principal on the credit after processing the payment.
 * * `principal_due_paid` - The amount of this payment applied to principal due.
 * * `unbilled_principal_paid` - The amount of this payment applied to unbilled principal.
 */
export interface PrincipalPaymentMadeEvent {
  amount: u128;
  borrower: string;
  next_due_date: u64;
  principal_due: u128;
  principal_due_paid: u128;
  unbilled_principal: u128;
  unbilled_principal_paid: u128;
}


/**
 * An existing credit has been closed.
 * # Fields:
 * * `credit_hash` - The credit hash.
 */
export interface CreditClosedAfterPayOffEvent {
  credit_hash: Buffer;
}


/**
 * A credit with a committed amount has started.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 */
export interface CommittedCreditStartedEvent {
  credit_hash: Buffer;
}


/**
 * An existing credit has been closed by an admin.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 */
export interface CreditClosedByAdminEvent {
  credit_hash: Buffer;
}


/**
 * The credit has been marked as Defaulted.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 * * `principal_loss` - The principal losses to be written off because of the default.
 * * `yield_loss` - The unpaid yield due to be written off.
 * * `fees_loss` - The unpaid fees to be written off.
 */
export interface DefaultTriggeredEvent {
  credit_hash: Buffer;
  fees_loss: u128;
  principal_loss: u128;
  yield_loss: u128;
}


/**
 * The expiration (maturity) date of a credit has been extended.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 * * `old_remaining_periods` - The number of remaining pay periods before the extension.
 * * `new_remaining_periods` - The number of remaining pay periods after the extension.
 */
export interface RemainingPeriodsExtendedEvent {
  credit_hash: Buffer;
  new_remaining_periods: u32;
  old_remaining_periods: u32;
}


/**
 * The yield of a credit has been updated.
 * # Fields:
 * * `credit_hash` - The credit hash.
 * * `old_yield_bps` - The old yield in basis points before the update.
 * * `new_yield_bps` - The new yield in basis points after the update.
 */
export interface YieldUpdatedEvent {
  credit_hash: Buffer;
  new_yield_bps: u32;
  old_yield_bps: u32;
}


/**
 * The credit limit and committed amount of a credit have been updated.
 * # Fields:
 * * `credit_hash` - The credit hash.
 * * `old_credit_limit` - The old credit limit before the update.
 * * `new_credit_limit` - The new credit limit after the update.
 * * `old_committed_amount` - The old committed amount before the update.
 * * `new_committed_amount` - The new committed amount after the update.
 */
export interface LimitAndCommitmentUpdatedEvent {
  credit_hash: Buffer;
  new_committed_amount: u128;
  new_credit_limit: u128;
  old_committed_amount: u128;
  old_credit_limit: u128;
}


/**
 * Part or all of the late fee due of a credit has been waived.
 * # Fields:
 * * `credit_hash` - The credit hash.
 * * `old_late_fee` - The amount of late fee before the update.
 * * `new_late_fee` - The amount of late fee after the update.
 */
export interface LateFeeWaivedEvent {
  credit_hash: Buffer;
  new_late_fee: u128;
  old_late_fee: u128;
}

export type CreditState = {tag: "Deleted", values: void} | {tag: "Approved", values: void} | {tag: "GoodStanding", values: void} | {tag: "Delayed", values: void} | {tag: "Defaulted", values: void};


/**
 * `CreditConfig` keeps track of the static settings of a credit.
 * A `CreditConfig` is created after the approval of each credit.
 * # Fields:
 * * `credit_limit` - The maximum amount that can be borrowed.
 * * `committed_amount` - The amount that the borrower has committed to use. If the used credit
 * is less than this amount, the borrower will be charged yield using this amount.
 * * `pay_period_duration` - The duration of each pay period, e.g., monthly, quarterly, or semi-annually.
 * * `num_of_periods` - The number of periods before the credit expires.
 * * `yield_bps` - The expected yield expressed in basis points, where 1% is 100, and 100% is 10,000. It means different things
 * for different credit types:
 * 1. For credit line, it is APR.
 * 2. For factoring, it is factoring fee for the given period.
 * 3. For dynamic yield credit, it is the estimated APY.
 * * `revolving` - A flag indicating if repeated borrowing is allowed.
 */
export interface CreditConfig {
  committed_amount: u128;
  credit_limit: u128;
  num_periods: u32;
  pay_period_duration: PayPeriodDuration;
  revolving: boolean;
  yield_bps: u32;
}


export interface CreditRecord {
  missed_periods: u32;
  next_due: u128;
  next_due_date: u64;
  remaining_periods: u32;
  state: CreditState;
  total_past_due: u128;
  unbilled_principal: u128;
  yield_due: u128;
}


export interface DueDetail {
  accrued: u128;
  committed: u128;
  late_fee: u128;
  late_fee_updated_date: u64;
  paid: u128;
  principal_past_due: u128;
  yield_past_due: u128;
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
  initialize: ({pool, pool_manager}: {pool: string, pool_manager: string}, options?: {
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
   * Construct and simulate a get_credit_hash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_credit_hash: ({borrower}: {borrower: string}, options?: {
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
  }) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a get_credit_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_credit_config: ({credit_hash}: {credit_hash: Buffer}, options?: {
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
  }) => Promise<AssembledTransaction<CreditConfig>>

  /**
   * Construct and simulate a get_credit_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_credit_record: ({credit_hash}: {credit_hash: Buffer}, options?: {
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
  }) => Promise<AssembledTransaction<CreditRecord>>

  /**
   * Construct and simulate a get_due_detail transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_due_detail: ({credit_hash}: {credit_hash: Buffer}, options?: {
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
  }) => Promise<AssembledTransaction<DueDetail>>

  /**
   * Construct and simulate a get_borrower transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_borrower: ({credit_hash}: {credit_hash: Buffer}, options?: {
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
   * Construct and simulate a get_due_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_due_info: ({borrower}: {borrower: string}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [CreditRecord, DueDetail]>>

  /**
   * Construct and simulate a get_next_bill_refresh_date transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_next_bill_refresh_date: ({borrower}: {borrower: string}, options?: {
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
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a approve_borrower transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve_borrower: ({borrower, credit_limit, num_periods, yield_bps, committed_amount, designated_start_date, revolving}: {borrower: string, credit_limit: u128, num_periods: u32, yield_bps: u32, committed_amount: u128, designated_start_date: u64, revolving: boolean}, options?: {
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
   * Construct and simulate a start_committed_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  start_committed_credit: ({caller, borrower}: {caller: string, borrower: string}, options?: {
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
   * Construct and simulate a drawdown transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  drawdown: ({borrower, amount}: {borrower: string, amount: u128}, options?: {
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
   * Construct and simulate a make_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  make_payment: ({caller, borrower, amount}: {caller: string, borrower: string, amount: u128}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [u128, boolean]>>

  /**
   * Construct and simulate a make_principal_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  make_principal_payment: ({borrower, amount}: {borrower: string, amount: u128}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [u128, boolean]>>

  /**
   * Construct and simulate a refresh_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  refresh_credit: ({borrower}: {borrower: string}, options?: {
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
   * Construct and simulate a is_default_ready transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_default_ready: ({borrower}: {borrower: string}, options?: {
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
   * Construct and simulate a trigger_default transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  trigger_default: ({borrower}: {borrower: string}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [u128, u128, u128]>>

  /**
   * Construct and simulate a update_yield transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_yield: ({borrower, new_yield_bps}: {borrower: string, new_yield_bps: u32}, options?: {
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
   * Construct and simulate a extend_remaining_period transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  extend_remaining_period: ({borrower, num_of_periods}: {borrower: string, num_of_periods: u32}, options?: {
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
   * Construct and simulate a update_limit_and_commitment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_limit_and_commitment: ({borrower, new_credit_limit, new_committed_amount}: {borrower: string, new_credit_limit: u128, new_committed_amount: u128}, options?: {
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
   * Construct and simulate a waive_late_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  waive_late_fee: ({borrower, amount}: {borrower: string, amount: u128}, options?: {
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
   * Construct and simulate a close_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  close_credit: ({caller, borrower}: {caller: string, borrower: string}, options?: {
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

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAACAAAAAAAAAAAAAAAEUG9vbAAAAAAAAAAAAAAAC1Bvb2xNYW5hZ2VyAA==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfbWFuYWdlcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAPZ2V0X2NyZWRpdF9oYXNoAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAARZ2V0X2NyZWRpdF9jb25maWcAAAAAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAEAAAfQAAAADENyZWRpdENvbmZpZw==",
        "AAAAAAAAAAAAAAARZ2V0X2NyZWRpdF9yZWNvcmQAAAAAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAEAAAfQAAAADENyZWRpdFJlY29yZA==",
        "AAAAAAAAAAAAAAAOZ2V0X2R1ZV9kZXRhaWwAAAAAAAEAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAgAAAAAQAAB9AAAAAJRHVlRGV0YWlsAAAA",
        "AAAAAAAAAAAAAAAMZ2V0X2JvcnJvd2VyAAAAAQAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAMZ2V0X2R1ZV9pbmZvAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAA+0AAAACAAAH0AAAAAxDcmVkaXRSZWNvcmQAAAfQAAAACUR1ZURldGFpbAAAAA==",
        "AAAAAAAAAAAAAAAaZ2V0X25leHRfYmlsbF9yZWZyZXNoX2RhdGUAAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAAG",
        "AAAAAAAAAAAAAAAQYXBwcm92ZV9ib3Jyb3dlcgAAAAcAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAMY3JlZGl0X2xpbWl0AAAACgAAAAAAAAALbnVtX3BlcmlvZHMAAAAABAAAAAAAAAAJeWllbGRfYnBzAAAAAAAABAAAAAAAAAAQY29tbWl0dGVkX2Ftb3VudAAAAAoAAAAAAAAAFWRlc2lnbmF0ZWRfc3RhcnRfZGF0ZQAAAAAAAAYAAAAAAAAACXJldm9sdmluZwAAAAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAWc3RhcnRfY29tbWl0dGVkX2NyZWRpdAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAIZHJhd2Rvd24AAAACAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAAMbWFrZV9wYXltZW50AAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAEAAAPtAAAAAgAAAAoAAAAB",
        "AAAAAAAAAAAAAAAWbWFrZV9wcmluY2lwYWxfcGF5bWVudAAAAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAAZhbW91bnQAAAAAAAoAAAABAAAD7QAAAAIAAAAKAAAAAQ==",
        "AAAAAAAAAAAAAAAOcmVmcmVzaF9jcmVkaXQAAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAQaXNfZGVmYXVsdF9yZWFkeQAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAAB",
        "AAAAAAAAAAAAAAAPdHJpZ2dlcl9kZWZhdWx0AAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAPtAAAAAwAAAAoAAAAKAAAACg==",
        "AAAAAAAAAAAAAAAMdXBkYXRlX3lpZWxkAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA1uZXdfeWllbGRfYnBzAAAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAXZXh0ZW5kX3JlbWFpbmluZ19wZXJpb2QAAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA5udW1fb2ZfcGVyaW9kcwAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAbdXBkYXRlX2xpbWl0X2FuZF9jb21taXRtZW50AAAAAAMAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAQbmV3X2NyZWRpdF9saW1pdAAAAAoAAAAAAAAAFG5ld19jb21taXR0ZWRfYW1vdW50AAAACgAAAAA=",
        "AAAAAAAAAAAAAAAOd2FpdmVfbGF0ZV9mZWUAAAAAAAIAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAQAAAAo=",
        "AAAAAAAAAAAAAAAMY2xvc2VfY3JlZGl0AAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAA",
        "AAAAAgAAAAAAAAAAAAAADUNyZWRpdERhdGFLZXkAAAAAAAAEAAAAAQAAAAAAAAAMQ3JlZGl0Q29uZmlnAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAMQ3JlZGl0UmVjb3JkAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAJRHVlRGV0YWlsAAAAAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAIQm9ycm93ZXIAAAABAAAD7gAAACA=",
        "AAAAAQAAAv5BIGNyZWRpdCBoYXMgYmVlbiBhcHByb3ZlZC4KIyBGaWVsZHM6CiogYGJvcnJvd2VyYCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBib3Jyb3dlci4KKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGhhc2ggb2YgdGhlIGNyZWRpdC4KKiBgY3JlZGl0X2xpbWl0YCAtIFRoZSBtYXhpbXVtIGFtb3VudCB0aGF0IGNhbiBiZSBib3Jyb3dlZC4KKiBgcGVyaW9kX2R1cmF0aW9uYCAtIFRoZSBkdXJhdGlvbiBvZiBlYWNoIHBheSBwZXJpb2QsIGUuZy4sIG1vbnRobHksIHF1YXJ0ZXJseSwgb3Igc2VtaS1hbm51YWxseS4KKiBgcmVtYWluaW5nX3BlcmlvZHNgIC0gVGhlIG51bWJlciBvZiBwZXJpb2RzIGJlZm9yZSB0aGUgY3JlZGl0IGV4cGlyZXMuCiogYHlpZWxkX2Jwc2AgLSBUaGUgZXhwZWN0ZWQgeWllbGQgZXhwcmVzc2VkIGluIGJhc2lzIHBvaW50cywgd2hlcmUgMSUgaXMgMTAwLCBhbmQgMTAwJSBpcyAxMCwwMDAuCiogYGNvbW1pdHRlZF9hbW91bnRgIC0gVGhlIGFtb3VudCB0aGF0IHRoZSBib3Jyb3dlciBoYXMgY29tbWl0dGVkIHRvIHVzZS4gSWYgdGhlIHVzZWQgY3JlZGl0CmlzIGxlc3MgdGhhbiB0aGlzIGFtb3VudCwgdGhlIGJvcnJvd2VyIHdpbGwgYmUgY2hhcmdlZCB5aWVsZCB1c2luZyB0aGlzIGFtb3VudC4KKiBgZGVzaWduYXRlZF9zdGFydF9kYXRlYCAtIFRoZSBkYXRlIGFmdGVyIHdoaWNoIHRoZSBjcmVkaXQgY2FuIHN0YXJ0LgoqIGByZXZvbHZpbmdgIC0gQSBmbGFnIGluZGljYXRpbmcgaWYgcmVwZWF0ZWQgYm9ycm93aW5nIGlzIGFsbG93ZWQuAAAAAAAAAAAAE0NyZWRpdEFwcHJvdmVkRXZlbnQAAAAACQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAABBjb21taXR0ZWRfYW1vdW50AAAACgAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADGNyZWRpdF9saW1pdAAAAAoAAAAAAAAAFWRlc2lnbmF0ZWRfc3RhcnRfZGF0ZQAAAAAAAAYAAAAAAAAAD3BlcmlvZF9kdXJhdGlvbgAAAAfQAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAAAAABFyZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAACXJldm9sdmluZwAAAAAAAAEAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAR9BY2NvdW50IGJpbGxpbmcgaW5mbyByZWZyZXNoZWQgd2l0aCB0aGUgdXBkYXRlZCBkdWUgYW1vdW50IGFuZCBkYXRlLgojIEZpZWxkczoKKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGhhc2ggb2YgdGhlIGNyZWRpdC4KKiBgbmV3X2R1ZV9kYXRlYCAtIFRoZSB1cGRhdGVkIGR1ZSBkYXRlIG9mIHRoZSBiaWxsLgoqIGBuZXh0X2R1ZWAgLSBUaGUgYW1vdW50IG9mIG5leHQgZHVlIG9uIHRoZSBiaWxsLgoqIGB0b3RhbF9wYXN0X2R1ZWAgLSBUaGUgdG90YWwgYW1vdW50IG9mIHBhc3QgZHVlIG9uIHRoZSBiaWxsLgAAAAAAAAAAEkJpbGxSZWZyZXNoZWRFdmVudAAAAAAABAAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADG5ld19kdWVfZGF0ZQAAAAYAAAAAAAAACG5leHRfZHVlAAAACgAAAAAAAAAOdG90YWxfcGFzdF9kdWUAAAAAAAo=",
        "AAAAAQAAAOdBIGNyZWRpdCBoYXMgYmVlbiBib3Jyb3dlZCBmcm9tLgojIEZpZWxkczoKKiBgYm9ycm93ZXJgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGJvcnJvd2VyLgoqIGBib3Jyb3dfYW1vdW50YCAtIFRoZSBhbW91bnQgdGhlIHVzZXIgaGFzIGJvcnJvd2VkLgoqIGBuZXRfYW1vdW50X3RvX2JvcnJvd2VyYCAtIFRoZSBib3Jyb3dpbmcgYW1vdW50IG1pbnVzIHRoZSBmZWVzIHRoYXQgYXJlIGNoYXJnZWQgdXBmcm9udC4AAAAAAAAAABFEcmF3ZG93bk1hZGVFdmVudAAAAAAAAAMAAAAAAAAADWJvcnJvd19hbW91bnQAAAAAAAAKAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAAFm5ldF9hbW91bnRfdG9fYm9ycm93ZXIAAAAAAAo=",
        "AAAAAQAAA2ZBIHBheW1lbnQgaGFzIGJlZW4gbWFkZSBhZ2FpbnN0IHRoZSBjcmVkaXQuCiMgRmllbGRzOgoqIGBib3Jyb3dlcmAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgYm9ycm93ZXIuCiogYGFtb3VudGAgLSBUaGUgcGF5YmFjayBhbW91bnQuCiogYG5leHRfZHVlX2RhdGVgIC0gVGhlIGR1ZSBkYXRlIG9mIHRoZSBuZXh0IHBheW1lbnQuCiogYHlpZWxkX2R1ZWAgLSBUaGUgeWllbGQgZHVlIG9uIHRoZSBjcmVkaXQgYWZ0ZXIgcHJvY2Vzc2luZyB0aGUgcGF5bWVudC4KKiBgcHJpbmNpcGFsX2R1ZWAgLSBUaGUgcHJpbmNpcGFsIGR1ZSBvbiB0aGUgY3JlZGl0IGFmdGVyIHByb2Nlc3NpbmcgdGhlIHBheW1lbnQuCiogYHlpZWxkX2R1ZV9wYWlkYCAtIFRoZSBhbW91bnQgb2YgdGhpcyBwYXltZW50IGFwcGxpZWQgdG8geWllbGQgZHVlIGluIHRoZSBjdXJyZW50IGJpbGxpbmcgY3ljbGUuCiogYHByaW5jaXBhbF9kdWVfcGFpZGAgLSBUaGUgYW1vdW50IG9mIHRoaXMgcGF5bWVudCBhcHBsaWVkIHRvIHByaW5jaXBhbCBkdWUgaW4gdGhlIGN1cnJlbnQgYmlsbGluZyBjeWNsZS4KKiBgdW5iaWxsZWRfcHJpbmNpcGFsX3BhaWRgIC0gVGhlIGFtb3VudCBvZiB0aGlzIHBheW1lbnQgYXBwbGllZCB0byB1bmJpbGxlZCBwcmluY2lwYWwuCiogYHlpZWxkX3Bhc3RfZHVlX3BhaWRgIC0gVGhlIGFtb3VudCBvZiB0aGlzIHBheW1lbnQgYXBwbGllZCB0byB5aWVsZCBwYXN0IGR1ZS4KKiBgbGF0ZV9mZWVfcGFpZGAgLSBUaGUgYW1vdW50IG9mIHRoaXMgcGF5bWVudCBhcHBsaWVkIHRvIGxhdGUgZmVlLgoqIGBwcmluY2lwYWxfcGFzdF9kdWVfcGFpZGAgLSBUaGUgYW1vdW50IG9mIHRoaXMgcGF5bWVudCBhcHBsaWVkIHRvIHByaW5jaXBhbCBwYXN0IGR1ZS4AAAAAAAAAAAAQUGF5bWVudE1hZGVFdmVudAAAAAsAAAAAAAAABmFtb3VudAAAAAAACgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA1sYXRlX2ZlZV9wYWlkAAAAAAAACgAAAAAAAAANbmV4dF9kdWVfZGF0ZQAAAAAAAAYAAAAAAAAADXByaW5jaXBhbF9kdWUAAAAAAAAKAAAAAAAAABJwcmluY2lwYWxfZHVlX3BhaWQAAAAAAAoAAAAAAAAAF3ByaW5jaXBhbF9wYXN0X2R1ZV9wYWlkAAAAAAoAAAAAAAAAF3VuYmlsbGVkX3ByaW5jaXBhbF9wYWlkAAAAAAoAAAAAAAAACXlpZWxkX2R1ZQAAAAAAAAoAAAAAAAAADnlpZWxkX2R1ZV9wYWlkAAAAAAAKAAAAAAAAABN5aWVsZF9wYXN0X2R1ZV9wYWlkAAAAAAo=",
        "AAAAAQAAAk5BIHByaW5jaXBhbCBwYXltZW50IGhhcyBiZWVuIG1hZGUgYWdhaW5zdCB0aGUgY3JlZGl0LgojIEZpZWxkczoKKiBgYm9ycm93ZXJgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGJvcnJvd2VyLgoqIGBwYXllcmAgLSBUaGUgYWRkcmVzcyBmcm9tIHdoaWNoIHRoZSBtb25leSBpcyBjb21pbmcuCiogYGFtb3VudGAgLSBUaGUgcGF5YmFjayBhbW91bnQuCiogYG5leHRfZHVlX2RhdGVgIC0gVGhlIGR1ZSBkYXRlIG9mIHRoZSBuZXh0IHBheW1lbnQuCiogYHByaW5jaXBhbF9kdWVgIC0gVGhlIHByaW5jaXBhbCBkdWUgb24gdGhlIGNyZWRpdCBhZnRlciBwcm9jZXNzaW5nIHRoZSBwYXltZW50LgoqIGB1bmJpbGxlZF9wcmluY2lwYWxgIC0gVGhlIHVuYmlsbGVkIHByaW5jaXBhbCBvbiB0aGUgY3JlZGl0IGFmdGVyIHByb2Nlc3NpbmcgdGhlIHBheW1lbnQuCiogYHByaW5jaXBhbF9kdWVfcGFpZGAgLSBUaGUgYW1vdW50IG9mIHRoaXMgcGF5bWVudCBhcHBsaWVkIHRvIHByaW5jaXBhbCBkdWUuCiogYHVuYmlsbGVkX3ByaW5jaXBhbF9wYWlkYCAtIFRoZSBhbW91bnQgb2YgdGhpcyBwYXltZW50IGFwcGxpZWQgdG8gdW5iaWxsZWQgcHJpbmNpcGFsLgAAAAAAAAAAABlQcmluY2lwYWxQYXltZW50TWFkZUV2ZW50AAAAAAAABwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAADW5leHRfZHVlX2RhdGUAAAAAAAAGAAAAAAAAAA1wcmluY2lwYWxfZHVlAAAAAAAACgAAAAAAAAAScHJpbmNpcGFsX2R1ZV9wYWlkAAAAAAAKAAAAAAAAABJ1bmJpbGxlZF9wcmluY2lwYWwAAAAAAAoAAAAAAAAAF3VuYmlsbGVkX3ByaW5jaXBhbF9wYWlkAAAAAAo=",
        "AAAAAQAAAFBBbiBleGlzdGluZyBjcmVkaXQgaGFzIGJlZW4gY2xvc2VkLgojIEZpZWxkczoKKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGNyZWRpdCBoYXNoLgAAAAAAAAAcQ3JlZGl0Q2xvc2VkQWZ0ZXJQYXlPZmZFdmVudAAAAAEAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAg",
        "AAAAAQAAAGFBIGNyZWRpdCB3aXRoIGEgY29tbWl0dGVkIGFtb3VudCBoYXMgc3RhcnRlZC4KIyBGaWVsZHM6CiogYGNyZWRpdF9oYXNoYCAtIFRoZSBoYXNoIG9mIHRoZSBjcmVkaXQuAAAAAAAAAAAAABtDb21taXR0ZWRDcmVkaXRTdGFydGVkRXZlbnQAAAAAAQAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACA=",
        "AAAAAQAAAGNBbiBleGlzdGluZyBjcmVkaXQgaGFzIGJlZW4gY2xvc2VkIGJ5IGFuIGFkbWluLgojIEZpZWxkczoKKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGhhc2ggb2YgdGhlIGNyZWRpdC4AAAAAAAAAABhDcmVkaXRDbG9zZWRCeUFkbWluRXZlbnQAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIA==",
        "AAAAAQAAARxUaGUgY3JlZGl0IGhhcyBiZWVuIG1hcmtlZCBhcyBEZWZhdWx0ZWQuCiMgRmllbGRzOgoqIGBjcmVkaXRfaGFzaGAgLSBUaGUgaGFzaCBvZiB0aGUgY3JlZGl0LgoqIGBwcmluY2lwYWxfbG9zc2AgLSBUaGUgcHJpbmNpcGFsIGxvc3NlcyB0byBiZSB3cml0dGVuIG9mZiBiZWNhdXNlIG9mIHRoZSBkZWZhdWx0LgoqIGB5aWVsZF9sb3NzYCAtIFRoZSB1bnBhaWQgeWllbGQgZHVlIHRvIGJlIHdyaXR0ZW4gb2ZmLgoqIGBmZWVzX2xvc3NgIC0gVGhlIHVucGFpZCBmZWVzIHRvIGJlIHdyaXR0ZW4gb2ZmLgAAAAAAAAAVRGVmYXVsdFRyaWdnZXJlZEV2ZW50AAAAAAAABAAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAACWZlZXNfbG9zcwAAAAAAAAoAAAAAAAAADnByaW5jaXBhbF9sb3NzAAAAAAAKAAAAAAAAAAp5aWVsZF9sb3NzAAAAAAAK",
        "AAAAAQAAARxUaGUgZXhwaXJhdGlvbiAobWF0dXJpdHkpIGRhdGUgb2YgYSBjcmVkaXQgaGFzIGJlZW4gZXh0ZW5kZWQuCiMgRmllbGRzOgoqIGBjcmVkaXRfaGFzaGAgLSBUaGUgaGFzaCBvZiB0aGUgY3JlZGl0LgoqIGBvbGRfcmVtYWluaW5nX3BlcmlvZHNgIC0gVGhlIG51bWJlciBvZiByZW1haW5pbmcgcGF5IHBlcmlvZHMgYmVmb3JlIHRoZSBleHRlbnNpb24uCiogYG5ld19yZW1haW5pbmdfcGVyaW9kc2AgLSBUaGUgbnVtYmVyIG9mIHJlbWFpbmluZyBwYXkgcGVyaW9kcyBhZnRlciB0aGUgZXh0ZW5zaW9uLgAAAAAAAAAdUmVtYWluaW5nUGVyaW9kc0V4dGVuZGVkRXZlbnQAAAAAAAADAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAAAAAAVbmV3X3JlbWFpbmluZ19wZXJpb2RzAAAAAAAABAAAAAAAAAAVb2xkX3JlbWFpbmluZ19wZXJpb2RzAAAAAAAABA==",
        "AAAAAQAAAN1UaGUgeWllbGQgb2YgYSBjcmVkaXQgaGFzIGJlZW4gdXBkYXRlZC4KIyBGaWVsZHM6CiogYGNyZWRpdF9oYXNoYCAtIFRoZSBjcmVkaXQgaGFzaC4KKiBgb2xkX3lpZWxkX2Jwc2AgLSBUaGUgb2xkIHlpZWxkIGluIGJhc2lzIHBvaW50cyBiZWZvcmUgdGhlIHVwZGF0ZS4KKiBgbmV3X3lpZWxkX2Jwc2AgLSBUaGUgbmV3IHlpZWxkIGluIGJhc2lzIHBvaW50cyBhZnRlciB0aGUgdXBkYXRlLgAAAAAAAAAAAAARWWllbGRVcGRhdGVkRXZlbnQAAAAAAAADAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAAAAAANbmV3X3lpZWxkX2JwcwAAAAAAAAQAAAAAAAAADW9sZF95aWVsZF9icHMAAAAAAAAE",
        "AAAAAQAAAXtUaGUgY3JlZGl0IGxpbWl0IGFuZCBjb21taXR0ZWQgYW1vdW50IG9mIGEgY3JlZGl0IGhhdmUgYmVlbiB1cGRhdGVkLgojIEZpZWxkczoKKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGNyZWRpdCBoYXNoLgoqIGBvbGRfY3JlZGl0X2xpbWl0YCAtIFRoZSBvbGQgY3JlZGl0IGxpbWl0IGJlZm9yZSB0aGUgdXBkYXRlLgoqIGBuZXdfY3JlZGl0X2xpbWl0YCAtIFRoZSBuZXcgY3JlZGl0IGxpbWl0IGFmdGVyIHRoZSB1cGRhdGUuCiogYG9sZF9jb21taXR0ZWRfYW1vdW50YCAtIFRoZSBvbGQgY29tbWl0dGVkIGFtb3VudCBiZWZvcmUgdGhlIHVwZGF0ZS4KKiBgbmV3X2NvbW1pdHRlZF9hbW91bnRgIC0gVGhlIG5ldyBjb21taXR0ZWQgYW1vdW50IGFmdGVyIHRoZSB1cGRhdGUuAAAAAAAAAAAeTGltaXRBbmRDb21taXRtZW50VXBkYXRlZEV2ZW50AAAAAAAFAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAAAAAAUbmV3X2NvbW1pdHRlZF9hbW91bnQAAAAKAAAAAAAAABBuZXdfY3JlZGl0X2xpbWl0AAAACgAAAAAAAAAUb2xkX2NvbW1pdHRlZF9hbW91bnQAAAAKAAAAAAAAABBvbGRfY3JlZGl0X2xpbWl0AAAACg==",
        "AAAAAQAAAOJQYXJ0IG9yIGFsbCBvZiB0aGUgbGF0ZSBmZWUgZHVlIG9mIGEgY3JlZGl0IGhhcyBiZWVuIHdhaXZlZC4KIyBGaWVsZHM6CiogYGNyZWRpdF9oYXNoYCAtIFRoZSBjcmVkaXQgaGFzaC4KKiBgb2xkX2xhdGVfZmVlYCAtIFRoZSBhbW91bnQgb2YgbGF0ZSBmZWUgYmVmb3JlIHRoZSB1cGRhdGUuCiogYG5ld19sYXRlX2ZlZWAgLSBUaGUgYW1vdW50IG9mIGxhdGUgZmVlIGFmdGVyIHRoZSB1cGRhdGUuAAAAAAAAAAAAEkxhdGVGZWVXYWl2ZWRFdmVudAAAAAAAAwAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADG5ld19sYXRlX2ZlZQAAAAoAAAAAAAAADG9sZF9sYXRlX2ZlZQAAAAo=",
        "AAAAAgAAAAAAAAAAAAAAC0NyZWRpdFN0YXRlAAAAAAUAAAAAAAAAAAAAAAdEZWxldGVkAAAAAAAAAAAAAAAACEFwcHJvdmVkAAAAAAAAAAAAAAAMR29vZFN0YW5kaW5nAAAAAAAAAAAAAAAHRGVsYXllZAAAAAAAAAAAAAAAAAlEZWZhdWx0ZWQAAAA=",
        "AAAAAQAAA4tgQ3JlZGl0Q29uZmlnYCBrZWVwcyB0cmFjayBvZiB0aGUgc3RhdGljIHNldHRpbmdzIG9mIGEgY3JlZGl0LgpBIGBDcmVkaXRDb25maWdgIGlzIGNyZWF0ZWQgYWZ0ZXIgdGhlIGFwcHJvdmFsIG9mIGVhY2ggY3JlZGl0LgojIEZpZWxkczoKKiBgY3JlZGl0X2xpbWl0YCAtIFRoZSBtYXhpbXVtIGFtb3VudCB0aGF0IGNhbiBiZSBib3Jyb3dlZC4KKiBgY29tbWl0dGVkX2Ftb3VudGAgLSBUaGUgYW1vdW50IHRoYXQgdGhlIGJvcnJvd2VyIGhhcyBjb21taXR0ZWQgdG8gdXNlLiBJZiB0aGUgdXNlZCBjcmVkaXQKaXMgbGVzcyB0aGFuIHRoaXMgYW1vdW50LCB0aGUgYm9ycm93ZXIgd2lsbCBiZSBjaGFyZ2VkIHlpZWxkIHVzaW5nIHRoaXMgYW1vdW50LgoqIGBwYXlfcGVyaW9kX2R1cmF0aW9uYCAtIFRoZSBkdXJhdGlvbiBvZiBlYWNoIHBheSBwZXJpb2QsIGUuZy4sIG1vbnRobHksIHF1YXJ0ZXJseSwgb3Igc2VtaS1hbm51YWxseS4KKiBgbnVtX29mX3BlcmlvZHNgIC0gVGhlIG51bWJlciBvZiBwZXJpb2RzIGJlZm9yZSB0aGUgY3JlZGl0IGV4cGlyZXMuCiogYHlpZWxkX2Jwc2AgLSBUaGUgZXhwZWN0ZWQgeWllbGQgZXhwcmVzc2VkIGluIGJhc2lzIHBvaW50cywgd2hlcmUgMSUgaXMgMTAwLCBhbmQgMTAwJSBpcyAxMCwwMDAuIEl0IG1lYW5zIGRpZmZlcmVudCB0aGluZ3MKZm9yIGRpZmZlcmVudCBjcmVkaXQgdHlwZXM6CjEuIEZvciBjcmVkaXQgbGluZSwgaXQgaXMgQVBSLgoyLiBGb3IgZmFjdG9yaW5nLCBpdCBpcyBmYWN0b3JpbmcgZmVlIGZvciB0aGUgZ2l2ZW4gcGVyaW9kLgozLiBGb3IgZHluYW1pYyB5aWVsZCBjcmVkaXQsIGl0IGlzIHRoZSBlc3RpbWF0ZWQgQVBZLgoqIGByZXZvbHZpbmdgIC0gQSBmbGFnIGluZGljYXRpbmcgaWYgcmVwZWF0ZWQgYm9ycm93aW5nIGlzIGFsbG93ZWQuAAAAAAAAAAAMQ3JlZGl0Q29uZmlnAAAABgAAAAAAAAAQY29tbWl0dGVkX2Ftb3VudAAAAAoAAAAAAAAADGNyZWRpdF9saW1pdAAAAAoAAAAAAAAAC251bV9wZXJpb2RzAAAAAAQAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAJcmV2b2x2aW5nAAAAAAAAAQAAAAAAAAAJeWllbGRfYnBzAAAAAAAABA==",
        "AAAAAQAAAAAAAAAAAAAADENyZWRpdFJlY29yZAAAAAgAAAAAAAAADm1pc3NlZF9wZXJpb2RzAAAAAAAEAAAAAAAAAAhuZXh0X2R1ZQAAAAoAAAAAAAAADW5leHRfZHVlX2RhdGUAAAAAAAAGAAAAAAAAABFyZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAABXN0YXRlAAAAAAAH0AAAAAtDcmVkaXRTdGF0ZQAAAAAAAAAADnRvdGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAABJ1bmJpbGxlZF9wcmluY2lwYWwAAAAAAAoAAAAAAAAACXlpZWxkX2R1ZQAAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAACUR1ZURldGFpbAAAAAAAAAcAAAAAAAAAB2FjY3J1ZWQAAAAACgAAAAAAAAAJY29tbWl0dGVkAAAAAAAACgAAAAAAAAAIbGF0ZV9mZWUAAAAKAAAAAAAAABVsYXRlX2ZlZV91cGRhdGVkX2RhdGUAAAAAAAAGAAAAAAAAAARwYWlkAAAACgAAAAAAAAAScHJpbmNpcGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAAA55aWVsZF9wYXN0X2R1ZQAAAAAACg==",
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
        get_credit_hash: this.txFromJSON<Buffer>,
        get_credit_config: this.txFromJSON<CreditConfig>,
        get_credit_record: this.txFromJSON<CreditRecord>,
        get_due_detail: this.txFromJSON<DueDetail>,
        get_borrower: this.txFromJSON<string>,
        get_due_info: this.txFromJSON<readonly [CreditRecord, DueDetail]>,
        get_next_bill_refresh_date: this.txFromJSON<u64>,
        approve_borrower: this.txFromJSON<null>,
        start_committed_credit: this.txFromJSON<null>,
        drawdown: this.txFromJSON<null>,
        make_payment: this.txFromJSON<readonly [u128, boolean]>,
        make_principal_payment: this.txFromJSON<readonly [u128, boolean]>,
        refresh_credit: this.txFromJSON<null>,
        is_default_ready: this.txFromJSON<boolean>,
        trigger_default: this.txFromJSON<readonly [u128, u128, u128]>,
        update_yield: this.txFromJSON<null>,
        extend_remaining_period: this.txFromJSON<null>,
        update_limit_and_commitment: this.txFromJSON<null>,
        waive_late_fee: this.txFromJSON<u128>,
        close_credit: this.txFromJSON<null>
  }
}