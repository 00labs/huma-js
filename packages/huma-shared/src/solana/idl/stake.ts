/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/voter_stake_registry.json`.
 */
export type VoterStakeRegistry = {
  address: 'vsRJM68m7i18PwzTFphgPYXTujCgxEi28knpUwSmg3q'
  metadata: {
    name: 'voterStakeRegistry'
    version: '0.2.4'
    spec: '0.1.0'
  }
  docs: [
    '# Introduction',
    '',
    'The governance registry is an "addin" to the SPL governance program that',
    'allows one to both vote with many different ypes of tokens for voting and to',
    'scale voting power as a linear function of time locked--subject to some',
    'maximum upper bound.',
    '',
    'The flow for voting with this program is as follows:',
    '',
    '- Create a SPL governance realm.',
    '- Create a governance registry account.',
    '- Add exchange rates for any tokens one wants to deposit. For example,',
    'if one wants to vote with tokens A and B, where token B has twice the',
    'voting power of token A, then the exchange rate of B would be 2 and the',
    'exchange rate of A would be 1.',
    '- Create a voter account.',
    '- Deposit tokens into this program, with an optional lockup period.',
    '- Vote.',
    '',
    'Upon voting with SPL governance, a client is expected to call',
    "`decay_voting_power` to get an up to date measurement of a given `Voter`'s",
    'voting power for the given slot. If this is not done, then the transaction',
    'will fail (since the SPL governance program will require the measurement',
    'to be active for the current slot).',
    '',
    '# Interacting with SPL Governance',
    '',
    'This program does not directly interact with SPL governance via CPI.',
    'Instead, it simply writes a `VoterWeightRecord` account with a well defined',
    'format, which is then used by SPL governance as the voting power measurement',
    'for a given user.',
    '',
    '# Max Vote Weight',
    '',
    'Given that one can use multiple tokens to vote, the max vote weight needs',
    'to be a function of the total supply of all tokens, converted into a common',
    'currency. For example, if you have Token A and Token B, where 1 Token B =',
    '10 Token A, then the `max_vote_weight` should be `supply(A) + supply(B)*10`',
    'where both are converted into common decimals. Then, when calculating the',
    'weight of an individual voter, one can convert B into A via the given',
    'exchange rate, which must be fixed.',
    '',
    'Note that the above also implies that the `max_vote_weight` must fit into',
    'a u64.',
  ]
  instructions: [
    {
      name: 'createRegistrar'
      discriminator: [132, 235, 36, 49, 139, 66, 202, 69]
      accounts: [
        {
          name: 'registrar'
          docs: [
            'The voting registrar. There can only be a single registrar',
            'per governance realm and governing mint.',
          ]
          writable: true
        },
        {
          name: 'realm'
          docs: [
            'An spl-governance realm',
            '',
            '- realm is owned by the governance_program_id',
            '- realm_governing_token_mint must be the community or council mint',
            '- realm_authority is realm.authority',
          ]
        },
        {
          name: 'governanceProgramId'
          docs: [
            'The program id of the spl-governance program the realm belongs to.',
          ]
        },
        {
          name: 'realmGoverningTokenMint'
          docs: ['Either the realm community mint or the council mint.']
        },
        {
          name: 'realmAuthority'
          signer: true
        },
        {
          name: 'payer'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
        },
        {
          name: 'rent'
        },
      ]
      args: [
        {
          name: 'registrarBump'
          type: 'u8'
        },
      ]
    },
    {
      name: 'configureVotingMint'
      discriminator: [113, 153, 141, 236, 184, 9, 135, 15]
      accounts: [
        {
          name: 'registrar'
          writable: true
        },
        {
          name: 'realmAuthority'
          signer: true
        },
        {
          name: 'mint'
          docs: ['Tokens of this mint will produce vote weight']
        },
      ]
      args: [
        {
          name: 'idx'
          type: 'u16'
        },
        {
          name: 'digitShift'
          type: 'i8'
        },
        {
          name: 'baselineVoteWeightScaledFactor'
          type: 'u64'
        },
        {
          name: 'maxExtraLockupVoteWeightScaledFactor'
          type: 'u64'
        },
        {
          name: 'lockupSaturationSecs'
          type: 'u64'
        },
        {
          name: 'grantAuthority'
          type: {
            option: 'pubkey'
          }
        },
      ]
    },
    {
      name: 'createVoter'
      discriminator: [6, 24, 245, 52, 243, 255, 148, 25]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'voterAuthority'
          docs: [
            'The authority controling the voter. Must be the same as the',
            '`governing_token_owner` in the token owner record used with',
            'spl-governance.',
          ]
          signer: true
        },
        {
          name: 'voterWeightRecord'
          docs: [
            'The voter weight record is the account that will be shown to spl-governance',
            'to prove how much vote weight the voter has. See update_voter_weight_record.',
          ]
          writable: true
        },
        {
          name: 'payer'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
        },
        {
          name: 'rent'
        },
        {
          name: 'instructions'
        },
      ]
      args: [
        {
          name: 'voterBump'
          type: 'u8'
        },
        {
          name: 'voterWeightRecordBump'
          type: 'u8'
        },
      ]
    },
    {
      name: 'createDepositEntry'
      discriminator: [185, 131, 167, 186, 159, 125, 19, 67]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'voterAuthority'
          signer: true
        },
        {
          name: 'payer'
          writable: true
          signer: true
        },
        {
          name: 'depositMint'
        },
        {
          name: 'systemProgram'
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
        },
        {
          name: 'rent'
        },
      ]
      args: [
        {
          name: 'depositEntryIndex'
          type: 'u8'
        },
        {
          name: 'kind'
          type: {
            defined: {
              name: 'lockupKind'
            }
          }
        },
        {
          name: 'startTs'
          type: {
            option: 'u64'
          }
        },
        {
          name: 'periods'
          type: 'u32'
        },
        {
          name: 'allowClawback'
          type: 'bool'
        },
      ]
    },
    {
      name: 'deposit'
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'depositToken'
          writable: true
        },
        {
          name: 'depositAuthority'
          signer: true
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'depositEntryIndex'
          type: 'u8'
        },
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'withdraw'
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'voterAuthority'
          signer: true
        },
        {
          name: 'tokenOwnerRecord'
          docs: [
            'The token_owner_record for the voter_authority. This is needed',
            'to be able to forbid withdraws while the voter is engaged with',
            'a vote or has an open proposal.',
            '',
            '- owned by registrar.governance_program_id',
            '- for the registrar.realm',
            '- for the registrar.realm_governing_token_mint',
            '- governing_token_owner is voter_authority',
          ]
        },
        {
          name: 'voterWeightRecord'
          docs: [
            'Withdraws must update the voter weight record, to prevent a stale',
            'record being used to vote after the withdraw.',
          ]
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'destination'
          writable: true
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'depositEntryIndex'
          type: 'u8'
        },
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'grant'
      discriminator: [145, 189, 68, 153, 161, 231, 76, 107]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'voterAuthority'
          docs: [
            'The account of the grantee / the address controlling the voter',
            'that the grant is going to.',
          ]
        },
        {
          name: 'voterWeightRecord'
          docs: [
            'The voter weight record is the account that will be shown to spl-governance',
            'to prove how much vote weight the voter has. See update_voter_weight_record.',
          ]
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'depositToken'
          writable: true
        },
        {
          name: 'tokenAuthority'
          docs: ['Authority for transfering tokens away from deposit_token']
          signer: true
        },
        {
          name: 'grantAuthority'
          docs: [
            'Authority for making a grant to this voter account',
            '',
            'Verification inline in instruction',
          ]
          signer: true
        },
        {
          name: 'payer'
          docs: ['Rent payer if a new account is to be created']
          writable: true
          signer: true
        },
        {
          name: 'depositMint'
        },
        {
          name: 'systemProgram'
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
        },
        {
          name: 'rent'
        },
      ]
      args: [
        {
          name: 'voterBump'
          type: 'u8'
        },
        {
          name: 'voterWeightRecordBump'
          type: 'u8'
        },
        {
          name: 'kind'
          type: {
            defined: {
              name: 'lockupKind'
            }
          }
        },
        {
          name: 'startTs'
          type: {
            option: 'u64'
          }
        },
        {
          name: 'periods'
          type: 'u32'
        },
        {
          name: 'allowClawback'
          type: 'bool'
        },
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'clawback'
      discriminator: [111, 92, 142, 79, 33, 234, 82, 27]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'realmAuthority'
          signer: true
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'destination'
          writable: true
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'depositEntryIndex'
          type: 'u8'
        },
      ]
    },
    {
      name: 'closeDepositEntry'
      discriminator: [236, 190, 87, 34, 251, 131, 138, 237]
      accounts: [
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'voterAuthority'
          signer: true
        },
      ]
      args: [
        {
          name: 'depositEntryIndex'
          type: 'u8'
        },
      ]
    },
    {
      name: 'resetLockup'
      discriminator: [243, 20, 24, 247, 238, 148, 94, 62]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'voterAuthority'
          signer: true
        },
      ]
      args: [
        {
          name: 'depositEntryIndex'
          type: 'u8'
        },
        {
          name: 'kind'
          type: {
            defined: {
              name: 'lockupKind'
            }
          }
        },
        {
          name: 'periods'
          type: 'u32'
        },
      ]
    },
    {
      name: 'internalTransferLocked'
      discriminator: [246, 200, 90, 231, 133, 22, 25, 220]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'voterAuthority'
          signer: true
        },
      ]
      args: [
        {
          name: 'sourceDepositEntryIndex'
          type: 'u8'
        },
        {
          name: 'targetDepositEntryIndex'
          type: 'u8'
        },
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'internalTransferUnlocked'
      discriminator: [95, 95, 252, 26, 102, 114, 142, 193]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'voterAuthority'
          signer: true
        },
      ]
      args: [
        {
          name: 'sourceDepositEntryIndex'
          type: 'u8'
        },
        {
          name: 'targetDepositEntryIndex'
          type: 'u8'
        },
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'updateVoterWeightRecord'
      discriminator: [45, 185, 3, 36, 109, 190, 115, 169]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
        },
        {
          name: 'voterWeightRecord'
          writable: true
        },
        {
          name: 'systemProgram'
        },
      ]
      args: []
    },
    {
      name: 'updateMaxVoteWeight'
      discriminator: [78, 221, 185, 255, 240, 128, 244, 162]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'maxVoteWeightRecord'
        },
      ]
      args: []
    },
    {
      name: 'closeVoter'
      discriminator: [117, 35, 234, 247, 206, 131, 182, 149]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
          writable: true
        },
        {
          name: 'voterAuthority'
          signer: true
        },
        {
          name: 'solDestination'
          writable: true
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: []
    },
    {
      name: 'logVoterInfo'
      discriminator: [171, 72, 233, 90, 143, 151, 113, 51]
      accounts: [
        {
          name: 'registrar'
        },
        {
          name: 'voter'
        },
      ]
      args: [
        {
          name: 'depositEntryBegin'
          type: 'u8'
        },
        {
          name: 'depositEntryCount'
          type: 'u8'
        },
      ]
    },
    {
      name: 'setTimeOffset'
      discriminator: [89, 238, 89, 160, 239, 113, 25, 123]
      accounts: [
        {
          name: 'registrar'
          writable: true
        },
        {
          name: 'realmAuthority'
          signer: true
        },
      ]
      args: [
        {
          name: 'timeOffset'
          type: 'i64'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'registrar'
      discriminator: [193, 202, 205, 51, 78, 168, 150, 128]
    },
    {
      name: 'voter'
      discriminator: [241, 93, 35, 191, 254, 147, 17, 202]
    },
  ]
  events: [
    {
      name: 'voterInfo'
      discriminator: [95, 159, 197, 100, 178, 17, 75, 128]
    },
    {
      name: 'depositEntryInfo'
      discriminator: [44, 254, 32, 111, 41, 39, 5, 148]
    },
  ]
  errors: [
    {
      code: 6000
      name: 'invalidRate'
      msg: 'Exchange rate must be greater than zero'
    },
    {
      code: 6001
      name: 'ratesFull'
      msg: ''
    },
    {
      code: 6002
      name: 'votingMintNotFound'
      msg: ''
    },
    {
      code: 6003
      name: 'depositEntryNotFound'
      msg: ''
    },
    {
      code: 6004
      name: 'depositEntryFull'
      msg: ''
    },
    {
      code: 6005
      name: 'votingTokenNonZero'
      msg: ''
    },
    {
      code: 6006
      name: 'outOfBoundsDepositEntryIndex'
      msg: ''
    },
    {
      code: 6007
      name: 'unusedDepositEntryIndex'
      msg: ''
    },
    {
      code: 6008
      name: 'insufficientUnlockedTokens'
      msg: ''
    },
    {
      code: 6009
      name: 'unableToConvert'
      msg: ''
    },
    {
      code: 6010
      name: 'invalidLockupPeriod'
      msg: ''
    },
    {
      code: 6011
      name: 'invalidEndTs'
      msg: ''
    },
    {
      code: 6012
      name: 'invalidDays'
      msg: ''
    },
    {
      code: 6013
      name: 'votingMintConfigIndexAlreadyInUse'
      msg: ''
    },
    {
      code: 6014
      name: 'outOfBoundsVotingMintConfigIndex'
      msg: ''
    },
    {
      code: 6015
      name: 'invalidDecimals'
      msg: 'Exchange rate decimals cannot be larger than registrar decimals'
    },
    {
      code: 6016
      name: 'invalidToDepositAndWithdrawInOneSlot'
      msg: ''
    },
    {
      code: 6017
      name: 'shouldBeTheFirstIxInATx'
      msg: ''
    },
    {
      code: 6018
      name: 'forbiddenCpi'
      msg: ''
    },
    {
      code: 6019
      name: 'invalidMint'
      msg: ''
    },
    {
      code: 6020
      name: 'debugInstruction'
      msg: ''
    },
    {
      code: 6021
      name: 'clawbackNotAllowedOnDeposit'
      msg: ''
    },
    {
      code: 6022
      name: 'depositStillLocked'
      msg: ''
    },
    {
      code: 6023
      name: 'invalidAuthority'
      msg: ''
    },
    {
      code: 6024
      name: 'invalidTokenOwnerRecord'
      msg: ''
    },
    {
      code: 6025
      name: 'invalidRealmAuthority'
      msg: ''
    },
    {
      code: 6026
      name: 'voterWeightOverflow'
      msg: ''
    },
    {
      code: 6027
      name: 'lockupSaturationMustBePositive'
      msg: ''
    },
    {
      code: 6028
      name: 'votingMintConfiguredWithDifferentIndex'
      msg: ''
    },
    {
      code: 6029
      name: 'internalProgramError'
      msg: ''
    },
    {
      code: 6030
      name: 'insufficientLockedTokens'
      msg: ''
    },
    {
      code: 6031
      name: 'mustKeepTokensLocked'
      msg: ''
    },
    {
      code: 6032
      name: 'invalidLockupKind'
      msg: ''
    },
    {
      code: 6033
      name: 'invalidChangeToClawbackDepositEntry'
      msg: ''
    },
    {
      code: 6034
      name: 'internalErrorBadLockupVoteWeight'
      msg: ''
    },
    {
      code: 6035
      name: 'depositStartTooFarInFuture'
      msg: ''
    },
    {
      code: 6036
      name: 'vaultTokenNonZero'
      msg: ''
    },
    {
      code: 6037
      name: 'invalidTimestampArguments'
      msg: ''
    },
  ]
  types: [
    {
      name: 'vestingInfo'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'rate'
            docs: ['Amount of tokens vested each period']
            type: 'u64'
          },
          {
            name: 'nextTimestamp'
            docs: ['Time of the next upcoming vesting']
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'lockingInfo'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            docs: ['Amount of locked tokens']
            type: 'u64'
          },
          {
            name: 'endTimestamp'
            docs: [
              'Time at which the lockup fully ends (None for Constant lockup)',
            ]
            type: {
              option: 'u64'
            }
          },
          {
            name: 'vesting'
            docs: ['Information about vesting, if any']
            type: {
              option: {
                defined: {
                  name: 'vestingInfo'
                }
              }
            }
          },
        ]
      }
    },
    {
      name: 'depositEntry'
      docs: [
        'Bookkeeping for a single deposit for a given mint and lockup schedule.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'lockup'
            type: {
              defined: {
                name: 'lockup'
              }
            }
          },
          {
            name: 'amountDepositedNative'
            docs: [
              'Amount in deposited, in native currency. Withdraws of vested tokens',
              'directly reduce this amount.',
              '',
              'This directly tracks the total amount added by the user. They may',
              'never withdraw more than this amount.',
            ]
            type: 'u64'
          },
          {
            name: 'amountInitiallyLockedNative'
            docs: [
              'Amount in locked when the lockup began, in native currency.',
              '',
              'Note that this is not adjusted for withdraws. It is possible for this',
              'value to be bigger than amount_deposited_native after some vesting',
              'and withdrawals.',
              '',
              'This value is needed to compute the amount that vests each peroid,',
              'which should not change due to withdraws.',
            ]
            type: 'u64'
          },
          {
            name: 'isUsed'
            type: 'bool'
          },
          {
            name: 'allowClawback'
            docs: [
              'If the clawback authority is allowed to extract locked tokens.',
            ]
            type: 'bool'
          },
          {
            name: 'votingMintConfigIdx'
            type: 'u8'
          },
          {
            name: 'reserved'
            type: {
              array: ['u8', 29]
            }
          },
        ]
      }
    },
    {
      name: 'lockup'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'startTs'
            docs: [
              'Start of the lockup.',
              '',
              'Note, that if start_ts is in the future, the funds are nevertheless',
              'locked up!',
              '',
              "Similarly vote power computations don't care about start_ts and always",
              'assume the full interval from now to end_ts.',
            ]
            type: 'i64'
          },
          {
            name: 'endTs'
            docs: ['End of the lockup.']
            type: 'i64'
          },
          {
            name: 'kind'
            docs: ['Type of lockup.']
            type: {
              defined: {
                name: 'lockupKind'
              }
            }
          },
          {
            name: 'reserved'
            type: {
              array: ['u8', 15]
            }
          },
        ]
      }
    },
    {
      name: 'votingMintConfig'
      docs: [
        'Exchange rate for an asset that can be used to mint voting rights.',
        '',
        'See documentation of configure_voting_mint for details on how',
        'native token amounts convert to vote weight.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'mint'
            docs: ['Mint for this entry.']
            type: 'pubkey'
          },
          {
            name: 'grantAuthority'
            docs: ['The authority that is allowed to push grants into voters']
            type: 'pubkey'
          },
          {
            name: 'baselineVoteWeightScaledFactor'
            docs: [
              'Vote weight factor for all funds in the account, no matter if locked or not.',
              '',
              'In 1/SCALED_FACTOR_BASE units.',
            ]
            type: 'u64'
          },
          {
            name: 'maxExtraLockupVoteWeightScaledFactor'
            docs: [
              'Maximum extra vote weight factor for lockups.',
              '',
              'This is the extra votes gained for lockups lasting lockup_saturation_secs or',
              'longer. Shorter lockups receive only a fraction of the maximum extra vote weight,',
              'based on lockup_time divided by lockup_saturation_secs.',
              '',
              'In 1/SCALED_FACTOR_BASE units.',
            ]
            type: 'u64'
          },
          {
            name: 'lockupSaturationSecs'
            docs: [
              'Number of seconds of lockup needed to reach the maximum lockup bonus.',
            ]
            type: 'u64'
          },
          {
            name: 'digitShift'
            docs: [
              'Number of digits to shift native amounts, applying a 10^digit_shift factor.',
            ]
            type: 'i8'
          },
          {
            name: 'reserved1'
            type: {
              array: ['u8', 7]
            }
          },
          {
            name: 'reserved2'
            type: {
              array: ['u64', 7]
            }
          },
        ]
      }
    },
    {
      name: 'lockupKind'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'none'
          },
          {
            name: 'daily'
          },
          {
            name: 'monthly'
          },
          {
            name: 'cliff'
          },
          {
            name: 'constant'
          },
        ]
      }
    },
    {
      name: 'registrar'
      docs: ['Instance of a voting rights distributor.']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'governanceProgramId'
            type: 'pubkey'
          },
          {
            name: 'realm'
            type: 'pubkey'
          },
          {
            name: 'realmGoverningTokenMint'
            type: 'pubkey'
          },
          {
            name: 'realmAuthority'
            type: 'pubkey'
          },
          {
            name: 'reserved1'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'votingMints'
            docs: [
              'Storage for voting mints and their configuration.',
              "The length should be adjusted for one's use case.",
            ]
            type: {
              array: [
                {
                  defined: {
                    name: 'votingMintConfig'
                  }
                },
                4,
              ]
            }
          },
          {
            name: 'timeOffset'
            docs: [
              'Debug only: time offset, to allow tests to move forward in time.',
            ]
            type: 'i64'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'reserved2'
            type: {
              array: ['u8', 7]
            }
          },
          {
            name: 'reserved3'
            type: {
              array: ['u64', 11]
            }
          },
        ]
      }
    },
    {
      name: 'voter'
      docs: ['User account for minting voting rights.']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'voterAuthority'
            type: 'pubkey'
          },
          {
            name: 'registrar'
            type: 'pubkey'
          },
          {
            name: 'deposits'
            type: {
              array: [
                {
                  defined: {
                    name: 'depositEntry'
                  }
                },
                32,
              ]
            }
          },
          {
            name: 'voterBump'
            type: 'u8'
          },
          {
            name: 'voterWeightRecordBump'
            type: 'u8'
          },
          {
            name: 'reserved'
            type: {
              array: ['u8', 94]
            }
          },
        ]
      }
    },
    {
      name: 'voterInfo'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'votingPower'
            type: 'u64'
          },
          {
            name: 'votingPowerBaseline'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'depositEntryInfo'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'depositEntryIndex'
            type: 'u8'
          },
          {
            name: 'votingMintConfigIndex'
            type: 'u8'
          },
          {
            name: 'unlocked'
            type: 'u64'
          },
          {
            name: 'votingPower'
            type: 'u64'
          },
          {
            name: 'votingPowerBaseline'
            type: 'u64'
          },
          {
            name: 'locking'
            type: {
              option: {
                defined: {
                  name: 'lockingInfo'
                }
              }
            }
          },
        ]
      }
    },
  ]
}
