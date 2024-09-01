/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/huma_solana.json`.
 */
export type HumaSolana = {
  address: '9Tx5QCUZcXkqAD4SFW8ZYfwPhTTXoDzZRQAiAksXzi5E'
  metadata: {
    name: 'humaSolana'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'addApprovedLender'
      discriminator: [77, 24, 23, 235, 196, 2, 125, 248]
      accounts: [
        {
          name: 'poolOperator'
          writable: true
          signer: true
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolOperatorConfig'
        },
        {
          name: 'trancheMint'
          writable: true
        },
        {
          name: 'approvedLender'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'arg'
                path: 'lender'
              },
              {
                kind: 'const'
                value: [
                  97,
                  112,
                  112,
                  114,
                  111,
                  118,
                  101,
                  100,
                  95,
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                ]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
      ]
      args: [
        {
          name: 'lender'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'addLiquidityAsset'
      discriminator: [51, 80, 131, 225, 90, 86, 81, 248]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
          relations: ['humaConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'mint'
        },
        {
          name: 'liquidityAsset'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'humaConfig'
              },
              {
                kind: 'account'
                path: 'mint'
              },
              {
                kind: 'const'
                value: [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  97,
                  115,
                  115,
                  101,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'addPauser'
      discriminator: [164, 101, 59, 65, 139, 178, 135, 187]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
          relations: ['humaConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'pauserConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'humaConfig'
              },
              {
                kind: 'arg'
                path: 'pauser'
              },
              {
                kind: 'const'
                value: [112, 97, 117, 115, 101, 114]
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
          name: 'pauserKey'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'addPoolOperator'
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'operator'
              },
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
      discriminator: [72, 203, 201, 17, 75, 60, 157, 47]
      accounts: [
        {
          name: 'lender'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'trancheState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
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
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'account'
                path: 'lender'
              },
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
            ]
          }
        },
        {
          name: 'trancheMint'
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'poolAccountTranche'
          writable: true
        },
        {
          name: 'lenderAccountTranche'
          writable: true
        },
        {
          name: 'extraAccountMetaList'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115,
                ]
              },
              {
                kind: 'account'
                path: 'trancheMint'
              },
            ]
            program: {
              kind: 'account'
              path: 'hookProgram'
            }
          }
        },
        {
          name: 'hookProgram'
          address: '6ESgVCpCAQpnaZe6pd6YiqAL4DqTtgLtx2yQ2QzV2Jy6'
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
          name: 'shares'
          type: 'u128'
        },
      ]
    },
    {
      name: 'approveCredit'
      discriminator: [72, 9, 104, 21, 215, 72, 35, 144]
      accounts: [
        {
          name: 'evaluationAgent'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'borrower'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'borrower'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
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
          name: 'borrower'
          type: 'pubkey'
        },
        {
          name: 'creditLimit'
          type: 'u128'
        },
        {
          name: 'numPeriods'
          type: 'u32'
        },
        {
          name: 'yieldBps'
          type: 'u32'
        },
        {
          name: 'committedAmount'
          type: 'u128'
        },
        {
          name: 'designatedStartDate'
          type: 'u64'
        },
        {
          name: 'revolving'
          type: 'bool'
        },
      ]
    },
    {
      name: 'approveReceivable'
      discriminator: [117, 201, 147, 119, 71, 35, 253, 218]
      accounts: [
        {
          name: 'evaluationAgent'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'asset'
          writable: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'receivableInfo'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'account'
                path: 'receivable_info.reference_id'
                account: 'receivableInfo'
              },
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  99,
                  101,
                  105,
                  118,
                  97,
                  98,
                  108,
                  101,
                  95,
                  105,
                  110,
                  102,
                  111,
                ]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'mplCore'
          docs: ['The MPL Core program.']
          address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
        },
        {
          name: 'logWrapper'
          docs: ['The SPL Noop program.']
          optional: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'cancelRedemptionRequest'
      discriminator: [77, 155, 4, 179, 114, 233, 162, 45]
      accounts: [
        {
          name: 'lender'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'trancheMint'
        },
        {
          name: 'trancheState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
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
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'account'
                path: 'lender'
              },
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
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'poolTrancheToken'
          writable: true
        },
        {
          name: 'lenderTrancheToken'
          writable: true
        },
        {
          name: 'extraAccountMetaList'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115,
                ]
              },
              {
                kind: 'account'
                path: 'trancheMint'
              },
            ]
            program: {
              kind: 'account'
              path: 'hookProgram'
            }
          }
        },
        {
          name: 'hookProgram'
          address: '6ESgVCpCAQpnaZe6pd6YiqAL4DqTtgLtx2yQ2QzV2Jy6'
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
          name: 'shares'
          type: 'u128'
        },
      ]
    },
    {
      name: 'changeHumaOwner'
      discriminator: [0, 115, 141, 68, 122, 216, 36, 53]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
          relations: ['humaConfig']
        },
        {
          name: 'humaConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
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
      name: 'changePoolOwner'
      discriminator: [169, 55, 183, 24, 152, 180, 167, 11]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
      name: 'closeCredit'
      discriminator: [151, 225, 136, 142, 221, 237, 105, 183]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'evaluationAgent'
          writable: true
          relations: ['poolConfig']
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'closeEpoch'
      discriminator: [13, 87, 7, 133, 109, 14, 83, 25]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'poolUnderlyingToken'
        },
        {
          name: 'juniorMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  106,
                  117,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorMint'
          writable: true
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  115,
                  101,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'juniorState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'juniorMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorState'
          writable: true
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'seniorMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
            ]
          }
        },
        {
          name: 'poolJuniorToken'
          writable: true
        },
        {
          name: 'poolSeniorToken'
          writable: true
          optional: true
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
      name: 'closePool'
      discriminator: [140, 189, 209, 23, 239, 62, 239, 11]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'poolUnderlyingToken'
        },
        {
          name: 'juniorMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  106,
                  117,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorMint'
          writable: true
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  115,
                  101,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'juniorState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'juniorMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorState'
          writable: true
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'seniorMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
            ]
          }
        },
        {
          name: 'poolJuniorToken'
          writable: true
        },
        {
          name: 'poolSeniorToken'
          writable: true
          optional: true
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
      name: 'createHumaConfig'
      discriminator: [217, 139, 156, 146, 27, 106, 58, 137]
      accounts: [
        {
          name: 'owner'
          docs: ['Address to be set as protocol owner.']
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          docs: [
            'Initialize config state account to store protocol owner address and fee rates.',
          ]
          writable: true
          pda: {
            seeds: [
              {
                kind: 'arg'
                path: 'id'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
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
          name: 'id'
          type: 'pubkey'
        },
        {
          name: 'protocolFeeBps'
          type: 'u16'
        },
        {
          name: 'treasury'
          type: 'pubkey'
        },
        {
          name: 'sentinel'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'createPool'
      discriminator: [233, 146, 209, 142, 207, 104, 64, 188]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'underlyingMint'
        },
        {
          name: 'liquidityAsset'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'humaConfig'
              },
              {
                kind: 'account'
                path: 'underlyingMint'
              },
              {
                kind: 'const'
                value: [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  97,
                  115,
                  115,
                  101,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'arg'
                path: 'poolId'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'arg'
                path: 'poolId'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
        {
          name: 'evaluationAgent'
          type: 'pubkey'
        },
        {
          name: 'tranchePolicyType'
          type: {
            defined: {
              name: 'tranchesPolicyType'
            }
          }
        },
      ]
    },
    {
      name: 'createPoolAccounts'
      discriminator: [173, 80, 72, 98, 140, 177, 251, 8]
      accounts: [
        {
          name: 'poolOwner'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'juniorTrancheMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  106,
                  117,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorTrancheMint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  115,
                  101,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
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
      name: 'createReceivable'
      discriminator: [41, 254, 56, 162, 208, 98, 23, 9]
      accounts: [
        {
          name: 'asset'
          docs: ['The address of the new receivable.']
          writable: true
          signer: true
        },
        {
          name: 'owner'
          docs: [
            'This will be the `authority`, `owner` and `update authority` of the receivable,',
            'as well as the one paying for account storage.',
          ]
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'receivableInfo'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'owner'
              },
              {
                kind: 'arg'
                path: 'args.reference_id'
              },
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  99,
                  101,
                  105,
                  118,
                  97,
                  98,
                  108,
                  101,
                  95,
                  105,
                  110,
                  102,
                  111,
                ]
              },
            ]
          }
        },
        {
          name: 'mplCore'
          docs: ['The MPL Core program.']
          address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
        },
        {
          name: 'logWrapper'
          docs: ['The SPL Noop program.']
          optional: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'createReceivableArgs'
            }
          }
        },
      ]
    },
    {
      name: 'declarePayment'
      discriminator: [238, 48, 82, 155, 64, 143, 45, 103]
      accounts: [
        {
          name: 'authority'
          writable: true
          signer: true
        },
        {
          name: 'asset'
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'receivableInfo'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'authority'
              },
              {
                kind: 'account'
                path: 'receivable_info.reference_id'
                account: 'receivableInfo'
              },
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  99,
                  101,
                  105,
                  118,
                  97,
                  98,
                  108,
                  101,
                  95,
                  105,
                  110,
                  102,
                  111,
                ]
              },
            ]
          }
        },
        {
          name: 'mplCore'
          docs: ['The MPL Core program.']
          address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
        },
        {
          name: 'logWrapper'
          docs: ['The SPL Noop program.']
          optional: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'paymentAmount'
          type: 'u128'
        },
      ]
    },
    {
      name: 'deposit'
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182]
      accounts: [
        {
          name: 'depositor'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'account'
                path: 'depositor'
              },
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
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'approvedLender'
        },
        {
          name: 'trancheMint'
          writable: true
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'depositorAccountUnderlying'
          writable: true
        },
        {
          name: 'depositorAccountTranche'
          writable: true
        },
        {
          name: 'tokenProgram'
          docs: ['Solana ecosystem accounts']
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
          name: 'assets'
          type: 'u64'
        },
      ]
      returns: 'u64'
    },
    {
      name: 'disablePool'
      discriminator: [248, 118, 211, 160, 149, 150, 135, 37]
      accounts: [
        {
          name: 'operator'
          writable: true
          signer: true
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
      discriminator: [68, 250, 205, 89, 217, 142, 13, 44]
      accounts: [
        {
          name: 'lender'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'trancheState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
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
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'account'
                path: 'lender'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'trancheMint'
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'lenderUnderlyingToken'
          writable: true
        },
        {
          name: 'tokenProgram'
          docs: ['Solana ecosystem accounts']
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
      name: 'drawdown'
      discriminator: [200, 40, 162, 111, 156, 222, 7, 243]
      accounts: [
        {
          name: 'borrower'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'borrower'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'borrower'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'borrowerAccountUnderlying'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u128'
        },
      ]
      returns: 'u128'
    },
    {
      name: 'enablePool'
      discriminator: [120, 47, 0, 69, 84, 74, 16, 177]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'juniorTrancheMint'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  106,
                  117,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorTrancheMint'
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  115,
                  101,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'juniorState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'juniorTrancheMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorState'
          writable: true
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'seniorTrancheMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
            ]
          }
        },
        {
          name: 'poolOwnerTreasuryAccountJuniorTranche'
        },
        {
          name: 'poolOwnerTreasuryAccountSeniorTranche'
          optional: true
        },
        {
          name: 'eaAccountJuniorTranche'
        },
        {
          name: 'eaAccountSeniorTranche'
          optional: true
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
      name: 'extendRemainingPeriods'
      discriminator: [253, 77, 225, 116, 136, 73, 216, 77]
      accounts: [
        {
          name: 'evaluationAgent'
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
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
          name: 'numOfPeriods'
          type: 'u32'
        },
      ]
    },
    {
      name: 'initializeExtraAccountMetaList'
      discriminator: [92, 197, 174, 197, 41, 124, 19, 3]
      accounts: [
        {
          name: 'poolOwner'
          writable: true
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaProgramAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  104,
                  117,
                  109,
                  97,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
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
            ]
          }
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'hookProgram'
          address: '6ESgVCpCAQpnaZe6pd6YiqAL4DqTtgLtx2yQ2QzV2Jy6'
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'extraAccountMetaList'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115,
                ]
              },
              {
                kind: 'account'
                path: 'trancheMint'
              },
            ]
            program: {
              kind: 'account'
              path: 'hookProgram'
            }
          }
        },
        {
          name: 'trancheMint'
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
      name: 'makeInitialDeposit'
      discriminator: [141, 233, 75, 102, 37, 93, 94, 79]
      accounts: [
        {
          name: 'depositor'
          writable: true
          signer: true
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'account'
                path: 'depositor'
              },
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
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'trancheMint'
          writable: true
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'depositorAccountUnderlying'
          writable: true
        },
        {
          name: 'depositorAccountTranche'
          writable: true
        },
        {
          name: 'tokenProgram'
          docs: ['Solana ecosystem accounts']
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
          name: 'assets'
          type: 'u64'
        },
      ]
      returns: 'u64'
    },
    {
      name: 'makePayment'
      discriminator: [19, 128, 153, 121, 221, 192, 91, 53]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'borrowerAccountUnderlying'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u128'
        },
      ]
      returns: {
        defined: {
          name: 'makePaymentResult'
        }
      }
    },
    {
      name: 'makePrincipalPayment'
      discriminator: [40, 73, 75, 138, 45, 96, 135, 66]
      accounts: [
        {
          name: 'borrower'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'borrower'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'borrower'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'borrowerAccountUnderlying'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u128'
        },
      ]
      returns: {
        defined: {
          name: 'makePrincipalPaymentResult'
        }
      }
    },
    {
      name: 'mockDistributeLoss'
      discriminator: [121, 176, 53, 209, 206, 21, 121, 161]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
          name: 'loss'
          type: 'u128'
        },
      ]
    },
    {
      name: 'mockDistributeLossRecovery'
      discriminator: [172, 199, 143, 206, 52, 104, 79, 150]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
          name: 'lossRecovery'
          type: 'u128'
        },
      ]
    },
    {
      name: 'mockDistributeProfit'
      discriminator: [37, 191, 180, 54, 227, 158, 120, 115]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
          name: 'profit'
          type: 'u128'
        },
      ]
    },
    {
      name: 'mockDistributeProfitToTranches'
      discriminator: [168, 38, 33, 168, 117, 70, 135, 71]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
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
          name: 'profit'
          type: 'u128'
        },
      ]
      returns: {
        defined: {
          name: 'distributeProfitToTranchesResult'
        }
      }
    },
    {
      name: 'pause'
      discriminator: [211, 22, 221, 251, 74, 121, 193, 47]
      accounts: [
        {
          name: 'pauser'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'pauserConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'humaConfig'
              },
              {
                kind: 'account'
                path: 'pauser'
              },
              {
                kind: 'const'
                value: [112, 97, 117, 115, 101, 114]
              },
            ]
          }
        },
      ]
      args: []
    },
    {
      name: 'refreshCredit'
      discriminator: [251, 178, 39, 243, 183, 35, 101, 109]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'removeApprovedLender'
      discriminator: [123, 222, 124, 183, 103, 43, 251, 97]
      accounts: [
        {
          name: 'poolOperator'
          writable: true
          signer: true
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolOperatorConfig'
        },
        {
          name: 'trancheMint'
        },
        {
          name: 'approvedLender'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'arg'
                path: 'lender'
              },
              {
                kind: 'const'
                value: [
                  97,
                  112,
                  112,
                  114,
                  111,
                  118,
                  101,
                  100,
                  95,
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                ]
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
          name: 'lender'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'removeLiquidityAsset'
      discriminator: [220, 212, 17, 131, 95, 186, 135, 81]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
          relations: ['humaConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'mint'
        },
        {
          name: 'liquidityAsset'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'humaConfig'
              },
              {
                kind: 'account'
                path: 'mint'
              },
              {
                kind: 'const'
                value: [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  97,
                  115,
                  115,
                  101,
                  116,
                ]
              },
            ]
          }
        },
      ]
      args: []
    },
    {
      name: 'removePauser'
      discriminator: [251, 114, 202, 18, 216, 118, 176, 86]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
          relations: ['humaConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'pauserConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'humaConfig'
              },
              {
                kind: 'arg'
                path: 'pauserKey'
              },
              {
                kind: 'const'
                value: [112, 97, 117, 115, 101, 114]
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'pauserKey'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'removePoolOperator'
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'arg'
                path: 'operator'
              },
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
      name: 'setAdminRnr'
      discriminator: [18, 166, 239, 157, 122, 242, 254, 152]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'adminRnr'
          type: {
            defined: {
              name: 'adminRnR'
            }
          }
        },
      ]
    },
    {
      name: 'setEvaluationAgent'
      discriminator: [56, 217, 142, 95, 203, 7, 37, 66]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'juniorTrancheMint'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  106,
                  117,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorTrancheMint'
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  115,
                  101,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'newEaAccountJuniorTranche'
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'eaUnderlying'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'newEa'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'setFeeStructure'
      discriminator: [177, 185, 185, 94, 80, 253, 137, 255]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'fees'
          type: {
            defined: {
              name: 'feeStructure'
            }
          }
        },
      ]
    },
    {
      name: 'setLpConfig'
      discriminator: [243, 188, 179, 176, 217, 83, 174, 65]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
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
      discriminator: [95, 26, 200, 33, 36, 107, 65, 219]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'juniorTrancheMint'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  106,
                  117,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'seniorTrancheMint'
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [
                  115,
                  101,
                  110,
                  105,
                  111,
                  114,
                  95,
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116,
                ]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'newTreasuryAccountJuniorTranche'
        },
        {
          name: 'newTreasuryAccountSeniorTranche'
          optional: true
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'poolOwnerTreasuryUnderlying'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
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
      name: 'setPoolSettings'
      discriminator: [220, 224, 160, 141, 102, 160, 35, 231]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'underlyingMint'
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'settings'
          type: {
            defined: {
              name: 'poolSettings'
            }
          }
        },
      ]
    },
    {
      name: 'startCommittedCredit'
      discriminator: [171, 71, 208, 249, 59, 83, 243, 106]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'submitReceivable'
      discriminator: [18, 122, 4, 159, 218, 186, 88, 119]
      accounts: [
        {
          name: 'borrower'
          writable: true
          signer: true
        },
        {
          name: 'asset'
          writable: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'borrower'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'borrower'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'receivableInfo'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'borrower'
              },
              {
                kind: 'account'
                path: 'receivable_info.reference_id'
                account: 'receivableInfo'
              },
              {
                kind: 'const'
                value: [
                  114,
                  101,
                  99,
                  101,
                  105,
                  118,
                  97,
                  98,
                  108,
                  101,
                  95,
                  105,
                  110,
                  102,
                  111,
                ]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'mplCore'
          docs: ['The MPL Core program.']
          address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
        },
        {
          name: 'logWrapper'
          docs: ['The SPL Noop program.']
          optional: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'triggerDefault'
      discriminator: [101, 124, 194, 181, 119, 246, 180, 8]
      accounts: [
        {
          name: 'evaluationAgent'
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
      returns: {
        defined: {
          name: 'triggerDefaultResult'
        }
      }
    },
    {
      name: 'unpause'
      discriminator: [169, 144, 4, 38, 10, 141, 188, 255]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
          relations: ['humaConfig']
        },
        {
          name: 'humaConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
      ]
      args: []
    },
    {
      name: 'updateHumaConfig'
      discriminator: [39, 78, 0, 251, 70, 22, 97, 163]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
          relations: ['humaConfig']
        },
        {
          name: 'humaConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'treasury'
          type: 'pubkey'
        },
        {
          name: 'sentinel'
          type: 'pubkey'
        },
        {
          name: 'protocolFeeBps'
          type: 'u16'
        },
      ]
    },
    {
      name: 'updateLimitAndCommitment'
      discriminator: [129, 148, 70, 223, 27, 194, 55, 48]
      accounts: [
        {
          name: 'evaluationAgent'
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
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
          name: 'newCreditLimit'
          type: 'u128'
        },
        {
          name: 'newCommittedAmount'
          type: 'u128'
        },
      ]
    },
    {
      name: 'updatePoolBasicData'
      discriminator: [56, 201, 214, 99, 121, 74, 73, 82]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'poolName'
          type: 'string'
        },
        {
          name: 'tranchePolicyType'
          type: {
            defined: {
              name: 'tranchesPolicyType'
            }
          }
        },
      ]
    },
    {
      name: 'updateReceivableMetadataUri'
      discriminator: [39, 92, 163, 27, 120, 120, 132, 189]
      accounts: [
        {
          name: 'authority'
          docs: ['The update authority of the asset.']
          writable: true
          signer: true
        },
        {
          name: 'asset'
          writable: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'mplCore'
          docs: ['The MPL Core program.']
          address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
        },
        {
          name: 'logWrapper'
          docs: ['The SPL Noop program.']
          optional: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'uri'
          type: 'string'
        },
      ]
    },
    {
      name: 'updateYield'
      discriminator: [151, 190, 102, 136, 127, 77, 231, 0]
      accounts: [
        {
          name: 'evaluationAgent'
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
        },
        {
          name: 'poolState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
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
          name: 'newYieldBps'
          type: 'u32'
        },
      ]
    },
    {
      name: 'waiveLateFee'
      discriminator: [23, 155, 232, 53, 244, 25, 93, 38]
      accounts: [
        {
          name: 'evaluationAgent'
          signer: true
          relations: ['poolConfig']
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'creditConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'creditState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'account'
                path: 'credit_state.borrower'
                account: 'creditState'
              },
              {
                kind: 'const'
                value: [99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]
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
          name: 'amount'
          type: 'u128'
        },
      ]
      returns: 'u128'
    },
    {
      name: 'withdrawAfterPoolClosure'
      discriminator: [82, 21, 237, 73, 48, 153, 86, 168]
      accounts: [
        {
          name: 'lender'
          writable: true
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'trancheState'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'const'
                value: [
                  116,
                  114,
                  97,
                  110,
                  99,
                  104,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
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
                kind: 'account'
                path: 'trancheMint'
              },
              {
                kind: 'account'
                path: 'lender'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'trancheMint'
          writable: true
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'lenderUnderlyingToken'
          writable: true
        },
        {
          name: 'lenderTrancheToken'
          writable: true
        },
        {
          name: 'tokenProgram'
          docs: ['Solana ecosystem accounts']
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
      name: 'withdrawEaFees'
      discriminator: [184, 186, 55, 154, 161, 200, 129, 250]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'eaAccountUnderlying'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
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
      name: 'withdrawPoolOwnerFees'
      discriminator: [122, 81, 18, 55, 75, 191, 28, 17]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'signerAccountUnderlying'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
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
      name: 'withdrawProtocolFees'
      discriminator: [11, 68, 165, 98, 18, 208, 134, 73]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'humaConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'huma_config.id'
                account: 'humaConfig'
              },
              {
                kind: 'const'
                value: [104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]
              },
            ]
          }
          relations: ['poolConfig']
        },
        {
          name: 'poolConfig'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
              {
                kind: 'const'
                value: [112, 111, 111, 108, 95, 115, 116, 97, 116, 101]
              },
            ]
          }
        },
        {
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'pool_config.pool_id'
                account: 'poolConfig'
              },
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
            ]
          }
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolAccountUnderlying'
          writable: true
        },
        {
          name: 'signerAccountUnderlying'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u128'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'baseAssetV1'
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: 'creditConfig'
      discriminator: [114, 112, 9, 165, 97, 111, 111, 107]
    },
    {
      name: 'creditState'
      discriminator: [18, 110, 244, 85, 62, 104, 226, 74]
    },
    {
      name: 'humaConfig'
      discriminator: [46, 69, 40, 75, 135, 195, 146, 151]
    },
    {
      name: 'lender'
      discriminator: [107, 30, 175, 31, 232, 82, 180, 124]
    },
    {
      name: 'lenderState'
      discriminator: [240, 118, 235, 226, 18, 3, 58, 25]
    },
    {
      name: 'liquidityAsset'
      discriminator: [22, 73, 54, 231, 39, 50, 13, 200]
    },
    {
      name: 'pauser'
      discriminator: [89, 8, 96, 152, 205, 147, 228, 46]
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
      name: 'receivableInfo'
      discriminator: [208, 42, 208, 188, 66, 81, 252, 69]
    },
    {
      name: 'trancheState'
      discriminator: [212, 231, 254, 24, 238, 63, 92, 105]
    },
  ]
  events: [
    {
      name: 'adminRnRChangedEvent'
      discriminator: [162, 15, 70, 37, 162, 171, 144, 232]
    },
    {
      name: 'billRefreshedEvent'
      discriminator: [33, 190, 26, 149, 6, 129, 254, 114]
    },
    {
      name: 'committedCreditStartedEvent'
      discriminator: [225, 205, 18, 32, 116, 248, 144, 154]
    },
    {
      name: 'creditApprovedEvent'
      discriminator: [115, 228, 64, 127, 161, 102, 51, 20]
    },
    {
      name: 'creditClosedAfterPayOffEvent'
      discriminator: [42, 246, 230, 254, 59, 179, 246, 227]
    },
    {
      name: 'creditClosedManuallyEvent'
      discriminator: [113, 125, 166, 30, 120, 250, 184, 58]
    },
    {
      name: 'defaultTriggeredEvent'
      discriminator: [33, 43, 144, 64, 72, 244, 188, 240]
    },
    {
      name: 'drawdownMadeEvent'
      discriminator: [90, 183, 149, 36, 9, 84, 143, 175]
    },
    {
      name: 'eaFeesWithdrawalFailedEvent'
      discriminator: [127, 171, 119, 121, 24, 76, 237, 26]
    },
    {
      name: 'eaFeesWithdrawnEvent'
      discriminator: [184, 116, 214, 21, 215, 31, 15, 129]
    },
    {
      name: 'epochClosedEvent'
      discriminator: [251, 137, 115, 56, 29, 45, 19, 87]
    },
    {
      name: 'epochProcessedAfterPoolClosureEvent'
      discriminator: [177, 147, 126, 32, 32, 40, 0, 241]
    },
    {
      name: 'epochProcessedEvent'
      discriminator: [194, 222, 187, 223, 45, 135, 236, 62]
    },
    {
      name: 'evaluationAgentChangedEvent'
      discriminator: [114, 59, 16, 107, 239, 78, 2, 244]
    },
    {
      name: 'feeStructureChangedEvent'
      discriminator: [88, 81, 32, 90, 90, 69, 61, 67]
    },
    {
      name: 'humaConfigChangedEvent'
      discriminator: [160, 214, 104, 167, 105, 118, 72, 49]
    },
    {
      name: 'humaConfigCreatedEvent'
      discriminator: [26, 180, 206, 1, 69, 200, 198, 48]
    },
    {
      name: 'humaOwnerChangedEvent'
      discriminator: [207, 10, 60, 174, 128, 211, 216, 125]
    },
    {
      name: 'incomeDistributedEvent'
      discriminator: [78, 79, 123, 18, 100, 244, 90, 115]
    },
    {
      name: 'lpConfigChangedEvent'
      discriminator: [241, 93, 140, 107, 238, 126, 168, 245]
    },
    {
      name: 'lateFeeWaivedEvent'
      discriminator: [88, 202, 71, 28, 227, 196, 228, 54]
    },
    {
      name: 'lenderAddedEvent'
      discriminator: [31, 45, 5, 253, 219, 146, 30, 204]
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
      name: 'lenderRemovedEvent'
      discriminator: [23, 119, 237, 54, 194, 187, 234, 196]
    },
    {
      name: 'limitAndCommitmentUpdatedEvent'
      discriminator: [239, 145, 157, 166, 123, 172, 32, 232]
    },
    {
      name: 'liquidityAssetAddedEvent'
      discriminator: [236, 97, 82, 119, 201, 5, 123, 110]
    },
    {
      name: 'liquidityAssetRemovedEvent'
      discriminator: [113, 233, 16, 1, 157, 110, 78, 202]
    },
    {
      name: 'liquidityDepositedEvent'
      discriminator: [90, 3, 240, 128, 109, 154, 131, 185]
    },
    {
      name: 'lossDistributedEvent'
      discriminator: [71, 209, 46, 81, 145, 57, 44, 146]
    },
    {
      name: 'lossRecoveryDistributedEvent'
      discriminator: [80, 4, 141, 181, 157, 116, 41, 76]
    },
    {
      name: 'newEpochStartedEvent'
      discriminator: [150, 143, 199, 54, 170, 64, 102, 38]
    },
    {
      name: 'pauserAddedEvent'
      discriminator: [228, 58, 132, 243, 148, 43, 212, 160]
    },
    {
      name: 'pauserRemovedEvent'
      discriminator: [158, 143, 81, 197, 30, 84, 65, 233]
    },
    {
      name: 'paymentDeclaredEvent'
      discriminator: [109, 161, 244, 93, 31, 21, 25, 79]
    },
    {
      name: 'paymentMadeEvent'
      discriminator: [162, 95, 166, 200, 55, 20, 249, 115]
    },
    {
      name: 'poolAccountsCreatedEvent'
      discriminator: [127, 206, 225, 205, 163, 244, 34, 254]
    },
    {
      name: 'poolBasicDataChangedEvent'
      discriminator: [248, 167, 78, 171, 4, 222, 78, 203]
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
      name: 'poolOwnerFeesWithdrawalFailedEvent'
      discriminator: [79, 241, 11, 215, 73, 139, 72, 36]
    },
    {
      name: 'poolOwnerFeesWithdrawnEvent'
      discriminator: [225, 65, 248, 86, 101, 101, 76, 78]
    },
    {
      name: 'poolOwnerTreasuryChangedEvent'
      discriminator: [140, 110, 16, 105, 86, 252, 169, 49]
    },
    {
      name: 'poolSettingsChangedEvent'
      discriminator: [213, 116, 197, 39, 131, 62, 205, 16]
    },
    {
      name: 'principalPaymentMadeEvent'
      discriminator: [110, 241, 194, 160, 185, 147, 143, 17]
    },
    {
      name: 'profitDistributedEvent'
      discriminator: [7, 200, 84, 168, 183, 158, 99, 47]
    },
    {
      name: 'protocolFeesWithdrawalFailedEvent'
      discriminator: [81, 244, 200, 52, 64, 172, 129, 181]
    },
    {
      name: 'protocolFeesWithdrawnEvent'
      discriminator: [142, 109, 101, 78, 169, 208, 188, 216]
    },
    {
      name: 'protocolPausedEvent'
      discriminator: [0, 32, 186, 132, 252, 198, 0, 66]
    },
    {
      name: 'protocolUnpausedEvent'
      discriminator: [9, 233, 157, 73, 160, 202, 189, 14]
    },
    {
      name: 'receivableApprovedEvent'
      discriminator: [32, 250, 173, 238, 17, 235, 75, 239]
    },
    {
      name: 'receivableCreatedEvent'
      discriminator: [223, 215, 119, 42, 244, 37, 103, 102]
    },
    {
      name: 'receivableMetadataUriUpdatedEvent'
      discriminator: [174, 73, 88, 155, 17, 15, 228, 35]
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
      name: 'redemptionRequestsProcessedEvent'
      discriminator: [115, 203, 205, 92, 52, 66, 198, 188]
    },
    {
      name: 'remainingPeriodsExtendedEvent'
      discriminator: [19, 250, 33, 106, 8, 220, 78, 241]
    },
    {
      name: 'yieldTrackerRefreshedEvent'
      discriminator: [48, 100, 71, 36, 117, 201, 145, 140]
    },
    {
      name: 'yieldUpdatedEvent'
      discriminator: [177, 90, 108, 19, 131, 243, 44, 244]
    },
  ]
  errors: [
    {
      code: 6100
      name: 'humaOwnerRequired'
    },
    {
      code: 6101
      name: 'protocolFeeHigherThanUpperLimit'
    },
    {
      code: 6102
      name: 'humaTreasuryRequired'
    },
    {
      code: 6103
      name: 'poolOwnerTreasuryRequired'
    },
    {
      code: 6104
      name: 'poolOwnerOrEaRequired'
    },
    {
      code: 6105
      name: 'receivableUpdateAuthorityRequired'
    },
    {
      code: 6200
      name: 'poolOwnerRequired'
    },
    {
      code: 6201
      name: 'poolOwnerOrHumaOwnerRequired'
    },
    {
      code: 6202
      name: 'invalidHumaConfig'
    },
    {
      code: 6203
      name: 'protocolIsPaused'
    },
    {
      code: 6204
      name: 'invalidUnderlyingMint'
    },
    {
      code: 6205
      name: 'poolIsNotOn'
    },
    {
      code: 6206
      name: 'humaConfigAccountRequired'
    },
    {
      code: 6207
      name: 'zeroAmountProvided'
    },
    {
      code: 6208
      name: 'unsupportedFunction'
    },
    {
      code: 6209
      name: 'invalidTrancheState'
    },
    {
      code: 6210
      name: 'invalidBasisPointHigherThan10000'
    },
    {
      code: 6211
      name: 'epochClosedTooEarly'
    },
    {
      code: 6212
      name: 'insufficientAmountForRequest'
    },
    {
      code: 6213
      name: 'poolIsOff'
    },
    {
      code: 6214
      name: 'minDepositAmountTooLow'
    },
    {
      code: 6215
      name: 'latePaymentGracePeriodTooLong'
    },
    {
      code: 6216
      name: 'adminRewardRateTooHigh'
    },
    {
      code: 6302
      name: 'zeroPayPeriodsProvided'
    },
    {
      code: 6303
      name: 'committedAmountExceedsCreditLimit'
    },
    {
      code: 6304
      name: 'creditWithoutCommitmentShouldHaveNoDesignatedStartDate'
    },
    {
      code: 6305
      name: 'designatedStartDateInThePast'
    },
    {
      code: 6306
      name: 'payPeriodsTooLowForCreditsWithDesignatedStartDate'
    },
    {
      code: 6307
      name: 'creditLimitTooHigh'
    },
    {
      code: 6308
      name: 'creditNotInStateForApproval'
    },
    {
      code: 6309
      name: 'evaluationAgentRequired'
    },
    {
      code: 6310
      name: 'committedCreditCannotBeStarted'
    },
    {
      code: 6311
      name: 'eaOrSentinelRequired'
    },
    {
      code: 6312
      name: 'attemptedDrawdownOnNonRevolvingCredit'
    },
    {
      code: 6313
      name: 'drawdownNotAllowedInFinalPeriodAndBeyond'
    },
    {
      code: 6314
      name: 'creditNotInStateForDrawdown'
    },
    {
      code: 6315
      name: 'creditLimitExceeded'
    },
    {
      code: 6316
      name: 'insufficientPoolBalanceForDrawdown'
    },
    {
      code: 6317
      name: 'firstDrawdownTooEarly'
    },
    {
      code: 6318
      name: 'drawdownNotAllowedAfterDueDateWithUnpaidDue'
    },
    {
      code: 6319
      name: 'creditNotInStateForUpdate'
    },
    {
      code: 6320
      name: 'creditHasOutstandingBalance'
    },
    {
      code: 6321
      name: 'creditHasUnfulfilledCommitment'
    },
    {
      code: 6322
      name: 'borrowerOrEaRequired'
    },
    {
      code: 6323
      name: 'invalidEa'
    },
    {
      code: 6324
      name: 'creditNotInStateForMakingPayment'
    },
    {
      code: 6325
      name: 'borrowerOrSentinelRequired'
    },
    {
      code: 6326
      name: 'creditNotInStateForMakingPrincipalPayment'
    },
    {
      code: 6327
      name: 'defaultHasAlreadyBeenTriggered'
    },
    {
      code: 6328
      name: 'defaultTriggeredTooEarly'
    },
    {
      code: 6329
      name: 'zeroReceivableAmount'
    },
    {
      code: 6330
      name: 'receivableAlreadyMatured'
    },
    {
      code: 6331
      name: 'invalidReceivableState'
    },
    {
      code: 6332
      name: 'receivableOwnershipMismatch'
    },
    {
      code: 6333
      name: 'receivableAutoApprovalNotEnabled'
    },
    {
      code: 6335
      name: 'borrowerMismatch'
    },
    {
      code: 9101
      name: 'startDateLaterThanEndDate'
    },
    {
      code: 6400
      name: 'borrowAmountLessThanPlatformFees'
    },
    {
      code: 6401
      name: 'poolOperatorRequired'
    },
    {
      code: 6402
      name: 'lenderRequired'
    },
    {
      code: 6403
      name: 'authorizedInitialDepositorRequired'
    },
    {
      code: 6404
      name: 'previousAssetsNotWithdrawn'
    },
    {
      code: 6405
      name: 'depositAmountTooLow'
    },
    {
      code: 6406
      name: 'trancheLiquidityCapExceeded'
    },
    {
      code: 6407
      name: 'zeroSharesMinted'
    },
    {
      code: 6408
      name: 'insufficientSharesForRequest'
    },
    {
      code: 6409
      name: 'withdrawTooEarly'
    },
    {
      code: 6410
      name: 'poolIsNotClosed'
    },
    {
      code: 6412
      name: 'invalidTrancheMint'
    },
    {
      code: 6413
      name: 'seniorMintRequired'
    },
    {
      code: 6414
      name: 'juniorMintRequired'
    },
    {
      code: 6415
      name: 'seniorStateRequired'
    },
    {
      code: 6416
      name: 'juniorStateRequired'
    },
    {
      code: 6417
      name: 'invalidLenderTrancheToken'
    },
    {
      code: 6418
      name: 'invalidLenderStateAccount'
    },
    {
      code: 6419
      name: 'invalidTrancheTokenTransferHook'
    },
    {
      code: 6602
      name: 'poolOwnerInsufficientLiquidity'
    },
    {
      code: 6603
      name: 'evaluationAgentInsufficientLiquidity'
    },
  ]
  types: [
    {
      name: 'accruedIncomes'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'protocolIncome'
            type: 'u128'
          },
          {
            name: 'poolOwnerIncome'
            type: 'u128'
          },
          {
            name: 'eaIncome'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'adminRnR'
      docs: [
        'Rewards and Responsibilities for pool admins.',
        '',
        '# Fields:',
        '* `reward_rate_bps_for_ea` - Percentage (in bps) of pool income allocated to EA.',
        '* `reward_rate_bps_for_pool_owner` - Percentage (in bps) of pool income allocated to the pool owner.',
        '* `liquidity_rate_bps_for_ea` - Percentage (in bps) of the liquidity cap to be contributed by EA in the junior tranche.',
        '* `liquidity_rate_bps_for_pool_owner` - Percentage (in bps) of the liquidity cap to be contributed by the pool owner in the junior tranche.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'rewardRateBpsForEa'
            type: 'u16'
          },
          {
            name: 'rewardRateBpsForPoolOwner'
            type: 'u16'
          },
          {
            name: 'liquidityRateBpsForEa'
            type: 'u16'
          },
          {
            name: 'liquidityRateBpsForPoolOwner'
            type: 'u16'
          },
        ]
      }
    },
    {
      name: 'adminRnRChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'adminRnr'
            type: {
              defined: {
                name: 'adminRnR'
              }
            }
          },
        ]
      }
    },
    {
      name: 'baseAssetV1'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'key'
            type: {
              defined: {
                name: 'key'
              }
            }
          },
          {
            name: 'owner'
            type: 'pubkey'
          },
          {
            name: 'updateAuthority'
            type: {
              defined: {
                name: 'updateAuthority'
              }
            }
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'uri'
            type: 'string'
          },
          {
            name: 'seq'
            type: {
              option: 'u64'
            }
          },
        ]
      }
    },
    {
      name: 'billRefreshedEvent'
      docs: [
        'Account billing info refreshed with the updated due amount and date.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
        '* `new_due_date` - The updated due date of the bill.',
        '* `next_due` - The amount of next due on the bill.',
        '* `total_past_due` - The total amount of past due on the bill.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'newDueDate'
            type: 'u64'
          },
          {
            name: 'nextDue'
            type: 'u128'
          },
          {
            name: 'totalPastDue'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'committedCreditStartedEvent'
      docs: [
        'A credit with a committed amount has started.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'createReceivableArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'uri'
            type: 'string'
          },
          {
            name: 'currencyCode'
            type: 'string'
          },
          {
            name: 'receivableAmount'
            type: 'u128'
          },
          {
            name: 'maturityDate'
            type: 'u64'
          },
          {
            name: 'referenceId'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'creditApprovedEvent'
      docs: [
        'A credit has been approved.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The address of the borrower.',
        '* `credit_limit` - The maximum amount that can be borrowed.',
        '* `period_duration` - The duration of each pay period, e.g., monthly, quarterly, or semi-annually.',
        '* `remaining_periods` - The number of periods before the credit expires.',
        '* `yield_bps` - The expected yield expressed in basis points, where 1% is 100, and 100% is 10,000.',
        '* `committed_amount` - The amount that the borrower has committed to use. If the used credit',
        'is less than this amount, the borrower will be charged yield using this amount.',
        '* `designated_start_date` - The date after which the credit can start.',
        '* `revolving` - A flag indicating if repeated borrowing is allowed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'creditLimit'
            type: 'u128'
          },
          {
            name: 'periodDuration'
            type: {
              defined: {
                name: 'payPeriodDuration'
              }
            }
          },
          {
            name: 'remainingPeriods'
            type: 'u32'
          },
          {
            name: 'yieldBps'
            type: 'u32'
          },
          {
            name: 'committedAmount'
            type: 'u128'
          },
          {
            name: 'designatedStartDate'
            type: 'u64'
          },
          {
            name: 'revolving'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'creditClosedAfterPayOffEvent'
      docs: [
        'An existing credit has been closed.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'creditClosedManuallyEvent'
      docs: [
        'An existing credit has been closed by the borrower or EA.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'creditConfig'
      docs: [
        '`CreditConfig` keeps track of the static settings of a credit.',
        'A `CreditConfig` is created after the approval of each credit.',
        '# Fields:',
        '* `credit_limit` - The maximum amount that can be borrowed.',
        '* `committed_amount` - The amount that the borrower has committed to use. If the used credit',
        'is less than this amount, the borrower will be charged yield using this amount.',
        '* `pay_period_duration` - The duration of each pay period, e.g., monthly, quarterly, or semi-annually.',
        '* `num_periods` - The number of periods before the credit expires.',
        '* `yield_bps` - The expected yield expressed in basis points, where 1% is 100, and 100% is 10,000. It means different things',
        'for different credit types:',
        '1. For credit line, it is APR.',
        '2. For factoring, it is factoring fee for the given period.',
        '3. For dynamic yield credit, it is the estimated APY.',
        '* `advance_rate_bps` - Percentage of receivable nominal amount to be available for drawdown.',
        '* `revolving` - A flag indicating if repeated borrowing is allowed.',
        '* `receivable_auto_approval` - Whether receivables will be automatically approved on drawdown. If `false`,',
        'then the receivable needs to be manually approved before drawdown.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'creditLimit'
            type: 'u128'
          },
          {
            name: 'committedAmount'
            type: 'u128'
          },
          {
            name: 'periodDuration'
            type: {
              defined: {
                name: 'payPeriodDuration'
              }
            }
          },
          {
            name: 'numPeriods'
            type: 'u32'
          },
          {
            name: 'yieldBps'
            type: 'u32'
          },
          {
            name: 'advanceRateBps'
            type: 'u16'
          },
          {
            name: 'revolving'
            type: 'bool'
          },
          {
            name: 'receivableAutoApproval'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'creditRecord'
      docs: [
        '`CreditRecord` keeps track of the dynamic stats of a credit that change',
        'from pay period to pay period, e.g. due info for each bill.',
        '',
        '# Fields',
        '* `unbilled_principal` - The amount of principal not included in the bill.',
        '* `next_due_date` - The due date of the next payment.',
        '* `next_due` - The due amount of the next payment. This does not include past due.',
        '* `yield_due` - The yield due for the next payment.',
        '* `total_past_due` - The sum of late fee + past due. See `DueDetail` for more info.',
        '* `missed_periods` - The number of consecutive missed payments, for default processing.',
        '* `remaining_periods` - The number of payment periods until the maturity of the credit.',
        '* `status` - The status of the credit, e.g. `GoodStanding`, `Delayed`, `Defaulted`.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'unbilledPrincipal'
            type: 'u128'
          },
          {
            name: 'nextDueDate'
            type: 'u64'
          },
          {
            name: 'nextDue'
            type: 'u128'
          },
          {
            name: 'yieldDue'
            type: 'u128'
          },
          {
            name: 'totalPastDue'
            type: 'u128'
          },
          {
            name: 'missedPeriods'
            type: 'u32'
          },
          {
            name: 'remainingPeriods'
            type: 'u32'
          },
          {
            name: 'status'
            type: {
              defined: {
                name: 'creditStatus'
              }
            }
          },
        ]
      }
    },
    {
      name: 'creditState'
      docs: [
        'The credit-related data of the borrower.',
        '',
        '# Fields',
        '* `borrower` - The address of the borrower.',
        '* `credit_record` - The `CreditRecord` of the borrower.',
        '* `due_detail` -The `DueDetail` of the borrower.',
        '* `receivable_available_credits` - The amount of available credits for drawdown for receivable-backed credit lines.',
        "The value is always 0 if the borrower doesn't have a receivable backed credit line.",
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'creditRecord'
            type: {
              defined: {
                name: 'creditRecord'
              }
            }
          },
          {
            name: 'dueDetail'
            type: {
              defined: {
                name: 'dueDetail'
              }
            }
          },
          {
            name: 'receivableAvailableCredits'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'creditStatus'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'deleted'
          },
          {
            name: 'approved'
          },
          {
            name: 'goodStanding'
          },
          {
            name: 'delayed'
          },
          {
            name: 'defaulted'
          },
        ]
      }
    },
    {
      name: 'creditType'
      docs: [
        'The type of credit that the pool supports.',
        '',
        'Variants:',
        '* `CreditLine` - Regular credit line that does not require collateral.',
        '* `ReceivableBackedCreditLine` - Credit line that requires backing by receivables.',
      ]
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'creditLine'
          },
          {
            name: 'receivableBackedCreditLine'
          },
        ]
      }
    },
    {
      name: 'defaultTriggeredEvent'
      docs: [
        'The credit has been marked as Defaulted.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The address of the borrower.',
        '* `principal_loss` - The principal losses to be written off because of the default.',
        '* `yield_loss` - The unpaid yield due to be written off.',
        '* `fees_loss` - The unpaid fees to be written off.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'principalLoss'
            type: 'u128'
          },
          {
            name: 'yieldLoss'
            type: 'u128'
          },
          {
            name: 'feesLoss'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'depositRecord'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'principal'
            type: 'u128'
          },
          {
            name: 'lastDepositTime'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'distributeProfitToTranchesResult'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'juniorProfits'
            type: 'u128'
          },
          {
            name: 'seniorProfits'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'drawdownMadeEvent'
      docs: [
        'A credit has been borrowed from.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
        '* `borrow_amount` - The amount the user has borrowed.',
        '* `net_amount_to_borrower` - The borrowing amount minus the fees that are charged upfront.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'borrowAmount'
            type: 'u128'
          },
          {
            name: 'netAmountToBorrower'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'dueDetail'
      docs: [
        '`DueDetail` records the detailed information about next due and past due.',
        '',
        '`CreditRecord.yield_due` = max(committed, accrued) - paid',
        '`CreditRecord.total_past_due` = late_fee + principal_past_due + yield_past_due',
        'This struct is necessary since commitment requirement might change within a period.',
        '',
        '# Fields',
        '* `late_fee_updated_date` - The most recent date when late fee was updated.',
        '* `late_fee` - The late charges only. It is always updated together with lateFeeUpdatedDate.',
        '* `principal_past_due` - The unpaid principal past due.',
        '* `yield_past_due` - The unpaid yield past due.',
        '* `committed` - The amount of yield computed from commitment set in CreditConfig.',
        '* `accrued` - The amount of yield based on actual usage.',
        '* `paid` - The amount of yield paid for the current period.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'lateFeeUpdatedDate'
            type: 'u64'
          },
          {
            name: 'lateFee'
            type: 'u128'
          },
          {
            name: 'principalPastDue'
            type: 'u128'
          },
          {
            name: 'yieldPastDue'
            type: 'u128'
          },
          {
            name: 'committed'
            type: 'u128'
          },
          {
            name: 'accrued'
            type: 'u128'
          },
          {
            name: 'paid'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'eaFeesWithdrawalFailedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'receiver'
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
      name: 'eaFeesWithdrawnEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'receiver'
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
      name: 'epoch'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'u64'
          },
          {
            name: 'endTime'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'epochClosedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'epochId'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'epochProcessedAfterPoolClosureEvent'
      docs: [
        'The current epoch has been processed after the pool is closed.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `epoch_id` - The ID of the epoch that has been processed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'epochId'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'epochProcessedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'tranche'
            type: 'pubkey'
          },
          {
            name: 'epochId'
            type: 'u64'
          },
          {
            name: 'price'
            type: 'u128'
          },
          {
            name: 'sharesRequested'
            type: 'u128'
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
      name: 'epochRedemptionSummary'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'epochId'
            type: 'u64'
          },
          {
            name: 'totalSharesRequested'
            type: 'u128'
          },
          {
            name: 'totalSharesProcessed'
            type: 'u128'
          },
          {
            name: 'totalAmountProcessed'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'evaluationAgentChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'oldEa'
            type: 'pubkey'
          },
          {
            name: 'newEa'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'feeStructure'
      docs: [
        'Fee related settings.',
        '',
        '# Fields:',
        '* `front_loading_fee_flat` - Part of platform fee, charged as a flat amount when borrowing occurs.',
        '* `front_loading_fee_bps` - Part of platform fee, charged as a % of the borrowing amount when borrowing occurs.',
        '* `yield_bps` - Expected yield in basis points.',
        '* `late_fee_bps` - The late fee rate expressed in bps. The late fee is the additional charge on top of the yield',
        'when a payment is late, and is calculated as a % of the total outstanding balance.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'frontLoadingFeeFlat'
            type: 'u128'
          },
          {
            name: 'frontLoadingFeeBps'
            type: 'u16'
          },
          {
            name: 'yieldBps'
            type: 'u16'
          },
          {
            name: 'lateFeeBps'
            type: 'u16'
          },
        ]
      }
    },
    {
      name: 'feeStructureChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'feeStructure'
            type: {
              defined: {
                name: 'feeStructure'
              }
            }
          },
        ]
      }
    },
    {
      name: 'humaConfig'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'owner'
            docs: ['Address of the protocol owner']
            type: 'pubkey'
          },
          {
            name: 'treasury'
            type: 'pubkey'
          },
          {
            name: 'sentinel'
            type: 'pubkey'
          },
          {
            name: 'protocolFeeBps'
            docs: ['The protocol fee']
            type: 'u16'
          },
          {
            name: 'paused'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'humaConfigChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'treasury'
            type: 'pubkey'
          },
          {
            name: 'sentinel'
            type: 'pubkey'
          },
          {
            name: 'protocolFeeBps'
            type: 'u16'
          },
        ]
      }
    },
    {
      name: 'humaConfigCreatedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'owner'
            type: 'pubkey'
          },
          {
            name: 'treasury'
            type: 'pubkey'
          },
          {
            name: 'sentinel'
            type: 'pubkey'
          },
          {
            name: 'protocolFeeBps'
            type: 'u16'
          },
        ]
      }
    },
    {
      name: 'humaOwnerChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
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
      name: 'incomeDistributedEvent'
      docs: [
        'Event for the distribution of pool admin incomes.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `protocol_income` - Income distributed to the protocol owner in this transaction.',
        '* `pool_owner_income` - Income distributed to the pool owner in this transaction.',
        '* `ea_income` - Income distributed to the Evaluation Agent in this transaction.',
        '* `remaining` - The remaining income after finishing distributing to the admins.',
        '* `accrued_protocol_income` - The accrued income for the protocol owner.',
        '* `accrued_pool_owner_income` - The accrued income for the pool owner.',
        '* `accrued_ea_income` - The accrued income for the Evaluation Agent.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'protocolIncome'
            type: 'u128'
          },
          {
            name: 'poolOwnerIncome'
            type: 'u128'
          },
          {
            name: 'eaIncome'
            type: 'u128'
          },
          {
            name: 'remaining'
            type: 'u128'
          },
          {
            name: 'accruedProtocolIncome'
            type: 'u128'
          },
          {
            name: 'accruedPoolOwnerIncome'
            type: 'u128'
          },
          {
            name: 'accruedEaIncome'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'incomeWithdrawn'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'protocolIncomeWithdrawn'
            type: 'u128'
          },
          {
            name: 'poolOwnerIncomeWithdrawn'
            type: 'u128'
          },
          {
            name: 'eaIncomeWithdrawn'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'key'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'uninitialized'
          },
          {
            name: 'assetV1'
          },
          {
            name: 'hashedAssetV1'
          },
          {
            name: 'pluginHeaderV1'
          },
          {
            name: 'pluginRegistryV1'
          },
          {
            name: 'collectionV1'
          },
        ]
      }
    },
    {
      name: 'lpConfig'
      docs: [
        'Lender related configurations.',
        '',
        '# Fields:',
        '* `liquidity_cap` - The max liquidity allowed for the pool.',
        '* `max_senior_junior_ratio` - The upper bound of senior-to-junior ratio allowed.',
        '* `fixed_senior_yield_bps` - The fixed yield for senior tranche. Either this or tranches_risk_adjustment_bps is non-zero.',
        '* `tranches_risk_adjustment_bps` - Percentage of yield to be shifted from senior to junior. Either this or fixed_senior_yield_bps is non-zero.',
        '* `withdrawal_lockout_period_days` - How long a lender has to wait after the last deposit before they can withdraw.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'liquidityCap'
            type: 'u128'
          },
          {
            name: 'maxSeniorJuniorRatio'
            type: 'u8'
          },
          {
            name: 'fixedSeniorYieldBps'
            type: 'u16'
          },
          {
            name: 'tranchesRiskAdjustmentBps'
            type: 'u16'
          },
          {
            name: 'withdrawalLockoutPeriodDays'
            type: 'u16'
          },
        ]
      }
    },
    {
      name: 'lpConfigChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
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
      name: 'lateFeeWaivedEvent'
      docs: [
        'Part or all of the late fee due of a credit has been waived.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
        '* `old_late_fee` - The amount of late fee before the update.',
        '* `new_late_fee` - The amount of late fee after the update.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'oldLateFee'
            type: 'u128'
          },
          {
            name: 'newLateFee'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'lender'
      type: {
        kind: 'struct'
        fields: []
      }
    },
    {
      name: 'lenderAddedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
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
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'tranche'
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
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'tranche'
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
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'nextEpochIdToProcess'
            type: 'u64'
          },
          {
            name: 'numSharesRequested'
            type: 'u128'
          },
          {
            name: 'principalRequested'
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
        ]
      }
    },
    {
      name: 'lenderRemovedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
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
      name: 'lenderState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'depositRecord'
            type: {
              defined: {
                name: 'depositRecord'
              }
            }
          },
          {
            name: 'redemptionRecord'
            type: {
              defined: {
                name: 'lenderRedemptionRecord'
              }
            }
          },
        ]
      }
    },
    {
      name: 'limitAndCommitmentUpdatedEvent'
      docs: [
        'The credit limit and committed amount of a credit have been updated.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
        '* `old_credit_limit` - The old credit limit before the update.',
        '* `new_credit_limit` - The new credit limit after the update.',
        '* `old_committed_amount` - The old committed amount before the update.',
        '* `new_committed_amount` - The new committed amount after the update.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'oldCreditLimit'
            type: 'u128'
          },
          {
            name: 'newCreditLimit'
            type: 'u128'
          },
          {
            name: 'oldCommittedAmount'
            type: 'u128'
          },
          {
            name: 'newCommittedAmount'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'liquidityAsset'
      type: {
        kind: 'struct'
        fields: []
      }
    },
    {
      name: 'liquidityAssetAddedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'mint'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'liquidityAssetRemovedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'mint'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'liquidityDepositedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'tranche'
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
        ]
      }
    },
    {
      name: 'lossDistributedEvent'
      docs: [
        'Event for the distribution of loss in the pool.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `loss` - The amount of loss distributed.',
        '* `senior_total_assets` - The total amount of senior assets post loss distribution.',
        '* `junior_total_assets` - The total amount of junior assets post loss distribution.',
        '* `senior_total_loss` - The total amount of loss the senior tranche suffered post loss distribution.',
        '* `junior_total_loss` - The total amount of loss the junior tranche suffered post loss distribution.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'loss'
            type: 'u128'
          },
          {
            name: 'seniorTotalAssets'
            type: 'u128'
          },
          {
            name: 'juniorTotalAssets'
            type: 'u128'
          },
          {
            name: 'seniorTotalLoss'
            type: 'u128'
          },
          {
            name: 'juniorTotalLoss'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'lossRecoveryDistributedEvent'
      docs: [
        'Event for the distribution of loss recovery in the pool.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `loss_recovery` - The amount of loss recovery distributed.',
        '* `senior_total_assets` - The total amount of senior assets post loss recovery distribution.',
        '* `junior_total_assets` - The total amount of junior assets post loss recovery distribution.',
        '* `senior_total_loss` - The remaining amount of loss the senior tranche suffered post loss recovery distribution.',
        '* `junior_total_loss` - The remaining amount of loss the junior tranche suffered post loss recovery distribution.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'lossRecovery'
            type: 'u128'
          },
          {
            name: 'seniorTotalAssets'
            type: 'u128'
          },
          {
            name: 'juniorTotalAssets'
            type: 'u128'
          },
          {
            name: 'seniorTotalLoss'
            type: 'u128'
          },
          {
            name: 'juniorTotalLoss'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'makePaymentResult'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amountToCollect'
            type: 'u128'
          },
          {
            name: 'paidOff'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'makePrincipalPaymentResult'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amountToCollect'
            type: 'u128'
          },
          {
            name: 'paidOff'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'newEpochStartedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'epochId'
            type: 'u64'
          },
          {
            name: 'endTime'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'pauser'
      type: {
        kind: 'struct'
        fields: []
      }
    },
    {
      name: 'pauserAddedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'pauser'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'pauserRemovedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'pauser'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'payPeriodDuration'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'monthly'
          },
          {
            name: 'quarterly'
          },
          {
            name: 'semiAnnually'
          },
        ]
      }
    },
    {
      name: 'paymentDeclaredEvent'
      docs: [
        'The update authority of a receivable declares that a payment has been made to the receivable.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `authority` - The authority that declared the payment.',
        '* `reference_id` - The unique reference ID of the receivable token.',
        '* `currency_code`-  The ISO 4217 currency code that the receivable is denominated in.',
        '* `amount` - The amount that was declared paid.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'referenceId'
            type: 'string'
          },
          {
            name: 'currencyCode'
            type: 'string'
          },
          {
            name: 'amount'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'paymentMadeEvent'
      docs: [
        'A payment has been made against the credit.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
        '* `amount` - The payback amount.',
        '* `next_due_date` - The due date of the next payment.',
        '* `yield_due` - The yield due on the credit after processing the payment.',
        '* `principal_due` - The principal due on the credit after processing the payment.',
        '* `yield_due_paid` - The amount of this payment applied to yield due in the current billing cycle.',
        '* `principal_due_paid` - The amount of this payment applied to principal due in the current billing cycle.',
        '* `unbilled_principal_paid` - The amount of this payment applied to unbilled principal.',
        '* `yield_past_due_paid` - The amount of this payment applied to yield past due.',
        '* `late_fee_paid` - The amount of this payment applied to late fee.',
        '* `principal_past_due_paid` - The amount of this payment applied to principal past due.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'amount'
            type: 'u128'
          },
          {
            name: 'nextDueDate'
            type: 'u64'
          },
          {
            name: 'yieldDue'
            type: 'u128'
          },
          {
            name: 'principalDue'
            type: 'u128'
          },
          {
            name: 'yieldDuePaid'
            type: 'u128'
          },
          {
            name: 'principalDuePaid'
            type: 'u128'
          },
          {
            name: 'unbilledPrincipalPaid'
            type: 'u128'
          },
          {
            name: 'yieldPastDuePaid'
            type: 'u128'
          },
          {
            name: 'lateFeePaid'
            type: 'u128'
          },
          {
            name: 'principalPastDuePaid'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'poolAccountsCreatedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'poolAuthority'
            type: 'pubkey'
          },
          {
            name: 'juniorTrancheMint'
            type: 'pubkey'
          },
          {
            name: 'seniorTrancheMint'
            type: 'pubkey'
          },
          {
            name: 'poolAccountUnderlying'
            type: 'pubkey'
          },
          {
            name: 'poolAccountJuniorTranche'
            type: 'pubkey'
          },
          {
            name: 'poolAccountSeniorTranche'
            type: 'pubkey'
          },
          {
            name: 'poolJuniorState'
            type: 'pubkey'
          },
          {
            name: 'poolSeniorState'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolBasicDataChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'poolName'
            type: 'string'
          },
          {
            name: 'tranchesPolicyType'
            type: {
              defined: {
                name: 'tranchesPolicyType'
              }
            }
          },
        ]
      }
    },
    {
      name: 'poolClosedEvent'
      docs: [
        'The pool has been closed.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `by` - The address that closed the pool.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'by'
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
            name: 'humaConfig'
            type: 'pubkey'
          },
          {
            name: 'poolId'
            type: 'pubkey'
          },
          {
            name: 'poolOwner'
            type: 'pubkey'
          },
          {
            name: 'poolName'
            type: 'string'
          },
          {
            name: 'underlyingMint'
            type: 'pubkey'
          },
          {
            name: 'poolOwnerTreasury'
            type: 'pubkey'
          },
          {
            name: 'evaluationAgent'
            type: 'pubkey'
          },
          {
            name: 'tranchesPolicyType'
            type: {
              defined: {
                name: 'tranchesPolicyType'
              }
            }
          },
          {
            name: 'poolSettings'
            type: {
              defined: {
                name: 'poolSettings'
              }
            }
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
            name: 'adminRnr'
            type: {
              defined: {
                name: 'adminRnR'
              }
            }
          },
          {
            name: 'feeStructure'
            type: {
              defined: {
                name: 'feeStructure'
              }
            }
          },
        ]
      }
    },
    {
      name: 'poolCreatedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
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
            name: 'poolName'
            type: 'string'
          },
          {
            name: 'underlyingMint'
            type: 'pubkey'
          },
          {
            name: 'poolOwnerTreasury'
            type: 'pubkey'
          },
          {
            name: 'evaluationAgent'
            type: 'pubkey'
          },
          {
            name: 'tranchesPolicyType'
            type: {
              defined: {
                name: 'tranchesPolicyType'
              }
            }
          },
        ]
      }
    },
    {
      name: 'poolDisabledEvent'
      docs: [
        'The pool has been disabled.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `by` - The address that disabled the pool.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'by'
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
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `by` - The address that enabled the pool.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'by'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'poolOperator'
      type: {
        kind: 'struct'
        fields: []
      }
    },
    {
      name: 'poolOperatorAddedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
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
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
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
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
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
      name: 'poolOwnerFeesWithdrawalFailedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'receiver'
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
      name: 'poolOwnerFeesWithdrawnEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'receiver'
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
      name: 'poolOwnerTreasuryChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
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
      name: 'poolSettings'
      docs: [
        'Various pool-level settings.',
        '',
        '# Fields:',
        '* `max_credit_line` - The maximum credit line for a borrower in terms of the amount of the underlying assets.',
        '* `min_deposit_amount` - The minimum amount a lender needs to supply each time they deposit.',
        'This is also the absolute minimum balance the pool owner needs to maintain in tranches to prevent',
        'inflation attacks.',
        '* `pay_period_duration` - The number of months in one pay period.',
        '* `late_payment_grace_period_days` - The grace period before a late fee can be charged, in the unit of number of days.',
        '* `default_grace_period_days` - The grace period before a default can be triggered, in days. This can be 0.',
        '* `advance_rate_bps` - Specifies the max credit line as a percentage (in basis points) of the receivable amount.',
        'for a receivable of $100 with an advance rate of 9000 bps, the credit line can be up to $90.',
        '* `receivable_auto_approval` - Specifies whether receivables should be automatically approved during initial drawdown. If `false`, then',
        'receivables need to be approved prior to the first drawdown.',
        '* `principal_only_payment_allowed` - Specifies whether the `make_principal_payment()` functionality is allowed.',
        '* `credit_type` - The type of credit that the pool supports.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'maxCreditLine'
            type: 'u128'
          },
          {
            name: 'minDepositAmount'
            type: 'u64'
          },
          {
            name: 'payPeriodDuration'
            type: {
              defined: {
                name: 'payPeriodDuration'
              }
            }
          },
          {
            name: 'latePaymentGracePeriodDays'
            type: 'u8'
          },
          {
            name: 'defaultGracePeriodDays'
            type: 'u16'
          },
          {
            name: 'advanceRateBps'
            type: 'u16'
          },
          {
            name: 'receivableAutoApproval'
            type: 'bool'
          },
          {
            name: 'principalOnlyPaymentAllowed'
            type: 'bool'
          },
          {
            name: 'creditType'
            type: {
              defined: {
                name: 'creditType'
              }
            }
          },
        ]
      }
    },
    {
      name: 'poolSettingsChangedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'poolSettings'
            type: {
              defined: {
                name: 'poolSettings'
              }
            }
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
            name: 'status'
            type: {
              defined: {
                name: 'poolStatus'
              }
            }
          },
          {
            name: 'trancheAddrs'
            type: {
              defined: {
                name: 'trancheAddresses'
              }
            }
          },
          {
            name: 'currentEpoch'
            type: {
              defined: {
                name: 'epoch'
              }
            }
          },
          {
            name: 'trancheAssets'
            type: {
              defined: {
                name: 'trancheAssets'
              }
            }
          },
          {
            name: 'trancheLosses'
            type: {
              defined: {
                name: 'trancheLosses'
              }
            }
          },
          {
            name: 'accruedIncomes'
            type: {
              defined: {
                name: 'accruedIncomes'
              }
            }
          },
          {
            name: 'incomeWithdrawn'
            type: {
              defined: {
                name: 'incomeWithdrawn'
              }
            }
          },
          {
            name: 'seniorYieldTracker'
            type: {
              defined: {
                name: 'seniorYieldTracker'
              }
            }
          },
          {
            name: 'withdrawalReserve'
            type: 'u128'
          },
          {
            name: 'amountOriginated'
            type: 'u128'
          },
          {
            name: 'amountRepaid'
            type: 'u128'
          },
          {
            name: 'amountDefaulted'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'poolStatus'
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
            name: 'closed'
          },
        ]
      }
    },
    {
      name: 'principalPaymentMadeEvent'
      docs: [
        'A principal payment has been made against the credit.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The address of the borrower.',
        '* `payer` - The address from which the money is coming.',
        '* `amount` - The payback amount.',
        '* `next_due_date` - The due date of the next payment.',
        '* `principal_due` - The principal due on the credit after processing the payment.',
        '* `unbilled_principal` - The unbilled principal on the credit after processing the payment.',
        '* `principal_due_paid` - The amount of this payment applied to principal due.',
        '* `unbilled_principal_paid` - The amount of this payment applied to unbilled principal.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'amount'
            type: 'u128'
          },
          {
            name: 'nextDueDate'
            type: 'u64'
          },
          {
            name: 'principalDue'
            type: 'u128'
          },
          {
            name: 'unbilledPrincipal'
            type: 'u128'
          },
          {
            name: 'principalDuePaid'
            type: 'u128'
          },
          {
            name: 'unbilledPrincipalPaid'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'profitDistributedEvent'
      docs: [
        'Event for the distribution of profit in the pool.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `profit` - The amount of profit distributed.',
        '* `senior_total_assets` - The total amount of senior assets post profit distribution.',
        '* `junior_total_assets` - The total amount of junior assets post profit distribution.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'profit'
            type: 'u128'
          },
          {
            name: 'seniorTotalAssets'
            type: 'u128'
          },
          {
            name: 'juniorTotalAssets'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'protocolFeesWithdrawalFailedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'receiver'
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
      name: 'protocolFeesWithdrawnEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'receiver'
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
      name: 'protocolPausedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
            type: 'pubkey'
          },
          {
            name: 'pauser'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'protocolUnpausedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'id'
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
      name: 'receivableApprovedEvent'
      docs: [
        'A receivable has been approved and may be used for future drawdown.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `borrower` - The address of the borrower.',
        '* `asset` - The asset address of the receivable.',
        '* `receivable_amount` - The amount of the receivable.',
        '* `incremental_credits` - The incremental amount of credit available for drawdown',
        'due to the approval of the receivable.',
        '* `available_credits` - The updated total amount of credit available for drawdown.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'asset'
            type: 'pubkey'
          },
          {
            name: 'receivableAmount'
            type: 'u128'
          },
          {
            name: 'incrementalCredits'
            type: 'u128'
          },
          {
            name: 'availableCredits'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'receivableCreatedEvent'
      docs: [
        'A receivable has been created.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `owner` - The address of the owner of the receivable.',
        '* `reference_id` - The creator assigned unique ID of the receivable token.',
        '* `receivable_amount` - The total expected payment amount of the receivable.',
        '* `maturity_date` - The date at which the receivable becomes due.',
        '* `currency_code` - The ISO 4217 currency code that the receivable is denominated in.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'owner'
            type: 'pubkey'
          },
          {
            name: 'referenceId'
            type: 'string'
          },
          {
            name: 'currencyCode'
            type: 'string'
          },
          {
            name: 'receivableAmount'
            type: 'u128'
          },
          {
            name: 'maturityDate'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'receivableInfo'
      docs: [
        'Information of a receivable.',
        '',
        '# Fields',
        '* `reference_id` - A unique internal ID attached to the receivable provided by the creator,',
        'which can be used for de-duping purposes.',
        '* `currency_code` - The ISO 4217 currency code that the receivable is denominated in.',
        '* `receivable_amount` - The total expected payment amount of the receivable.',
        '* `amount_paid` - The amount of the receivable that has been paid so far.',
        '* `creation_date` - The date on which the receivable was created.',
        '* `maturity_date` - The date on which the receivable is expected to be fully paid.',
        '* `creator` - The original creator of the receivable.',
        '* `state` - The state of the receivable.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'referenceId'
            type: 'string'
          },
          {
            name: 'currencyCode'
            type: 'string'
          },
          {
            name: 'receivableAmount'
            type: 'u128'
          },
          {
            name: 'amountPaid'
            type: 'u128'
          },
          {
            name: 'creationDate'
            type: 'u64'
          },
          {
            name: 'maturityDate'
            type: 'u64'
          },
          {
            name: 'creator'
            type: 'pubkey'
          },
          {
            name: 'state'
            type: {
              defined: {
                name: 'receivableState'
              }
            }
          },
        ]
      }
    },
    {
      name: 'receivableMetadataUriUpdatedEvent'
      docs: [
        'The metadata URI of the receivable has been updated.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `authority` - The authority that performed the update.',
        '* `asset` - The asset address that was updated.',
        '* `old_uri` - The old metadata URI of the receivable.',
        '* `new_uri` - The new metadata URI of the receivable.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'asset'
            type: 'pubkey'
          },
          {
            name: 'oldUri'
            type: 'string'
          },
          {
            name: 'newUri'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'receivableState'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'deleted'
          },
          {
            name: 'minted'
          },
          {
            name: 'approved'
          },
          {
            name: 'partiallyPaid'
          },
          {
            name: 'paid'
          },
          {
            name: 'rejected'
          },
          {
            name: 'delayed'
          },
          {
            name: 'defaulted'
          },
        ]
      }
    },
    {
      name: 'redemptionRequestAddedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'tranche'
            type: 'pubkey'
          },
          {
            name: 'epochId'
            type: 'u64'
          },
          {
            name: 'lender'
            type: 'pubkey'
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
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'tranche'
            type: 'pubkey'
          },
          {
            name: 'epochId'
            type: 'u64'
          },
          {
            name: 'lender'
            type: 'pubkey'
          },
          {
            name: 'shares'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'redemptionRequestsProcessedEvent'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'seniorTrancheAssets'
            type: 'u128'
          },
          {
            name: 'juniorTrancheAssets'
            type: 'u128'
          },
          {
            name: 'amountUnprocessed'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'remainingPeriodsExtendedEvent'
      docs: [
        'The expiration (maturity) date of a credit has been extended.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
        '* `old_remaining_periods` - The number of remaining pay periods before the extension.',
        '* `new_remaining_periods` - The number of remaining pay periods after the extension.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'oldRemainingPeriods'
            type: 'u32'
          },
          {
            name: 'newRemainingPeriods'
            type: 'u32'
          },
        ]
      }
    },
    {
      name: 'seniorYieldTracker'
      docs: [
        'Tracks the amount of assets and unpaid yield for the senior tranche.',
        '',
        '# Fields:',
        '* `total_assets` - The total assets in the senior tranche.',
        '* `unpaid_yield` - The amount of unpaid yield to the senior tranche.',
        '* `last_updated_date` - The last time the tracker was updated.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'totalAssets'
            type: 'u128'
          },
          {
            name: 'unpaidYield'
            type: 'u128'
          },
          {
            name: 'lastUpdatedDate'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'trancheAddresses'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'addrs'
            type: {
              vec: {
                option: 'pubkey'
              }
            }
          },
        ]
      }
    },
    {
      name: 'trancheAssets'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'assets'
            type: {
              vec: 'u128'
            }
          },
        ]
      }
    },
    {
      name: 'trancheLosses'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'losses'
            type: {
              vec: 'u128'
            }
          },
        ]
      }
    },
    {
      name: 'trancheState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'epochRedemptionSummaries'
            type: {
              vec: {
                defined: {
                  name: 'epochRedemptionSummary'
                }
              }
            }
          },
        ]
      }
    },
    {
      name: 'tranchesPolicyType'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'fixedSeniorYield'
          },
          {
            name: 'riskAdjusted'
          },
        ]
      }
    },
    {
      name: 'triggerDefaultResult'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'principalLoss'
            type: 'u128'
          },
          {
            name: 'yieldLoss'
            type: 'u128'
          },
          {
            name: 'feesLoss'
            type: 'u128'
          },
        ]
      }
    },
    {
      name: 'updateAuthority'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'none'
          },
          {
            name: 'address'
            fields: ['pubkey']
          },
          {
            name: 'collection'
            fields: ['pubkey']
          },
        ]
      }
    },
    {
      name: 'yieldTrackerRefreshedEvent'
      docs: [
        'The senior yield tracker has been refreshed.',
        '',
        '# Fields:',
        '* `total_assets` - The total assets in the senior tranche after the refresh.',
        '* `unpaid_yield` - The amount of unpaid yield to the senior tranche after the refresh.',
        '* `last_updated_date` - The last time the tracker was updated after the refresh.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'totalAssets'
            type: 'u128'
          },
          {
            name: 'unpaidYield'
            type: 'u128'
          },
          {
            name: 'lastUpdatedDate'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'yieldUpdatedEvent'
      docs: [
        'The yield of a credit has been updated.',
        '',
        '# Fields:',
        '* `pool` - The pool ID.',
        '* `borrower` - The borrower of the credit.',
        '* `old_yield_bps` - The old yield in basis points before the update.',
        '* `new_yield_bps` - The new yield in basis points after the update.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'borrower'
            type: 'pubkey'
          },
          {
            name: 'oldYieldBps'
            type: 'u32'
          },
          {
            name: 'newYieldBps'
            type: 'u32'
          },
        ]
      }
    },
  ]
  constants: [
    {
      name: 'approvedLenderSeed'
      type: 'bytes'
      value: '[97, 112, 112, 114, 111, 118, 101, 100, 95, 108, 101, 110, 100, 101, 114]'
    },
    {
      name: 'creditConfigSeed'
      type: 'bytes'
      value: '[99, 114, 101, 100, 105, 116, 95, 99, 111, 110, 102, 105, 103]'
    },
    {
      name: 'creditStateSeed'
      type: 'bytes'
      value: '[99, 114, 101, 100, 105, 116, 95, 115, 116, 97, 116, 101]'
    },
    {
      name: 'daysInAHalfYear'
      type: 'u32'
      value: '180'
    },
    {
      name: 'daysInAMonth'
      type: 'u32'
      value: '30'
    },
    {
      name: 'daysInAQuarter'
      type: 'u32'
      value: '90'
    },
    {
      name: 'daysInAYear'
      type: 'u32'
      value: '360'
    },
    {
      name: 'defaultDecimalsFactor'
      type: 'u128'
      value: '1000000000000000000'
    },
    {
      name: 'extraAccountMetaListSeed'
      type: 'bytes'
      value: '[101, 120, 116, 114, 97, 45, 97, 99, 99, 111, 117, 110, 116, 45, 109, 101, 116, 97, 115]'
    },
    {
      name: 'humaConfigSeed'
      type: 'bytes'
      value: '[104, 117, 109, 97, 95, 99, 111, 110, 102, 105, 103]'
    },
    {
      name: 'humaProgramAuthoritySeed'
      type: 'bytes'
      value: '[104, 117, 109, 97, 95, 112, 114, 111, 103, 114, 97, 109, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]'
    },
    {
      name: 'hundredPercentBps'
      type: 'u32'
      value: '10000'
    },
    {
      name: 'juniorTranche'
      type: 'u32'
      value: '0'
    },
    {
      name: 'juniorTrancheMintSeed'
      type: 'bytes'
      value: '[106, 117, 110, 105, 111, 114, 95, 116, 114, 97, 110, 99, 104, 101, 95, 109, 105, 110, 116]'
    },
    {
      name: 'lenderStateSeed'
      type: 'bytes'
      value: '[108, 101, 110, 100, 101, 114, 95, 115, 116, 97, 116, 101]'
    },
    {
      name: 'liquidityAssetSeed'
      type: 'bytes'
      value: '[108, 105, 113, 117, 105, 100, 105, 116, 121, 95, 97, 115, 115, 101, 116]'
    },
    {
      name: 'minDepositAmountThreshold'
      docs: [
        'The smallest value that `PoolConfig.min_deposit_amount` can be set to. Note that this value is "pre-decimals",',
        'i.e. if the underlying token is USDC, then this represents $10 in USDC.',
      ]
      type: 'u64'
      value: '10'
    },
    {
      name: 'pauserSeed'
      type: 'bytes'
      value: '[112, 97, 117, 115, 101, 114]'
    },
    {
      name: 'poolAuthoritySeed'
      type: 'bytes'
      value: '[112, 111, 111, 108, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]'
    },
    {
      name: 'poolConfigSeed'
      type: 'bytes'
      value: '[112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]'
    },
    {
      name: 'poolOperatorSeed'
      type: 'bytes'
      value: '[112, 111, 111, 108, 95, 111, 112, 101, 114, 97, 116, 111, 114]'
    },
    {
      name: 'poolStateSeed'
      type: 'bytes'
      value: '[112, 111, 111, 108, 95, 115, 116, 97, 116, 101]'
    },
    {
      name: 'protocolFeeUpperBound'
      type: 'u16'
      value: '5000'
    },
    {
      name: 'receivableInfoSeed'
      type: 'bytes'
      value: '[114, 101, 99, 101, 105, 118, 97, 98, 108, 101, 95, 105, 110, 102, 111]'
    },
    {
      name: 'secondsInADay'
      type: 'u64'
      value: '86400'
    },
    {
      name: 'seniorTranche'
      type: 'u32'
      value: '1'
    },
    {
      name: 'seniorTrancheMintSeed'
      type: 'bytes'
      value: '[115, 101, 110, 105, 111, 114, 95, 116, 114, 97, 110, 99, 104, 101, 95, 109, 105, 110, 116]'
    },
    {
      name: 'trancheStateSeed'
      type: 'bytes'
      value: '[116, 114, 97, 110, 99, 104, 101, 95, 115, 116, 97, 116, 101]'
    },
  ]
}
