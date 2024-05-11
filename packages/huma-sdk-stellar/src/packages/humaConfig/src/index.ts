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
    contractId: "CBIKE7DJOL3JK7NDACY257ZQV2WCOINFMOVOB6OFRKHRPP2556YY3WPW",
  }
} as const

export const Errors = {
  1: {message:""},
  2: {message:""},
  3: {message:""}
}
export type HumaConfigDataKey = {tag: "HumaOwner", values: void} | {tag: "HumaTreasury", values: void} | {tag: "Sentinel", values: void} | {tag: "ProtocolFeeInBps", values: void} | {tag: "IsPaused", values: void} | {tag: "Pauser", values: readonly [string]} | {tag: "ValidLiquidityAsset", values: readonly [string]};


/**
 * The Huma protocol has been initialized.
 * # Fields
 * * `huma_owner` - The address of the Huma owner account.
 * * `huma_treasury` - The address of the Huma treasury account.
 * * `sentinel` - The address of the Sentinel service account.
 */
export interface ProtocolInitializedEvent {
  huma_owner: string;
  huma_treasury: string;
  sentinel: string;
}


/**
 * The Huma protocol has been paused.
 * # Fields
 * * `paused` - Whether the protocol is paused. The value acts as a placeholder only to get around
 * the restriction that `contracttype` doesn't allow empty structs. The value is always `true`.
 */
export interface ProtocolPausedEvent {
  paused: boolean;
}


/**
 * The Huma protocol has been unpaused.
 * # Fields
 * * `paused` - Whether the protocol is paused. The value acts as a placeholder only to get around
 * the restriction that `contractype` doesn't allow empty structs. The value is always `false`.
 */
export interface ProtocolUnpausedEvent {
  paused: boolean;
}


/**
 * The treasury address for the Huma protocol has changed.
 * # Fields
 * * `treasury` - The address of the new Huma treasury.
 */
export interface HumaTreasuryChangedEvent {
  treasury: string;
}


/**
 * A pauser has been added. A pauser is someone who can pause the protocol.
 * # Fields
 * * `pauser` - The address of the pauser being added.
 */
export interface PauserAddedEvent {
  pauser: string;
}


/**
 * A pauser has been removed.
 * # Fields
 * * `pauser` - The address of the pauser being removed.
 */
export interface PauserRemovedEvent {
  pauser: string;
}


/**
 * New underlying asset supported by the protocol is added.
 * # Fields
 * * `asset` - The address of the liquidity asset being added.
 */
export interface LiquidityAssetAddedEvent {
  asset: string;
}


/**
 * Remove the asset that is no longer supported by the protocol.
 * # Fields
 * * `asset` - The address of the liquidity asset being removed.
 */
export interface LiquidityAssetRemovedEvent {
  asset: string;
}


/**
 * The account for the Sentinel Service has been changed.
 * # Fields
 * * `account` - The address of the new Sentinel Service.
 */
export interface SentinelServiceAccountChangedEvent {
  account: string;
}


/**
 * The protocol fee has been changed.
 * # Fields
 * * `old_fee_bps` - The old protocol fee in bps.
 * * `new_fee_bps` - The new protocol fee in bps.
 */
