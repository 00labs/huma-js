/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/permissionless.json`.
 */
export type Permissionless = {
  address: 'HumaXepHnjaRCpjYTokxY4UtaJcmx41prQ8cxGmFC5fn'
  metadata: {
    name: 'permissionless'
    version: '3.0.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'addMode'
      docs: [
        'Adds a mode to the pool.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `mode_id` - The mode ID.',
        '* `mode_name` - The mode name.',
        '* `target_apy_bps` - The target annual percentage yield (APY) for the underlying assets',
        'deposited, expressed in basis points.',
        '* `token_metadata_args` - The mode token metadata parameters.',
        '',
        '# Dev Notes',
        'See the docs for `ModeConfig` on how `target_apy_bps` is related to the actual APY used',
        'for calculation.',
        '',
        '# Access Control',
        'Only the pool owner can call this instruction.',
      ]
      discriminator: [136, 187, 228, 193, 168, 107, 113, 144]
      accounts: [
        {
          name: 'poolOwner'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'modeConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'modeId'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'tokenMetadata'
          docs: ['The token metadata account.']
          writable: true
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'mplTokenMetadataProgram'
          docs: ['The MPL Token Metadata program.']
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'sysvarInstructionsProgram'
          address: 'Sysvar1nstructions1111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'modeId'
          type: 'pubkey'
        },
        {
          name: 'modeName'
          type: 'string'
        },
        {
          name: 'targetApyBps'
          type: 'u16'
        },
        {
          name: 'tokenMetadataArgs'
          type: {
            defined: {
              name: 'manageModeTokenMetadataArgs'
            }
          }
        },
      ]
    },
    {
      name: 'addPoolOperator'
      docs: [
        'Adds a new operator to the pool.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `operator` - The address of the pool operator.',
        '',
        '# Access Control',
        'Only the pool owner can call this instruction.',
      ]
      discriminator: [87, 245, 32, 78, 182, 157, 163, 249]
      accounts: [
        {
          name: 'poolOwner'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolOperatorConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'operator'
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'operator'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'addRedemptionRequest'
      docs: [
        'Adds a new redemption request.',
        '',
        '# Arguments',
        '* `shares` - The number of shares the lender wants to redeem.',
        '',
        '# Trigger Condition',
        'Only when both the protocol and the pool are on.',
        '',
        '# Access Control',
        'Only lenders can call this instruction.',
      ]
      discriminator: [72, 203, 201, 17, 75, 60, 157, 47]
      accounts: [
        {
          name: 'lender'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'redemptionRequest'
          writable: true
        },
        {
          name: 'lenderState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
              {
                kind: 'account'
                path: 'lender'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'lenderModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'shares'
          type: 'u128'
        },
      ]
    },
    {
      name: 'addStrategyManagerWallet'
      docs: [
        'Adds a new wallet for the strategy manager to the pool.',
        '',
        '# Trigger Condition',
        'Only when the protocol and pool are both on.',
        '',
        '# Arguments',
        '* `wallet` - The wallet address.',
        '',
        '# Access Control',
        'Only the pool owner can call this instruction.',
      ]
      discriminator: [195, 173, 154, 48, 102, 125, 181, 237]
      accounts: [
        {
          name: 'poolOwner'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'strategyManagerWallet'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114,
                  95,
                  119,
                  97,
                  108,
                  108,
                  101,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'wallet'
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'wallet'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'cancelRedemptionRequest'
      docs: [
        'Reduces the number of shares request for redemption.',
        '',
        '# Arguments',
        '* `shares` - The number of shares in the redemption request to be canceled.',
        '',
        '# Trigger Condition',
        'Only when both the protocol and the pool are on.',
        '',
        '# Access Control',
        'Only the pool owner and the Sentinel service account can call this instruction.',
      ]
      discriminator: [77, 155, 4, 179, 114, 233, 162, 45]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'redemptionRequest'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  100,
                  101,
                  109,
                  112,
                  116,
                  105,
                  111,
                  110,
                  95,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'redemption_request.id'
                account: 'redemptionRequest'
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'lenderModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'redemption_request.lender'
                account: 'redemptionRequest'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'shares'
          type: 'u128'
        },
      ]
    },
    {
      name: 'changePoolOwner'
      docs: [
        'Changes the pool owner.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `new_owner` - The new pool owner.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [169, 55, 183, 24, 152, 180, 167, 11]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'newOwner'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'closeLenderAccounts'
      docs: [
        'Closes the accounts owned by the lender.',
        '',
        '# Trigger Condition',
        'N/A. The instruction can be triggered at any time.',
        '',
        '# Access Control',
        'Only lenders can call this instruction.',
      ]
      discriminator: [222, 126, 36, 205, 193, 173, 194, 224]
      accounts: [
        {
          name: 'lender'
          writable: true
          signer: true
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'lenderState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
              {
                kind: 'account'
                path: 'lender'
              },
            ]
          }
        },
        {
          name: 'lenderModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: []
    },
    {
      name: 'closePool'
      docs: [
        'Closes the pool after its maturity.',
        '',
        '# Trigger Condition',
        'Only when the pool is in the pre-closure status.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [140, 189, 209, 23, 239, 62, 239, 11]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: []
    },
    {
      name: 'createLenderAccounts'
      docs: [
        'Creates the accounts necessary for a lender.',
        '',
        '# Trigger Condition',
        '1. For the pool owner treasury: when the pool is not closed.',
        '2. For other lenders: when both the protocol and pool are on.',
        '',
        '# Access Control',
        'Anyone can call this instruction.',
      ]
      discriminator: [28, 111, 222, 8, 126, 83, 44, 69]
      accounts: [
        {
          name: 'lender'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'lenderState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
              {
                kind: 'account'
                path: 'lender'
              },
            ]
          }
        },
        {
          name: 'lenderModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'createPool'
      docs: [
        'Creates a new permissionless pool.',
        '',
        '# Arguments',
        '* `pool_id` - The ID of the pool.',
        '* `pool_name` - The name of the pool.',
        '* `pool_owner_treasury` - The address of the pool owner treasury, which will be responsible',
        'for providing initial liquidity and receiving pool owner fees.',
        '',
        '# Trigger Condition',
        'N/A. The instruction can be triggered at any time.',
        '',
        '# Access Control',
        'Anyone can call this instruction. The signer will become the owner of the pool.',
      ]
      discriminator: [233, 146, 209, 142, 207, 104, 64, 188]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
        },
        {
          name: 'liquidityAsset'
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'arg'
                path: 'poolId'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'poolId'
          type: 'pubkey'
        },
        {
          name: 'poolName'
          type: 'string'
        },
        {
          name: 'poolOwnerTreasury'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'declareLoss'
      docs: [
        'Declares loss on an investment.',
        '',
        '# Trigger Condition',
        'When the protocol is on, and the pool is either on or in the pre-closure status.',
        '',
        '# Dev Notes',
        'It is possible for the strategy manager to deploy and return liquidity after loss declaration.',
        '',
        '# Access Control',
        'Only strategy manager wallets can call this instruction.',
      ]
      discriminator: [51, 202, 154, 130, 65, 132, 242, 188]
      accounts: [
        {
          name: 'wallet'
          signer: true
          relations: ['strategyManagerWallet']
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'strategyManagerWallet'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114,
                  95,
                  119,
                  97,
                  108,
                  108,
                  101,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'strategy_manager_wallet.wallet'
                account: 'strategyManagerWallet'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'loss'
          type: 'u128'
        },
      ]
    },
    {
      name: 'deployLiquidity'
      docs: [
        'Deploys liquidity from the pool to investment opportunities.',
        '',
        '# Trigger Condition',
        'When the protocol is on, and the pool is either on or in the pre-closure status. Deployment',
        'is allowed in pre-closure in case the strategy manager accidentally pays more liquidity back',
        'than required for withdrawal and needs to take the funds back.',
        '',
        '# Arguments',
        '* `amount` - The amount to deploy.',
        '',
        '# Access Control',
        'Only strategy manager wallets can call this instruction.',
      ]
      discriminator: [49, 35, 101, 76, 93, 4, 31, 53]
      accounts: [
        {
          name: 'wallet'
          signer: true
          relations: ['strategyManagerWallet']
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'strategyManagerWallet'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114,
                  95,
                  119,
                  97,
                  108,
                  108,
                  101,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'strategy_manager_wallet.wallet'
                account: 'strategyManagerWallet'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'strategyManagerUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'wallet'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u128'
        },
      ]
    },
    {
      name: 'deposit'
      docs: [
        'LP deposits to the pool to earn yield and share losses.',
        '',
        'All deposits should be made by calling this instruction and',
        "`make_initial_deposit()` (for the pool owner's initial deposit) only.",
        'Please do NOT directly transfer any crypto assets to the pool,',
        'which will cause a permanent loss, and we cannot help reverse transactions',
        'or retrieve assets.',
        '',
        '# Arguments',
        '* `assets` - The amount of underlying assets to be deposited.',
        '* `commitment` - The commitment type of the deposit. This is needed by other systems in the',
        'Huma protocol to track the commitment status of the deposit.',
        '* `commitment_auto_renewal` - Whether the commitment automatically renews after expiration.',
        'This is needed by other systems in the Huma protocol to track the commitment status of',
        'the deposit.',
        '',
        '# Returns',
        'The number of mode token minted.',
        '',
        '# Trigger Condition',
        'Only when both the protocol and the pool are on.',
        '',
        '# Access Control',
        'Only approved lenders can call this instruction.',
        '',
        '# Dev Notes',
        '1. `commitment` and `commitment_auto_renewal` are not used by the program.',
        'They are pass-through arguments used by other systems in the Huma protocol to detect',
        'deposit commitment violations.',
        "2. The parameter `commitment` has type `String` instead of `enum` so that we don't have to",
        'upgrade the program when we add additional commitment types/alter existing ones.',
      ]
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182]
      accounts: [
        {
          name: 'depositor'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'underlyingTokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'depositorUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'depositor'
              },
              {
                kind: 'account'
                path: 'underlyingTokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'depositorModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'depositor'
              },
              {
                kind: 'account'
                path: 'modeTokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'underlyingTokenProgram'
        },
        {
          name: 'modeTokenProgram'
        },
      ]
      args: [
        {
          name: 'assets'
          type: 'u64'
        },
        {
          name: 'commitment'
          type: 'string'
        },
        {
          name: 'commitmentAutoRenewal'
          type: 'bool'
        },
      ]
      returns: 'u64'
    },
    {
      name: 'disablePool'
      docs: [
        'Disables the pool. Once a pool is disabled, no money moves in or out.',
        '',
        '# Trigger Condition',
        'Only when the pool is on.',
        '',
        '# Access Control',
        'Only pool operators can call this instruction.',
      ]
      discriminator: [248, 118, 211, 160, 149, 150, 135, 37]
      accounts: [
        {
          name: 'poolOperator'
          signer: true
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolOperatorConfig'
        },
      ]
      args: []
    },
    {
      name: 'disburse'
      docs: [
        'Transfers all the amount that has been redeemed but not yet disbursed to the lender.',
        '',
        '# Trigger Condition',
        'When the protocol is on, and the pool is either on or in the pre-closure status.',
        '',
        '# Access Control',
        'Only lenders can call this instruction.',
      ]
      discriminator: [68, 250, 205, 89, 217, 142, 13, 44]
      accounts: [
        {
          name: 'lender'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'lenderState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
              {
                kind: 'account'
                path: 'lender'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'lenderUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: []
    },
    {
      name: 'enablePool'
      docs: [
        'Turns on the pool. Before a pool is turned on, the required mode liquidity must be',
        'deposited first.',
        '',
        '# Trigger Condition',
        'N/A. The instruction can be triggered at any time.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [120, 47, 0, 69, 84, 74, 16, 177]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
      ]
      args: []
    },
    {
      name: 'enterPreClosure'
      docs: [
        'Puts the pool in pre-closure status so that final processing can happen to prepare',
        'for closure. Pool assets will be refreshed one last time and lenders will no longer accrue',
        'yields after the pool enters the pre-closure status.',
        '',
        '# Trigger Condition',
        'N/A. The instruction can be triggered at any time.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [236, 246, 62, 133, 60, 195, 118, 151]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
      ]
      args: []
    },
    {
      name: 'makeInitialDeposit'
      docs: [
        'Allows the pool owner to make initial deposit before the pool goes live.',
        '',
        '# Arguments',
        '* `assets` - The amount of underlying assets to be deposited.',
        '* `commitment` - The commitment type of the deposit.',
        '',
        '# Returns',
        'The number of mode token minted.',
        '',
        '# Trigger Condition',
        'When the protocol is on and the pool is not closed.',
        '',
        '# Access Control',
        'Only authorized initial depositors can call this instruction.',
        '',
        '# Dev Notes',
        'The parameter `commitment` has type `String` instead of `enum` so that we can avoid program',
        'upgrade when we add additional commitment types in the future.',
      ]
      discriminator: [141, 233, 75, 102, 37, 93, 94, 79]
      accounts: [
        {
          name: 'poolOwnerTreasury'
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'underlyingTokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'poolOwnerTreasuryUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolOwnerTreasury'
              },
              {
                kind: 'account'
                path: 'underlyingTokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'poolOwnerTreasuryModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolOwnerTreasury'
              },
              {
                kind: 'account'
                path: 'modeTokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'underlyingTokenProgram'
        },
        {
          name: 'modeTokenProgram'
        },
      ]
      args: [
        {
          name: 'assets'
          type: 'u64'
        },
        {
          name: 'commitment'
          type: 'string'
        },
      ]
      returns: 'u64'
    },
    {
      name: 'payBackLiquidity'
      docs: [
        'Pays back liquidity to the pool.',
        '',
        '# Trigger Condition',
        'When the protocol is on, and the pool is either on or in the pre-closure status.',
        '',
        '# Arguments',
        '* `amount` - The amount to pay back.',
        '',
        '# Access Control',
        'Only strategy manager wallets can call this instruction.',
      ]
      discriminator: [97, 171, 224, 78, 162, 164, 181, 228]
      accounts: [
        {
          name: 'wallet'
          signer: true
          relations: ['strategyManagerWallet']
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'strategyManagerWallet'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114,
                  95,
                  119,
                  97,
                  108,
                  108,
                  101,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'strategy_manager_wallet.wallet'
                account: 'strategyManagerWallet'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'strategyManagerUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'wallet'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u128'
        },
      ]
    },
    {
      name: 'processRedemptionRequest'
      docs: [
        'Processes the redemption request at the beginning of the redemption queue.',
        '',
        '# Trigger Condition',
        'When the protocol is on, and the pool is either on or in the pre-closure status.',
        '',
        '# Access Control',
        'Only the pool owner and the Sentinel service account can call this instruction.',
      ]
      discriminator: [211, 90, 36, 251, 91, 185, 216, 35]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'lender'
          docs: [
            'The recipient of the `RedemptionRequest` account rent refunds after closure.',
            '`has_one` constraint.',
          ]
          writable: true
          relations: ['redemptionRequest']
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'redemptionRequest'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  100,
                  101,
                  109,
                  112,
                  116,
                  105,
                  111,
                  110,
                  95,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'redemption_request.id'
                account: 'redemptionRequest'
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'lenderState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
              {
                kind: 'account'
                path: 'lender'
              },
            ]
          }
        },
        {
          name: 'strategyManagerWallet'
          docs: [
            'Strategy managers wallets are allowed to process redemption requests. If the signer',
            'is a strategy manager wallet this account needs to be passed in for validation. Otherwise,',
            'the account can be left as `None`.',
          ]
          optional: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114,
                  95,
                  119,
                  97,
                  108,
                  108,
                  101,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'strategy_manager_wallet.wallet'
                account: 'strategyManagerWallet'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'underlyingTokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'lenderUnderlyingToken'
          docs: [
            'The account is optional to prevent an attack where a lender closes their underlying token',
            'account and consequently blocks the redemption request from being processed.',
          ]
          writable: true
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'underlyingTokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'poolModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'modeTokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'underlyingTokenProgram'
        },
        {
          name: 'modeTokenProgram'
        },
      ]
      args: []
    },
    {
      name: 'refreshPoolAssets'
      docs: [
        'Refreshes the assets in all modes to bring them up to date.',
        '',
        '# Trigger Condition',
        'When the protocol is on and the pool is not closed. When the pool is in pre-closure,',
        'this instruction is a no-op.',
        '',
        '# Access Control',
        'Anyone can call this instruction.',
      ]
      discriminator: [179, 220, 112, 1, 214, 103, 3, 230]
      accounts: [
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
      ]
      args: []
    },
    {
      name: 'removeMode'
      docs: [
        'Removes a mode from the pool. Please note that this instruction applies solely to the',
        'reversal of unintentional mode additions. Consequently, the following conditions must',
        'be met for the removal to go through:',
        '1. No mode token has been minted.',
        '2. The mode state must be empty.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `mode_id` - The ID of the mode to remove.',
        '',
        '# Access Control',
        'Only the pool owner can call this instruction.',
      ]
      discriminator: [36, 197, 69, 56, 254, 146, 192, 62]
      accounts: [
        {
          name: 'poolOwner'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'modeId'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'poolModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'modeId'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'removePoolOperator'
      docs: [
        'Adds an operator from the pool.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `operator` - The address of the pool operator.',
        '',
        '# Access Control',
        'Only the pool owner can call this instruction.',
      ]
      discriminator: [70, 188, 152, 173, 117, 213, 144, 195]
      accounts: [
        {
          name: 'poolOwner'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolOperatorConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'operator'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'operator'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'removeStrategyManagerWallet'
      docs: [
        'Removes a wallet for the strategy manager from the pool.',
        '',
        '# Trigger Condition',
        'Only when the protocol and pool are both on.',
        '',
        '# Access Control',
        'Only the pool owner can call this instruction.',
      ]
      discriminator: [66, 249, 21, 34, 38, 197, 167, 96]
      accounts: [
        {
          name: 'poolOwner'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'strategyManagerWallet'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  115,
                  116,
                  114,
                  97,
                  116,
                  101,
                  103,
                  121,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114,
                  95,
                  119,
                  97,
                  108,
                  108,
                  101,
                  116,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'strategy_manager_wallet.wallet'
                account: 'strategyManagerWallet'
              },
            ]
          }
        },
      ]
      args: []
    },
    {
      name: 'setLpConfig'
      docs: [
        'Sets Liquidity Provider configurations.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `configs` - The new configurations.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [243, 188, 179, 176, 217, 83, 174, 65]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
      ]
      args: [
        {
          name: 'configs'
          type: {
            defined: {
              name: 'lpConfig'
            }
          }
        },
      ]
    },
    {
      name: 'setPoolOwnerTreasury'
      docs: [
        'Sets the pool owner treasury.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `new_treasury` - The address of the new pool owner treasury.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [95, 26, 200, 33, 36, 107, 65, 219]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'newTreasury'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'switchMode'
      docs: [
        "Switches a lender's investment from one mode to another.",
        '',
        '# Trigger Condition',
        'Only when both the protocol and pool are on.',
        '',
        '# Arguments',
        '* `shares` - The number of shares the lender wants to switch.',
        '* `investment_id` - The ID of the investment.',
        '',
        '# Dev Notes',
        "`investment_id` is not used by the program. It's a pass-through argument used by other",
        'systems in the Huma protocol to detect deposit commitment violations.',
        '',
        '# Access Control',
        'Only lenders can call this instruction.',
      ]
      discriminator: [69, 115, 235, 74, 208, 155, 108, 62]
      accounts: [
        {
          name: 'lender'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'sourceModeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'source_mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'sourceModeMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'sourceModeConfig'
              },
            ]
          }
        },
        {
          name: 'sourceModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'sourceModeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'destinationModeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'destination_mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'destinationModeMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'destinationModeConfig'
              },
            ]
          }
        },
        {
          name: 'destinationModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'destinationModeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'tokenProgram'
        },
      ]
      args: [
        {
          name: 'shares'
          type: 'u128'
        },
        {
          name: 'investmentId'
          type: 'string'
        },
      ]
    },
    {
      name: 'updateModeApy'
      docs: [
        'Updates mode APY. Both the target and periodic APYs will be updated.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `new_target_apy_bps` - The target annual percentage yield (APY) for the underlying assets',
        'deposited, expressed in basis points.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [2, 35, 3, 169, 206, 20, 85, 86]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'newTargetApyBps'
          type: 'u16'
        },
      ]
    },
    {
      name: 'updateModeName'
      docs: [
        'Updates mode name.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `new_name` - The new name of the mode.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [161, 162, 16, 147, 165, 200, 140, 12]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'newName'
          type: 'string'
        },
      ]
    },
    {
      name: 'updateModeTokenMetadata'
      docs: [
        'Updates mode token metadata.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `args` - The parameters in the token metadata.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [146, 105, 133, 105, 200, 19, 3, 221]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'tokenMetadata'
          docs: ['The token metadata account.']
          writable: true
        },
        {
          name: 'mplTokenMetadataProgram'
          docs: ['The MPL Token Metadata program.']
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
        },
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'manageModeTokenMetadataArgs'
            }
          }
        },
      ]
    },
    {
      name: 'updatePoolName'
      docs: [
        'Updates pool name.',
        '',
        '# Trigger Condition',
        'When the pool is not closed.',
        '',
        '# Arguments',
        '* `new_name` - The new name of the pool.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [134, 125, 13, 23, 145, 45, 49, 196]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'newName'
          type: 'string'
        },
      ]
    },
    {
      name: 'withdrawAfterPoolClosure'
      docs: [
        "Withdraws all the lender's assets after the pool has been permanently closed.",
        '',
        '# Trigger Condition',
        'Only when the protocol is on and the pool is closed.',
        '',
        '# Access Control',
        'Only lenders can call this instruction.',
      ]
      discriminator: [82, 21, 237, 73, 48, 153, 86, 168]
      accounts: [
        {
          name: 'lender'
          signer: true
        },
        {
          name: 'humaConfig'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'modeConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 99, 111, 110, 102, 105, 103]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'mode_config.id'
                account: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'modeMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 111, 100, 101, 95, 109, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
            ]
          }
        },
        {
          name: 'lenderState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'modeConfig'
              },
              {
                kind: 'account'
                path: 'lender'
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ]
              },
              {
                kind: 'account'
                path: 'poolConfig'
              },
            ]
          }
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'poolAuthority'
              },
              {
                kind: 'account'
                path: 'underlyingTokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'lenderUnderlyingToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'underlyingTokenProgram'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'lenderModeToken'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'lender'
              },
              {
                kind: 'account'
                path: 'modeTokenProgram'
              },
              {
                kind: 'account'
                path: 'modeMint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'underlyingTokenProgram'
        },
        {
          name: 'modeTokenProgram'
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: 'lenderState'
      discriminator: [240, 118, 235, 226, 18, 3, 58, 25]
    },
    {
      name: 'modeConfig'
      discriminator: [249, 180, 144, 225, 126, 159, 202, 209]
    },
    {
      name: 'poolConfig'
      discriminator: [26, 108, 14, 123, 116, 230, 129, 43]
    },
    {
      name: 'poolOperator'
      discriminator: [86, 93, 81, 162, 133, 189, 80, 191]
    },
    {
      name: 'poolState'
      discriminator: [247, 237, 227, 245, 215, 195, 222, 70]
    },
    {
      name: 'redemptionRequest'
      discriminator: [117, 157, 214, 214, 64, 160, 31, 58]
    },
    {
      name: 'strategyManagerWallet'
      discriminator: [7, 113, 185, 42, 183, 171, 232, 77]
    },
  ]
  events: [
    {
      name: 'fullyCanceledRedemptionRequestSkippedEvent'
      discriminator: [182, 222, 115, 2, 28, 250, 2, 128]
    },
    {
      name: 'lpConfigChangedEvent'
      discriminator: [241, 93, 140, 107, 238, 126, 168, 245]
    },
    {
      name: 'lenderAccountsClosedEvent'
      discriminator: [114, 190, 186, 18, 188, 195, 238, 186]
    },
    {
      name: 'lenderAccountsCreatedEvent'
      discriminator: [175, 24, 152, 252, 143, 70, 152, 142]
    },
    {
      name: 'lenderFundDisbursedEvent'
      discriminator: [185, 20, 203, 170, 122, 78, 231, 106]
    },
    {
      name: 'lenderFundWithdrawnEvent'
      discriminator: [189, 37, 124, 152, 255, 154, 13, 202]
    },
    {
      name: 'liquidityDeployedEvent'
      discriminator: [46, 23, 218, 176, 233, 96, 239, 70]
    },
    {
      name: 'liquidityDepositedEvent'
      discriminator: [90, 3, 240, 128, 109, 154, 131, 185]
    },
    {
      name: 'liquidityPaidBackEvent'
      discriminator: [50, 105, 163, 223, 164, 6, 91, 32]
    },
    {
      name: 'lossDeclaredEvent'
      discriminator: [159, 235, 30, 240, 118, 234, 120, 83]
    },
    {
      name: 'modeApyChangedEvent'
      discriminator: [32, 227, 98, 156, 108, 3, 184, 44]
    },
    {
      name: 'modeAddedEvent'
      discriminator: [74, 37, 33, 192, 210, 247, 243, 8]
    },
    {
      name: 'modeAssetsRefreshedEvent'
      discriminator: [210, 11, 22, 20, 35, 19, 80, 74]
    },
    {
      name: 'modeNameChangedEvent'
      discriminator: [143, 246, 221, 130, 98, 175, 204, 53]
    },
    {
      name: 'modeRemovedEvent'
      discriminator: [32, 53, 184, 81, 110, 129, 249, 144]
    },
    {
      name: 'modeSwitchedEvent'
      discriminator: [180, 176, 130, 85, 150, 49, 56, 187]
    },
    {
      name: 'modeTokenMetadataUpdatedEvent'
      discriminator: [138, 111, 218, 240, 143, 17, 130, 238]
    },
    {
      name: 'poolClosedEvent'
      discriminator: [76, 55, 28, 161, 130, 142, 226, 133]
    },
    {
      name: 'poolCreatedEvent'
      discriminator: [25, 94, 75, 47, 112, 99, 53, 63]
    },
    {
      name: 'poolDisabledEvent'
      discriminator: [253, 229, 56, 71, 40, 225, 125, 122]
    },
    {
      name: 'poolEnabledEvent'
      discriminator: [169, 245, 50, 35, 124, 58, 231, 48]
    },
    {
      name: 'poolEnteredPreClosureEvent'
      discriminator: [158, 111, 26, 100, 200, 42, 252, 70]
    },
    {
      name: 'poolNameChangedEvent'
      discriminator: [197, 42, 231, 168, 23, 125, 82, 96]
    },
    {
      name: 'poolOperatorAddedEvent'
      discriminator: [45, 70, 168, 122, 180, 30, 11, 196]
    },
    {
      name: 'poolOperatorRemovedEvent'
      discriminator: [171, 56, 197, 75, 3, 90, 107, 205]
    },
    {
      name: 'poolOwnerChangedEvent'
      discriminator: [34, 125, 255, 170, 143, 47, 140, 169]
    },
    {
      name: 'poolOwnerTreasuryChangedEvent'
      discriminator: [140, 110, 16, 105, 86, 252, 169, 49]
    },
    {
      name: 'redeemedFundsPaidOutEvent'
      discriminator: [3, 68, 39, 81, 188, 59, 247, 177]
    },
    {
      name: 'redeemedFundsReservedEvent'
      discriminator: [141, 45, 128, 85, 166, 158, 191, 48]
    },
    {
      name: 'redemptionRequestAddedEvent'
      discriminator: [254, 164, 67, 48, 28, 132, 33, 5]
    },
    {
      name: 'redemptionRequestCanceledEvent'
      discriminator: [200, 205, 28, 174, 176, 233, 95, 13]
    },
    {
      name: 'redemptionRequestProcessedEvent'
      discriminator: [165, 153, 161, 205, 132, 243, 207, 156]
    },
    {
      name: 'strategyManagerWalletAddedEvent'
      discriminator: [159, 1, 96, 54, 37, 222, 191, 22]
    },
    {
      name: 'strategyManagerWalletRemovedEvent'
      discriminator: [81, 71, 145, 25, 9, 72, 114, 212]
    },
  ]
  errors: [
    {
      code: 6001
      name: 'zeroAmountProvided'
    },
    {
      code: 6002
      name: 'zeroSharesMinted'
    },
    {
      code: 6101
      name: 'poolOwnerRequired'
    },
    {
      code: 6102
      name: 'poolOwnerOrHumaOwnerRequired'
    },
    {
      code: 6103
      name: 'poolOwnerTreasuryRequired'
    },
    {
      code: 6104
      name: 'poolOwnerOrSentinelRequired'
    },
    {
      code: 6105
      name: 'poolOperatorRequired'
    },
    {
      code: 6106
      name: 'redemptionRequestProcessorRequired'
    },
    {
      code: 6201
      name: 'invalidHumaConfig'
    },
    {
      code: 6202
      name: 'invalidLiquidityAsset'
    },
    {
      code: 6203
      name: 'invalidUnderlyingMint'
    },
    {
      code: 6204
      name: 'protocolIsPaused'
    },
    {
      code: 6301
      name: 'poolIsNotOn'
    },
    {
      code: 6302
      name: 'poolIsNotOnOrInPreClosure'
    },
    {
      code: 6303
      name: 'poolIsNotInPreClosure'
    },
    {
      code: 6304
      name: 'poolIsNotClosed'
    },
    {
      code: 6305
      name: 'poolIsClosed'
    },
    {
      code: 6306
      name: 'poolNameTooLong'
    },
    {
      code: 6307
      name: 'modeNameTooLong'
    },
    {
      code: 6308
      name: 'tooManyModes'
    },
    {
      code: 6309
      name: 'tooFewModes'
    },
    {
      code: 6310
      name: 'duplicateModes'
    },
    {
      code: 6311
      name: 'minDepositAmountTooLow'
    },
    {
      code: 6312
      name: 'minRedemptionSharesTooLow'
    },
    {
      code: 6313
      name: 'lenderMismatch'
    },
    {
      code: 6314
      name: 'redemptionRequestOutOfOrder'
    },
    {
      code: 6315
      name: 'insufficientBalanceForRedemptionProcessing'
    },
    {
      code: 6316
      name: 'totalRedemptionLimitExceeded'
    },
    {
      code: 6317
      name: 'insufficientSharesForRequest'
    },
    {
      code: 6318
      name: 'differentModesRequired'
    },
    {
      code: 6319
      name: 'unprocessedRedemptionRequests'
    },
    {
      code: 6320
      name: 'insufficientBalanceForWithdrawal'
    },
    {
      code: 6321
      name: 'insufficientAssetsForPoolActivation'
    },
    {
      code: 6401
      name: 'invalidModeConfig'
    },
    {
      code: 6402
      name: 'depositAmountTooLow'
    },
    {
      code: 6403
      name: 'liquidityCapExceeded'
    },
    {
      code: 6404
      name: 'insufficientModeSupply'
    },
    {
      code: 6405
      name: 'redemptionSharesTooLow'
    },
    {
      code: 6406
      name: 'modeTokenNotReadyToClose'
    },
    {
      code: 6407
      name: 'lenderStateNotReadyToClose'
    },
    {
      code: 6408
      name: 'modeMintNotReadyToClose'
    },
    {
      code: 6409
      name: 'modeStateNotReadyToClose'
    },
    {
      code: 6501
      name: 'strategyManagerWalletMismatch'
    },
    {
      code: 6502
      name: 'insufficientBalanceForDeployment'
    },
    {
      code: 6503
      name: 'declaredLossTooHigh'
    },
  ]
  types: [
    {
      name: 'fullyCanceledRedemptionRequestSkippedEvent'
      docs: [
        'A redemption request that has been fully canceled previously has been skipped.',
        '',
        '# Fields',
        '* `request_id` - The ID of the redemption request.',
        '* `lender` - The lender who submitted the request.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'requestId'
            type: 'u128'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'lpConfig'
      docs: [
        'Lender related configurations.',
        '',
        '# Fields',
        '* `liquidity_cap` - The max liquidity allowed for the pool.',
        '* `min_deposit_amount` - The minimum amount a lender needs to supply each time they deposit.',
        '* `min_redemption_shares` - The minimum number of shares a lender has to request for redemption,',
        'unless their total number of shares is lower than this value.',
        '* `max_total_redemption_shares_per_window` - The maximum number of shares that can be requested',
        'for redemption across all lenders per time window. No more redemption requests can be',
        'submitted after this limit has been reached in a given window. If this valis is set to 0, then',
        'redemption request submission is paused.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'liquidityCap'
            type: 'u128'
          },
          {
            name: 'minDepositAmount'
            type: 'u64'
          },
          {
            name: 'minRedemptionShares'
            type: 'u64'
          },
          {
            name: 'maxTotalRedemptionSharesPerWindow'
            type: 'u128'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'lpConfigChangedEvent'
      docs: [
        'The LP config has been updated.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `lp_config` - The new LP config.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'lpConfig'
            type: {
              defined: {
                name: 'lpConfig'
              }
            }
          },
        ]
      }
    },
    {
      name: 'lenderAccountsClosedEvent'
      docs: [
        'Lender accounts have been permanently closed.',
        '',
        '# Fields',
        '* `mode_config` - The mode mint key.',
        '* `lender` - The lender who closed their accounts.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'lenderAccountsCreatedEvent'
      docs: [
        'Lender accounts have been created.',
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `lender` - The lender who created their accounts.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'lenderFundDisbursedEvent'
      docs: [
        "A lender's funds from processed redemption requests have been disbursed.",
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `lender` - The lender whose funds have been disbursed.',
        '* `amount_disbursed` - The amount of the disbursement.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'amountDisbursed'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'lenderFundWithdrawnEvent'
      docs: [
        'A lender has withdrawn all their assets after pool closure.',
        '',
        '# Fields',
        '* `mode_config` - The mode config of the mode from which the lender has withdrawn.',
        '* `lender` - The lender who has withdrawn.',
        '* `shares` - The number of shares burned.',
        '* `assets` - The amount that was withdrawn.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'shares'
            type: 'u128'
          },
          {
            name: 'assets'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'lenderRedemptionRecord'
      docs: [
        "The information related to a lender's redemption.",
        '',
        '# Fields',
        '* `num_pending_redemption_requests` - The number of pending redemption requests. Note that this',
        'value is only decremented when the redemption request account is closed in `process_redemption_request`,',
        'not in `cancel_redemption_request`.',
        '* `total_amount_processed` - The total amount processed for redemption.',
        '* `total_amount_withdrawn` - The total amount withdrawn by the lender. The withdrawable amount',
        "= `total_amount_processed` - `total_amount_withdrawn`. Since we'll first try to transfer the",
        "processed funds directly to the lender, the withdrawable amount is usually 0. It's only",
        'non-zero if the transfer fails and the funds are kept in the disbursement reserve for the',
        'lender to claim later.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'numPendingRedemptionRequests'
            type: 'u128'
          },
          {
            name: 'totalAmountProcessed'
            type: 'u128'
          },
          {
            name: 'totalAmountWithdrawn'
            type: 'u128'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'lenderState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'redemptionRecord'
            type: {
              defined: {
                name: 'lenderRedemptionRecord'
              }
            }
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'liquidityDeployedEvent'
      docs: [
        'The strategy manager has deployed liquidity from the pool.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `wallet` - The strategy manager wallet that used for liquidity deployment.',
        '* `amount` - The amount deployed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'wallet'
            type: 'pubkey'
          },
          {
            name: 'amount'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'liquidityDepositedEvent'
      docs: [
        'A deposit has been made to the mode.',
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `depositor` - The account that made the deposit.',
        '* `assets` - The amount of underlying assets deposited.',
        '* `shares` - The number of shares minted for this deposit.',
        '* `commitment` - The commitment type of the deposit.',
        '* `commitment_auto_renewal` - Whether the commitment renews automatically after expiration.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'depositor'
            type: 'pubkey'
          },
          {
            name: 'assets'
            type: 'u64'
          },
          {
            name: 'shares'
            type: 'u64'
          },
          {
            name: 'commitment'
            type: 'string'
          },
          {
            name: 'commitmentAutoRenewal'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'liquidityPaidBackEvent'
      docs: [
        'The strategy manager has paid back liquidity to the pool.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `wallet` - The strategy manager wallet address.',
        '* `amount` - The amount paid back.',
        '* `losses_recovered` - The amount of losses recovered in each mode.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'wallet'
            type: 'pubkey'
          },
          {
            name: 'amount'
            type: 'u128'
          },
          {
            name: 'lossesRecovered'
            type: {
              vec: 'u128'
            }
          },
        ]
      }
    },
    {
      name: 'lossDeclaredEvent'
      docs: [
        'The strategy manager has declared loss on the investment.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `wallet` - The strategy manager wallet address.',
        '* `loss` - The loss declared.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'wallet'
            type: 'pubkey'
          },
          {
            name: 'loss'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'manageModeTokenMetadataArgs'
      docs: [
        'Parameters used for creating and updating mode token metadata. All string lengths',
        'are checked by the MPL token metadata program, hence omitted here.',
        '',
        '# Fields',
        '* `name` - The name of the mode token.',
        '* `symbol` - The symbol of the mode token.',
        '* `uri` - The URI of additional mode token metadata stored off-chain.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'symbol'
            type: 'string'
          },
          {
            name: 'uri'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'modeApyChangedEvent'
      docs: [
        'The mode APY has been updated.',
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `target_apy_bps` - The new target APY expressed in basis points.',
        '* `periodic_apy_bps` - The new periodic APY expressed in basis points.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'targetApyBps'
            type: 'u16'
          },
          {
            name: 'periodicApyBps'
            type: 'f64'
          },
        ]
      }
    },
    {
      name: 'modeAddedEvent'
      docs: [
        'A mode has been added to the pool.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `mode_id` - The mode ID.',
        '* `mode_name` - The name of the mode.',
        '* `mode_config` - The mode config key.',
        '* `mode_mint` - The mode token mint key.',
        '* `mode_token` - The mode token account key.',
        '* `mode_token_name` - The name of the mode token.',
        '* `mode_token_symbol` - The symbol of the mode token.',
        '* `mode_token_uri` - The URI of additional mode token metadata stored off-chain.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'modeId'
            type: 'pubkey'
          },
          {
            name: 'modeName'
            type: 'string'
          },
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'modeMint'
            type: 'pubkey'
          },
          {
            name: 'modeToken'
            type: 'pubkey'
          },
          {
            name: 'modeTokenName'
            type: 'string'
          },
          {
            name: 'modeTokenSymbol'
            type: 'string'
          },
          {
            name: 'modeTokenUri'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'modeAssetsRefreshedEvent'
      docs: [
        'The assets for a mode have been refreshed.',
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `old_assets` - The mode assets before update.',
        '* `new_assets` - The updated mode assets.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'yieldBps'
            type: 'f64'
          },
          {
            name: 'oldAssetsRefreshedAt'
            type: 'u64'
          },
          {
            name: 'oldAssets'
            type: 'u128'
          },
          {
            name: 'newAssets'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'modeConfig'
      docs: [
        'The configurations of a mode.',
        '',
        '# Fields',
        '* `bump` - The bump of the mode.',
        '* `mint_bump` - The bump of the mode mint.',
        '* `id` - The ID of the mode.',
        '* `name` - The name of the mode.',
        '* `target_apy_bps` - The target annual percentage yield (APY) for the underlying assets',
        'deposited, expressed in basis points.',
        '* `periodic_apy_bps` - The periodic rate, expressed as an APY in basis points. When compounded',
        'over the chosen periods in a year (e.g., every second), this rate yields the same',
        'overall annual return as target_apy_bps.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'mintBump'
            type: 'u8'
          },
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'targetApyBps'
            type: 'u16'
          },
          {
            name: 'periodicApyBps'
            type: 'f64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'modeNameChangedEvent'
      docs: [
        'The mode name has been updated.',
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `name` - The new name of the mode.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'name'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'modeRemovedEvent'
      docs: [
        'A mode has been removed from the pool.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `mode_id` - The mode ID.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'modeId'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'modeState'
      docs: [
        'The states of a mode.',
        '',
        '# Fields',
        '* `assets` - The total amount of underlying assets in th mode. This includes both principals',
        'and yields (realized and unrealized).',
        '* `losses` - The total outstanding losses in the mode.',
        '* `cumulative_yields` - The cumulative amount of yields accrued in this mode.',
        '* `assets_refreshed_at` - The last timestamp at which `assets` was refreshed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'assets'
            type: 'u128'
          },
          {
            name: 'losses'
            type: 'u128'
          },
          {
            name: 'cumulativeYields'
            type: 'u128'
          },
          {
            name: 'assetsRefreshedAt'
            type: 'u64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'modeSwitchedEvent'
      docs: [
        'A lender has switched their investment from one mode to another.',
        '',
        '# Fields',
        '* `source_mode_config` - The source mode config key.',
        '* `destination_mode_config` - The destination mode config key.',
        '* `lender` - The lender who switched mode.',
        '* `source_shares_burned` - The number of shares burned in the source mode.',
        '* `destination_shares_burned` - The number of shares minted in the destination mode.',
        '* `assets_switched` - The amount switched mode.',
        '* `investment_id` - The ID of the original investment.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'sourceModeConfig'
            type: 'pubkey'
          },
          {
            name: 'destinationModeConfig'
            type: 'pubkey'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'sourceSharesBurned'
            type: 'u128'
          },
          {
            name: 'destinationSharesMinted'
            type: 'u128'
          },
          {
            name: 'assetsSwitched'
            type: 'u128'
          },
          {
            name: 'investmentId'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'modeTokenMetadataUpdatedEvent'
      docs: [
        'The token metadata has been updated for a mode.',
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `name` - The name of the mode token.',
        '* `symbol` - The symbol of the mode token.',
        '* `uri` - The URI of additional mode token metadata stored off-chain.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'symbol'
            type: 'string'
          },
          {
            name: 'uri'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'poolClosedEvent'
      docs: [
        'The pool has been closed.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'humaConfig'
            type: 'pubkey'
          },
          {
            name: 'poolOwner'
            type: 'pubkey'
          },
          {
            name: 'poolOwnerTreasury'
            type: 'pubkey'
          },
          {
            name: 'underlyingMint'
            type: 'pubkey'
          },
          {
            name: 'poolAuthorityBump'
            type: 'u8'
          },
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'poolName'
            type: 'string'
          },
          {
            name: 'lpConfig'
            type: {
              defined: {
                name: 'lpConfig'
              }
            }
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'poolCreatedEvent'
      docs: [
        'A permissionless pool has been created.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `huma_config` - The ID of the Huma config that the pool is associated with.',
        '* `pool_owner` - The address of the pool owner.',
        '* `pool_owner_treasury` - The address of the pool owner treasury.',
        '* `underlying_mint` - The mint account of the underlying asset.',
        '* `pool_underlying_token` - The underlying asset token account of the pool.',
        '* `pool_authority` - The address of the pool authority account.',
        '* `pool_name` - The name of the pool.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'humaConfig'
            type: 'pubkey'
          },
          {
            name: 'poolOwner'
            type: 'pubkey'
          },
          {
            name: 'poolOwnerTreasury'
            type: 'pubkey'
          },
          {
            name: 'underlyingMint'
            type: 'pubkey'
          },
          {
            name: 'poolUnderlyingToken'
            type: 'pubkey'
          },
          {
            name: 'poolAuthority'
            type: 'pubkey'
          },
          {
            name: 'poolName'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'poolDisabledEvent'
      docs: [
        'The pool has been disabled.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolEnabledEvent'
      docs: [
        'The pool has been enabled.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolEnteredPreClosureEvent'
      docs: [
        'The pool has entered the pre-closure status to prepare for final closing.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolNameChangedEvent'
      docs: [
        'The pool name has been updated.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `pool_name` - The new name of the pool.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'poolName'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'poolOperator'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
    {
      name: 'poolOperatorAddedEvent'
      docs: [
        'A new pool operator has been added.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `operator` - The address of the new operator being added.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'operator'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolOperatorRemovedEvent'
      docs: [
        'A pool operator has been removed.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `operator` - The address of the operator being removed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'operator'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolOwnerChangedEvent'
      docs: [
        'The pool owner has changed.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `owner` - The address of the new owner.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'owner'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolOwnerTreasuryChangedEvent'
      docs: [
        'The pool owner treasury has been updated.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `old_treasury` - The address of the old pool owner treasury.',
        '* `new_treasury` - The address of the new pool owner treasury.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'oldTreasury'
            type: 'pubkey'
          },
          {
            name: 'newTreasury'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'status'
            type: {
              defined: {
                name: 'poolStatus'
              }
            }
          },
          {
            name: 'disbursementReserve'
            type: 'u128'
          },
          {
            name: 'modeStates'
            type: {
              vec: {
                defined: {
                  name: 'modeState'
                }
              }
            }
          },
          {
            name: 'modeConfigKeys'
            type: {
              vec: 'pubkey'
            }
          },
          {
            name: 'redemptionQueue'
            type: {
              defined: {
                name: 'redemptionQueue'
              }
            }
          },
          {
            name: 'poolStats'
            type: {
              defined: {
                name: 'poolStats'
              }
            }
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'poolStats'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'cumulativeAmountDeployed'
            type: 'u128'
          },
          {
            name: 'cumulativeAmountPaidBack'
            type: 'u128'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'poolStatus'
      docs: [
        'The pool status',
        '',
        '# Variants',
        '* `Off` - The pool is temporarily turned off.',
        '* `On` - The pool is active.',
        '* `PreClosure` - The pool is undergoing final processing to prepare for closure.',
        '* `Closed` - The pool is closed after maturity.',
      ]
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'off'
          },
          {
            name: 'on'
          },
          {
            name: 'preClosure'
          },
          {
            name: 'closed'
          },
        ]
      }
    },
    {
      name: 'redeemedFundsPaidOutEvent'
      docs: [
        'Redeemed funds have been paid out to the lender.',
        '',
        '# Fields',
        '* `request_id` - The ID of the redemption request that was processed.',
        '* `lender` - The lender whose shares have been redeemed.',
        '* `amount` - The amount of the disbursement.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'requestId'
            type: 'u128'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'amount'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'redeemedFundsReservedEvent'
      docs: [
        'Redeemed funds have been held in the protocol for manual claiming later.',
        '',
        '# Fields',
        '* `request_id` - The ID of the redemption request that was processed.',
        '* `lender` - The lender whose shares have been redeemed.',
        '* `amount` - The amount that was reserved.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'requestId'
            type: 'u128'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'amount'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'redemptionGating'
      docs: [
        'Redemption gating information tracker.',
        '',
        '# Fields',
        '* `total_shares_requested` - The total number of shares requested for redemption during',
        'the current window. No redemption request can be submitted once the total shares requested',
        'reaches the limit defined in `LPConfig`.',
        '* `window_starts_at` - The Unix timestamp (UTC) marking the start of the current 24-hour',
        'redemption window.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'totalSharesRequested'
            type: 'u128'
          },
          {
            name: 'windowStartsAt'
            type: 'u64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'redemptionQueue'
      docs: [
        'States for the global redemption queue.',
        '',
        '# Fields',
        '* `next_request_id` - The ID of the next redemption request to be processed.',
        '* `last_request_id` - The ID of the last unprocessed redemption request in the queue.',
        '* `redemption_gating` - Redemption gating information tracker.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'nextRequestId'
            type: 'u128'
          },
          {
            name: 'lastRequestId'
            type: 'u128'
          },
          {
            name: 'redemptionGating'
            type: {
              defined: {
                name: 'redemptionGating'
              }
            }
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'redemptionRequest'
      docs: [
        "States for a lender's redemption request.",
        '',
        '#  Fields',
        '* `bump` - The bump of the account.',
        '* `id` - The ID of the redemption request.',
        '* `lender` - The lender who submitted the request.',
        '* `mode_config` - The `ModeConfig` key of the mode that the request was added to.',
        '* `shares_requested` - The number of shares requested for redemption.',
        '* `requested_at` - The timestamp at which the request was submitted.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'id'
            type: 'u128'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'sharesRequested'
            type: 'u128'
          },
          {
            name: 'requestedAt'
            type: 'u64'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'redemptionRequestAddedEvent'
      docs: [
        'A redemption request has been added.',
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `lender` - The lender who requested redemption.',
        '* `request_id` - The ID of the newly created request.',
        '* `shares` - The number of shares to be redeemed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'requestId'
            type: 'u128'
          },
          {
            name: 'shares'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'redemptionRequestCanceledEvent'
      docs: [
        'A lender has reduced the number of shares requested for redemption.',
        '',
        '# Fields',
        '* `mode_config` - The mode config key.',
        '* `lender` - The lender who requested redemption.',
        '* `request_id` - The ID of the newly created request.',
        '* `shares` - The number of shares to be redeemed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'modeConfig'
            type: 'pubkey'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'requestId'
            type: 'u128'
          },
          {
            name: 'shares'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'redemptionRequestProcessedEvent'
      docs: [
        'A redemption request has been processed.',
        '',
        '# Fields',
        '* `request_id` - The ID of the redemption request.',
        '* `lender` - The lender who submitted the request.',
        '* `shares_processed` - The number of shares processed.',
        '* `amount_processed` - The resulting amount processed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'requestId'
            type: 'u128'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'sharesProcessed'
            type: 'u128'
          },
          {
            name: 'amountProcessed'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'strategyManagerWallet'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'wallet'
            type: 'pubkey'
          },
          {
            name: 'padding'
            type: {
              array: ['u8', 160]
            }
          },
        ]
      }
    },
    {
      name: 'strategyManagerWalletAddedEvent'
      docs: [
        'A wallet has been added for the strategy manager.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `wallet` - The wallet address.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'wallet'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'strategyManagerWalletRemovedEvent'
      docs: [
        'A wallet for the strategy manager has been removed.',
        '',
        '# Fields',
        '* `pool_id` - The pool ID.',
        '* `wallet` - The wallet address.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'wallet'
            type: 'pubkey'
          },
        ]
      }
    },
  ]
}