export interface ProtocolFeeChangedEvent {
  new_fee_bps: u32;
  old_fee_bps: u32;
}


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({huma_owner, huma_treasury, sentinel}: {huma_owner: string, huma_treasury: string, sentinel: string}, options?: {
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
   * Construct and simulate a get_huma_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_huma_owner: (options?: {
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
   * Construct and simulate a get_huma_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_huma_treasury: (options?: {
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
   * Construct and simulate a set_huma_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_huma_treasury: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a get_sentinel transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_sentinel: (options?: {
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
   * Construct and simulate a set_sentinel transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_sentinel: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a is_protocol_paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_protocol_paused: (options?: {
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
   * Construct and simulate a pause_protocol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause_protocol: ({caller}: {caller: string}, options?: {
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
   * Construct and simulate a unpause_protocol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unpause_protocol: (options?: {
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
   * Construct and simulate a is_pauser transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_pauser: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a add_pauser transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_pauser: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a remove_pauser transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_pauser: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a is_asset_valid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_asset_valid: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a set_liquidity_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_liquidity_asset: ({addr, valid}: {addr: string, valid: boolean}, options?: {
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
   * Construct and simulate a get_protocol_fee_bps transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_protocol_fee_bps: (options?: {
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
   * Construct and simulate a set_protocol_fee_bps transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_protocol_fee_bps: ({fee_bps}: {fee_bps: u32}, options?: {
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
      new ContractSpec([ "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAKaHVtYV9vd25lcgAAAAAAEwAAAAAAAAANaHVtYV90cmVhc3VyeQAAAAAAABMAAAAAAAAACHNlbnRpbmVsAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAOZ2V0X2h1bWFfb3duZXIAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAARZ2V0X2h1bWFfdHJlYXN1cnkAAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAARc2V0X2h1bWFfdHJlYXN1cnkAAAAAAAABAAAAAAAAAARhZGRyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAMZ2V0X3NlbnRpbmVsAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAMc2V0X3NlbnRpbmVsAAAAAQAAAAAAAAAEYWRkcgAAABMAAAAA",
        "AAAAAAAAAAAAAAASaXNfcHJvdG9jb2xfcGF1c2VkAAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAOcGF1c2VfcHJvdG9jb2wAAAAAAAEAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAQdW5wYXVzZV9wcm90b2NvbAAAAAAAAAAA",
        "AAAAAAAAAAAAAAAJaXNfcGF1c2VyAAAAAAAAAQAAAAAAAAAEYWRkcgAAABMAAAABAAAAAQ==",
        "AAAAAAAAAAAAAAAKYWRkX3BhdXNlcgAAAAAAAQAAAAAAAAAEYWRkcgAAABMAAAAA",
        "AAAAAAAAAAAAAAANcmVtb3ZlX3BhdXNlcgAAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAOaXNfYXNzZXRfdmFsaWQAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAATc2V0X2xpcXVpZGl0eV9hc3NldAAAAAACAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAFdmFsaWQAAAAAAAABAAAAAA==",
        "AAAAAAAAAAAAAAAUZ2V0X3Byb3RvY29sX2ZlZV9icHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAUc2V0X3Byb3RvY29sX2ZlZV9icHMAAAABAAAAAAAAAAdmZWVfYnBzAAAAAAQAAAAA",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAAAAAAAAaQ29udHJhY3RBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADlBhdXNlclJlcXVpcmVkAAAAAAACAAAAAAAAAB9Qcm90b2NvbEZlZUhpZ2hlclRoYW5VcHBlckxpbWl0AAAAAAM=",
        "AAAAAgAAAAAAAAAAAAAAEUh1bWFDb25maWdEYXRhS2V5AAAAAAAABwAAAAAAAAAAAAAACUh1bWFPd25lcgAAAAAAAAAAAAAAAAAADEh1bWFUcmVhc3VyeQAAAAAAAAAAAAAACFNlbnRpbmVsAAAAAAAAAAAAAAAQUHJvdG9jb2xGZWVJbkJwcwAAAAAAAAAAAAAACElzUGF1c2VkAAAAAQAAAAAAAAAGUGF1c2VyAAAAAAABAAAAEwAAAAEAAAAAAAAAE1ZhbGlkTGlxdWlkaXR5QXNzZXQAAAAAAQAAABM=",
        "AAAAAQAAAOJUaGUgSHVtYSBwcm90b2NvbCBoYXMgYmVlbiBpbml0aWFsaXplZC4KIyBGaWVsZHMKKiBgaHVtYV9vd25lcmAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgSHVtYSBvd25lciBhY2NvdW50LgoqIGBodW1hX3RyZWFzdXJ5YCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBIdW1hIHRyZWFzdXJ5IGFjY291bnQuCiogYHNlbnRpbmVsYCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBTZW50aW5lbCBzZXJ2aWNlIGFjY291bnQuAAAAAAAAAAAAGFByb3RvY29sSW5pdGlhbGl6ZWRFdmVudAAAAAMAAAAAAAAACmh1bWFfb3duZXIAAAAAABMAAAAAAAAADWh1bWFfdHJlYXN1cnkAAAAAAAATAAAAAAAAAAhzZW50aW5lbAAAABM=",
        "AAAAAQAAAOhUaGUgSHVtYSBwcm90b2NvbCBoYXMgYmVlbiBwYXVzZWQuCiMgRmllbGRzCiogYHBhdXNlZGAgLSBXaGV0aGVyIHRoZSBwcm90b2NvbCBpcyBwYXVzZWQuIFRoZSB2YWx1ZSBhY3RzIGFzIGEgcGxhY2Vob2xkZXIgb25seSB0byBnZXQgYXJvdW5kCnRoZSByZXN0cmljdGlvbiB0aGF0IGBjb250cmFjdHR5cGVgIGRvZXNuJ3QgYWxsb3cgZW1wdHkgc3RydWN0cy4gVGhlIHZhbHVlIGlzIGFsd2F5cyBgdHJ1ZWAuAAAAAAAAABNQcm90b2NvbFBhdXNlZEV2ZW50AAAAAAEAAAAAAAAABnBhdXNlZAAAAAAAAQ==",
        "AAAAAQAAAOpUaGUgSHVtYSBwcm90b2NvbCBoYXMgYmVlbiB1bnBhdXNlZC4KIyBGaWVsZHMKKiBgcGF1c2VkYCAtIFdoZXRoZXIgdGhlIHByb3RvY29sIGlzIHBhdXNlZC4gVGhlIHZhbHVlIGFjdHMgYXMgYSBwbGFjZWhvbGRlciBvbmx5IHRvIGdldCBhcm91bmQKdGhlIHJlc3RyaWN0aW9uIHRoYXQgYGNvbnRyYWN0eXBlYCBkb2Vzbid0IGFsbG93IGVtcHR5IHN0cnVjdHMuIFRoZSB2YWx1ZSBpcyBhbHdheXMgYGZhbHNlYC4AAAAAAAAAAAAVUHJvdG9jb2xVbnBhdXNlZEV2ZW50AAAAAAAAAQAAAAAAAAAGcGF1c2VkAAAAAAAB",
        "AAAAAQAAAHVUaGUgdHJlYXN1cnkgYWRkcmVzcyBmb3IgdGhlIEh1bWEgcHJvdG9jb2wgaGFzIGNoYW5nZWQuCiMgRmllbGRzCiogYHRyZWFzdXJ5YCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBuZXcgSHVtYSB0cmVhc3VyeS4AAAAAAAAAAAAAGEh1bWFUcmVhc3VyeUNoYW5nZWRFdmVudAAAAAEAAAAAAAAACHRyZWFzdXJ5AAAAEw==",
        "AAAAAQAAAIVBIHBhdXNlciBoYXMgYmVlbiBhZGRlZC4gQSBwYXVzZXIgaXMgc29tZW9uZSB3aG8gY2FuIHBhdXNlIHRoZSBwcm90b2NvbC4KIyBGaWVsZHMKKiBgcGF1c2VyYCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBwYXVzZXIgYmVpbmcgYWRkZWQuAAAAAAAAAAAAABBQYXVzZXJBZGRlZEV2ZW50AAAAAQAAAAAAAAAGcGF1c2VyAAAAAAAT",
        "AAAAAQAAAFlBIHBhdXNlciBoYXMgYmVlbiByZW1vdmVkLgojIEZpZWxkcwoqIGBwYXVzZXJgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHBhdXNlciBiZWluZyByZW1vdmVkLgAAAAAAAAAAAAASUGF1c2VyUmVtb3ZlZEV2ZW50AAAAAAABAAAAAAAAAAZwYXVzZXIAAAAAABM=",
        "AAAAAQAAAH1OZXcgdW5kZXJseWluZyBhc3NldCBzdXBwb3J0ZWQgYnkgdGhlIHByb3RvY29sIGlzIGFkZGVkLgojIEZpZWxkcwoqIGBhc3NldGAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgbGlxdWlkaXR5IGFzc2V0IGJlaW5nIGFkZGVkLgAAAAAAAAAAAAAYTGlxdWlkaXR5QXNzZXRBZGRlZEV2ZW50AAAAAQAAAAAAAAAFYXNzZXQAAAAAAAAT",
        "AAAAAQAAAIRSZW1vdmUgdGhlIGFzc2V0IHRoYXQgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCBieSB0aGUgcHJvdG9jb2wuCiMgRmllbGRzCiogYGFzc2V0YCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBsaXF1aWRpdHkgYXNzZXQgYmVpbmcgcmVtb3ZlZC4AAAAAAAAAGkxpcXVpZGl0eUFzc2V0UmVtb3ZlZEV2ZW50AAAAAAABAAAAAAAAAAVhc3NldAAAAAAAABM=",
        "AAAAAQAAAHZUaGUgYWNjb3VudCBmb3IgdGhlIFNlbnRpbmVsIFNlcnZpY2UgaGFzIGJlZW4gY2hhbmdlZC4KIyBGaWVsZHMKKiBgYWNjb3VudGAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgbmV3IFNlbnRpbmVsIFNlcnZpY2UuAAAAAAAAAAAAIlNlbnRpbmVsU2VydmljZUFjY291bnRDaGFuZ2VkRXZlbnQAAAAAAAEAAAAAAAAAB2FjY291bnQAAAAAEw==",
        "AAAAAQAAAIlUaGUgcHJvdG9jb2wgZmVlIGhhcyBiZWVuIGNoYW5nZWQuCiMgRmllbGRzCiogYG9sZF9mZWVfYnBzYCAtIFRoZSBvbGQgcHJvdG9jb2wgZmVlIGluIGJwcy4KKiBgbmV3X2ZlZV9icHNgIC0gVGhlIG5ldyBwcm90b2NvbCBmZWUgaW4gYnBzLgAAAAAAAAAAAAAXUHJvdG9jb2xGZWVDaGFuZ2VkRXZlbnQAAAAAAgAAAAAAAAALbmV3X2ZlZV9icHMAAAAABAAAAAAAAAALb2xkX2ZlZV9icHMAAAAABA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        get_huma_owner: this.txFromJSON<string>,
        get_huma_treasury: this.txFromJSON<string>,
        set_huma_treasury: this.txFromJSON<null>,
        get_sentinel: this.txFromJSON<string>,
        set_sentinel: this.txFromJSON<null>,
        is_protocol_paused: this.txFromJSON<boolean>,
        pause_protocol: this.txFromJSON<null>,
        unpause_protocol: this.txFromJSON<null>,
        is_pauser: this.txFromJSON<boolean>,
        add_pauser: this.txFromJSON<null>,
        remove_pauser: this.txFromJSON<null>,
        is_asset_valid: this.txFromJSON<boolean>,
        set_liquidity_asset: this.txFromJSON<null>,
        get_protocol_fee_bps: this.txFromJSON<u32>,
        set_protocol_fee_bps: this.txFromJSON<null>
  }
}