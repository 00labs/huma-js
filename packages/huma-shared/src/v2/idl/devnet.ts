/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/huma_solana.json`.
 */
export type HumaSolana = {
  address: '6VsBVe7dhKyEGoihwUtGwU9MeS6suKDSuZEMC4LHZyka'
  metadata: {
    name: 'humaSolana'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'addApprovedLender'
      docs: [
        'Adds an approved lender.',
        '',
        'Lenders need to pass compliance requirements. Pool operator will administer off-chain',
        'to make sure potential lenders meet the requirements. Afterwards, the pool operator will',
        'call this instruction to mark a lender as approved.',
        '',
        '# Arguments',
        '* `lender` - The lender address.',
        '',
        '# Access Control',
        'Only pool operators can call this instruction.',
      ]
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
      docs: [
        'Adds an asset that can serve as the underlying asset for the pools.',
        '',
        '# Access Control',
        'Only the Huma owner can call this instruction.',
      ]
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
      docs: [
        'Adds a pauser, who can pause the entire protocol.',
        '',
        '# Arguments',
        '* `pauser` - The address to be added to the pauser list.',
        '',
        '# Access Control',
        'Only the Huma owner can call this instruction.',
      ]
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
          name: 'pauser'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'addPoolOperator'
      docs: [
        'Adds a new operator to the pool.',
        '',
        '# Arguments',
        '* `operator` - The address of the pool operator.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
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
      docs: [
        'Records a new redemption request.',
        '',
        '# Arguments',
        '* `shares` - The number of shares the lender wants to redeem.',
        '',
        '# Access Control',
        'Only lenders can call this instruction.',
      ]
      discriminator: [72, 203, 201, 17, 75, 60, 157, 47]
      accounts: [
        {
          name: 'lender'
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
          address: 'Bb31NqmD3LbAbDDnwD8iLfBkRx2T8KGYc3u1py4hTSuh'
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
      docs: [
        'Approves the credit with the terms provided.',
        '',
        '# Arguments',
        '* `borrower` - The borrower address.',
        '* `credit_limit` - The credit limit of the credit line.',
        '* `num_periods` - The number of periods before the credit line expires.',
        '* `yield_bps` - The expected yield expressed in basis points, 1% is 100, 100% is 10000.',
        '* `committed_amount` - The amount that the borrower has committed to use. If the used credit',
        'is less than this amount, the borrower will be charged yield using this amount.',
        '* `designated_start_date` - The date on which the credit should be initiated, if the credit',
        'has commitment.',
        '* `revolving` - A flag indicating if the repeated borrowing is allowed.',
        '',
        '# Access Control',
        'Only the EA can call this instruction.',
      ]
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
      docs: [
        'Approves a receivable and adjusts available credit by applying the advance ratio.',
        '',
        '# Access Control',
        'Only the EA can call this instruction.',
      ]
      discriminator: [117, 201, 147, 119, 71, 35, 253, 218]
      accounts: [
        {
          name: 'evaluationAgent'
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
                path: 'asset'
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
      docs: [
        'Cancels a redemption request submitted before.',
        '',
        '# Arguments',
        '* `shares` - The number of shares in the redemption request to be canceled.',
        '',
        '# Access Control',
        'Only lenders can call this instruction.',
      ]
      discriminator: [77, 155, 4, 179, 114, 233, 162, 45]
      accounts: [
        {
          name: 'lender'
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
          address: 'Bb31NqmD3LbAbDDnwD8iLfBkRx2T8KGYc3u1py4hTSuh'
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
      docs: [
        'Changes the Huma owner.',
        '',
        '# Arguments',
        '* `new_owner` - The new Huma owner.',
        '',
        '# Access Control',
        'Only the Huma owner can call this instruction.',
      ]
      discriminator: [0, 115, 141, 68, 122, 216, 36, 53]
      accounts: [
        {
          name: 'owner'
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
      docs: [
        'Changes the pool owner.',
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
      docs: [
        'Closes a credit record.',
        '',
        '# Access Control',
        'Only the borrower and EA can call this instruction.',
      ]
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
          docs: ['The recipient of the rent refunds.', '`has_one` constraint.']
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
      docs: [
        'Closes the current epoch, handles tranche redemption requests and starts the next epoch.',
        '',
        '# Dev Notes',
        'We expect a cron-like mechanism like Autotask to call this instruction periodically to close epochs.',
        '',
        '# Access Control',
        'Anyone can call this instruction to trigger epoch closure, but no one will be able to',
        'close an epoch prematurely.',
      ]
      discriminator: [13, 87, 7, 133, 109, 14, 83, 25]
      accounts: [
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
      name: 'closeLenderAccounts'
      docs: [
        'Closes the accounts owned by the lender.',
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
          name: 'lenderTrancheToken'
          writable: true
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
      name: 'closePool'
      docs: [
        'Closes the pool after its maturity.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can close a pool.',
      ]
      discriminator: [140, 189, 209, 23, 239, 62, 239, 11]
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
      docs: [
        'Creates a Huma protocol config.',
        '',
        '# Arguments',
        '* `id` - The ID of the config.',
        '* `treasury` - The Huma Treasury address.',
        '* `sentinel` - The Sentinel Service account address. This is the account that handles',
        'various tasks, such as Autopay and starting a committed credit.',
        '* `protocol_fee_bps` - The Huma protocol fee in bps.',
        '',
        '# Access Control',
        'Only the Huma owner can call this instruction.',
      ]
      discriminator: [217, 139, 156, 146, 27, 106, 58, 137]
      accounts: [
        {
          name: 'owner'
          docs: ['Address to be set as the protocol owner.']
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
      name: 'createLenderAccounts'
      docs: [
        'Creates the accounts necessary for an approved lender.',
        '',
        '# Access Control',
        'Only the pool owner treasury, EA and other approved lenders can call this instruction.',
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
          name: 'approvedLender'
        },
        {
          name: 'trancheMint'
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
          name: 'lenderTrancheToken'
          writable: true
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
      name: 'createPool'
      docs: [
        'Creates a new liquidity pool.',
        '# Arguments',
        '* `pool_id` - The ID of the pool.',
        '* `pool_name` - The name of the pool.',
        '* `pool_owner_treasury` - The address of the pool owner treasury, which will be responsible',
        'for providing initial liquidity and receiving pool owner fees.',
        '* `evaluation_agent` - The address of the Evaluation Agent, which is responsible for making',
        'various credit decisions.',
        '* `tranches_policy_type` - The tranches policy type that governs the profit distribution',
        'mechanism between tranches.',
        '',
        '# Access Control',
        'Anyone can call this instruction. The signer will be designated as the owner of the pool.',
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
          name: 'poolAuthority'
          pda: {
            seeds: [
              {
                kind: 'arg'
                path: 'poolId'
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
    },
    {
      name: 'createPoolAccounts'
      docs: [
        'Creates various accounts needed by the pool.',
        '',
        '# Access Control',
        'Only the pool owner can call this instruction.',
      ]
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
      docs: [
        'Creates a new receivable NFT.',
        '',
        '# Arguments',
        '* `args` - The parameters used during creation. See the doc string for `CreateReceivableArgs`',
        'for what each field represents.',
        '',
        '# Access Control',
        'Anyone can call this instruction.',
      ]
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
            'This will be the `authority`, `owner` and `update_authority` of the receivable,',
            'as well as the one paying for account storage.',
          ]
          writable: true
          signer: true
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
                path: 'asset'
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
      docs: [
        'Declares a payment for a receivable.',
        '',
        '# Note',
        'Due to its self-declaration nature, this information is for transparency only and is not guaranteed',
        'to be accurate. Some asset originators may choose to have an audit firm periodically certify the declared',
        'payments to enhance credibility.',
        'Declaring a payment on a receivable here does not necessarily mean the same amount has been paid back',
        'to the associated credit line. The receivable creditor is responsible for calling this function when',
        'payment is received from the debtor.',
        '',
        '# Arguments',
        '* `payment_amount` - The amount of the payment being declared.',
        '',
        '# Access Control',
        'Only the update authority of the receivable NFT can declare a payment.',
      ]
      discriminator: [238, 48, 82, 155, 64, 143, 45, 103]
      accounts: [
        {
          name: 'authority'
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
                path: 'asset'
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
      docs: [
        'LP deposits to the pool to earn yield and share losses.',
        '',
        'All deposits should be made by calling this function and',
        "`make_initial_deposit()` (for pool owner and EA's initial deposit) only.",
        'Please do NOT directly transfer any digital assets to the pool,',
        'which will cause a permanent loss and we cannot help reverse transactions',
        'or retrieve assets from the contracts.',
        '',
        '# Arguments',
        '* `assets` - The number of underlyingTokens to be deposited.',
        '',
        '# Returns',
        'The number of tranche token to be minted.',
        '',
        '# Access Control',
        'Only approved lenders can call this instruction.',
      ]
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182]
      accounts: [
        {
          name: 'depositor'
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
          name: 'trancheMint'
          writable: true
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'depositorUnderlyingToken'
          writable: true
        },
        {
          name: 'depositorTrancheToken'
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
          name: 'assets'
          type: 'u64'
        },
      ]
      returns: 'u64'
    },
    {
      name: 'disablePool'
      docs: [
        'Disables the pool. Once a pool is disabled, no money moves in or out.',
        '',
        '# Access Control',
        'Any pool operator can disable a pool. Only the pool owner and the Huma',
        'owner can enable it again.',
      ]
      discriminator: [248, 118, 211, 160, 149, 150, 135, 37]
      accounts: [
        {
          name: 'operator'
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
      docs: [
        'Transfers all the amount that has been redeemed but not yet disbursed to the lender.',
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
      docs: [
        'Borrows against an approved credit line.',
        '',
        '# Arguments',
        '* `amount` - The amount to borrow.',
        '',
        '# Access Control',
        'Only the borrower of the credit line can call this instruction.',
      ]
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
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'borrowerUnderlyingToken'
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
      docs: [
        'Turns on the pool. Before a pool is turned on, the required tranche liquidity must be',
        'deposited first.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can enable a pool.',
      ]
      discriminator: [120, 47, 0, 69, 84, 74, 16, 177]
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
          name: 'juniorMint'
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
          name: 'poolOwnerTreasuryJuniorToken'
        },
        {
          name: 'poolOwnerTreasurySeniorToken'
          optional: true
        },
        {
          name: 'eaJuniorToken'
        },
        {
          name: 'eaSeniorToken'
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
      docs: [
        'Updates the remaining periods of the credit line.',
        '',
        '# Arguments',
        '* `num_of_periods` - The number of periods to add onto the credit line.',
        '',
        '# Access Control',
        'Only the EA can call this instruction.',
      ]
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
      docs: [
        'Initializes the extra account meta list for transfer hook purposes.',
        '',
        '# Access Control',
        'Only the pool owner can call this instruction.',
      ]
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
          address: 'Bb31NqmD3LbAbDDnwD8iLfBkRx2T8KGYc3u1py4hTSuh'
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
      docs: [
        'Allows the pool owner and EA to make initial deposit before the pool goes live.',
        '',
        '# Arguments',
        '* `assets` - The amount of underlyingTokens to be deposited.',
        '',
        '# Returns',
        'The number of tranche token to be minted.',
        '',
        '# Access Control',
        'Only authorized initial depositors can call this instruction.',
      ]
      discriminator: [141, 233, 75, 102, 37, 93, 94, 79]
      accounts: [
        {
          name: 'depositor'
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
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'depositorUnderlyingToken'
          writable: true
        },
        {
          name: 'depositorTrancheToken'
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
          name: 'assets'
          type: 'u64'
        },
      ]
      returns: 'u64'
    },
    {
      name: 'makePayment'
      docs: [
        'Makes one payment for the credit line. This can be initiated by the borrower',
        'or by Sentinel Service account with the allowance approval from the borrower.',
        'If this is the final payment, it automatically triggers the payoff process.',
        '',
        'Warning: payments should be made by calling this function. No token should be transferred',
        'directly to the pool.',
        '',
        '# Arguments',
        '* `amount` - The payment amount.',
        '',
        '# Returns',
        '* `amount_to_collect` - The actual amount paid to the pool. When the tendered',
        'amount is larger than the payoff amount, the contract only accepts the payoff amount.',
        '* `paid_off` - A flag indicating whether the account has been paid off.',
        '',
        '# Access Control',
        'Only the borrower and the Sentinel Service account can call this instruction.',
      ]
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
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'borrowerUnderlyingToken'
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
      docs: [
        'Makes a payment towards the principal for the credit line. Even if there is additional',
        'amount remaining after the principal is paid off, this function will only accept the',
        'amount up to the total principal due. If this is the final payment, it automatically',
        'triggers the payoff process.',
        '',
        'Warning: payments should be made by calling this function. No token should be transferred',
        'directly to the pool.',
        '',
        '# Arguments',
        '* `amount` - The payment amount.',
        '',
        '# Returns',
        '* `amount_to_collect` - The actual amount paid to the pool. When the tendered',
        'amount is larger than the payoff amount, the contract only accepts the payoff amount.',
        '* `paid_off` - A flag indicating whether the account has been paid off.',
        '',
        '# Access Control',
        'Only the borrower can call this instruction.',
      ]
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
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'borrowerUnderlyingToken'
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
      name: 'pauseProtocol'
      docs: [
        'Pauses the entire protocol. Used in extreme cases by the pausers.',
        '',
        '# Dev Notes',
        'This function will not be governed by timelock due to its sensitivity to timing.',
        '',
        '# Access Control',
        'Only pausers can call this instruction.',
      ]
      discriminator: [144, 95, 0, 107, 119, 39, 248, 141]
      accounts: [
        {
          name: 'pauser'
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
      docs: [
        'Updates the account and brings its billing status current.',
        '',
        '# Access Control',
        'Anyone can call this instruction.',
      ]
      discriminator: [251, 178, 39, 243, 183, 35, 101, 109]
      accounts: [
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
      docs: [
        'Removes a lender. This prevents the lender from making more deposits.',
        'The capital that the lender has contributed will continue to work as normal.',
        '',
        '# Dev Notes',
        'It is intentional not to delete depositRecord for the lender so that they do not',
        'lose existing investment. They can request redemption post removal as a lender.',
        'Because of lockup period and pool liquidity constraints, we cannot automatically',
        'disburse the investment by this lender.',
        '',
        '# Arguments',
        '* `lender` - The lender address.',
        '',
        '# Access Control',
        'Only pool operators can call this instruction.',
      ]
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
      docs: [
        'Removes an asset so that it can no longer serve as the underlying asset for the pools.',
        '',
        '# Access Control',
        'Only the Huma owner can call this instruction.',
      ]
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
      docs: [
        'Removes a pauser.',
        '',
        '# Arguments',
        '* `pauser` - The address to be removed from the pauser list.',
        '',
        '# Access Control',
        'Only the Huma owner can call this instruction.',
      ]
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
          name: 'pauser'
          type: 'pubkey'
        },
      ]
    },
    {
      name: 'removePoolOperator'
      docs: [
        'Adds an operator from the pool.',
        '',
        '# Arguments',
        '* `operator` - The address of the pool operator.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
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
      docs: [
        'Sets pool admin rewards and responsibility settings.',
        '',
        '# Arguments',
        '* `admin_rnr` - The new admin R&R settings.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [18, 166, 239, 157, 122, 242, 254, 152]
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
      docs: [
        'Sets the Evaluation Agent of the pool.',
        '',
        '# Arguments',
        '* `new_ea` - The address of the new Evaluation Agent.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
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
          name: 'juniorMint'
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
          name: 'newEaJuniorToken'
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'eaUnderlyingToken'
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
      docs: [
        'Sets the fee structure of the pool.',
        '',
        '# Arguments',
        '* `fees` - The new fee structure.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [177, 185, 185, 94, 80, 253, 137, 255]
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
      ]
      args: [
        {
          name: 'feeStructure'
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
      docs: [
        'Sets Liquidity Provider configurations.',
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
      docs: [
        'Sets the pool owner treasury.',
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
          name: 'juniorMint'
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
          name: 'newTreasuryJuniorToken'
        },
        {
          name: 'newTreasurySeniorToken'
          optional: true
        },
        {
          name: 'underlyingMint'
          relations: ['poolConfig']
        },
        {
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'poolOwnerTreasuryUnderlyingToken'
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
      docs: [
        'Sets various pool settings.',
        '',
        '# Arguments',
        '* `settings` - The new pool settings.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [220, 224, 160, 141, 102, 160, 35, 231]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
        {
          name: 'underlyingMint'
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
      docs: [
        'Initiates a credit line with a committed amount on the designated start date.',
        '',
        'This function is intended to be used for credit lines where there is a minimum borrowing',
        'commitment. If the borrower fails to drawdown the committed amount within the set timeframe,',
        'this function activates the credit line and applies yield based on the committed amount.',
        '',
        '# Access Control',
        'Only the pool owner and the Sentinel Service account can call this instruction.',
      ]
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
      docs: [
        'Submits a receivable for auto-approval, if auto-approval is allowed by the pool.',
        'Adjusts available credit by applying the advance ratio if the receivable is approved.',
        '',
        '# Access Control',
        'Only the borrower can call this instruction.',
      ]
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
                path: 'asset'
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
      docs: [
        'Triggers the default process.',
        '',
        '# Returns',
        '* `principal_loss` - The amount of principal loss.',
        '* `yield_loss` - The amount of yield loss.',
        '* `fees_loss` - The amount of admin fees loss.',
        '',
        '# Dev Notes',
        'It is possible for the borrower to pay back even after default.',
        '',
        '# Access Control',
        'Only the EA can call this instruction.',
      ]
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
      name: 'unpauseProtocol'
      docs: [
        'Unpauses the entire protocol.',
        '',
        '# Access Control',
        'Only the Huma owner can call this instruction.',
      ]
      discriminator: [183, 154, 5, 183, 105, 76, 87, 18]
      accounts: [
        {
          name: 'owner'
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
      docs: [
        'Updates various Huma config settings.',
        '',
        '# Arguments',
        '* `treasury` - The new Huma Treasury address.',
        '* `sentinel` - The new Sentinel Service account address.',
        '* `protocol_fee_bps` - The new Huma protocol fee in bps.',
        '',
        '# Access Control',
        'Only the Huma owner can call this instruction.',
      ]
      discriminator: [39, 78, 0, 251, 70, 22, 97, 163]
      accounts: [
        {
          name: 'owner'
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
      docs: [
        'Updates the limit and commitment amount for this credit.',
        '',
        '# Arguments',
        '* `new_credit_limit` - The new credit limit to set.',
        '* `new_committed_amount` - The new committed amount. The borrower will be charged interest for',
        'this amount even if the daily average borrowing amount in a month is less than this amount.',
        '',
        '# Access Control',
        'Only the EA can call this instruction.',
      ]
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
      name: 'updatePoolBasicConfig'
      docs: [
        'Updates basic pool configurations.',
        '',
        '# Arguments',
        '* `pool_name` - The new name of the pool.',
        '* `tranches_policy_type` - The new tranches policy type.',
        '',
        '# Access Control',
        'Only the pool owner and the Huma owner can call this instruction.',
      ]
      discriminator: [37, 141, 152, 211, 142, 207, 32, 108]
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
      ]
      args: [
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
    },
    {
      name: 'updateReceivableMetadataUri'
      docs: [
        'Updates the metadata URI of a receivable.',
        '',
        '# Arguments',
        '* `uri` - The new metadata URI of the receivable.',
        '',
        '# Access Control',
        'Only the update authority of the receivable NFT can call this instruction.',
      ]
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
      name: 'updateToLatestRedemptionRecord'
      discriminator: [73, 99, 253, 48, 195, 111, 208, 184]
      accounts: [
        {
          name: 'lender'
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
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: []
    },
    {
      name: 'updateYield'
      docs: [
        'Updates the yield for the credit.',
        '',
        '# Arguments',
        '* `new_yield_bps` - The new yield expressed in basis points.',
        '',
        '# Access Control',
        'Only the EA can call this instruction.',
      ]
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
      docs: [
        'Waives the late fee up to the given limit.',
        '',
        '# Arguments',
        '* `amount` - The amount of late fee to waive. The actual amount waived is the smaller of',
        'this value and the actual amount of late fee due.',
        '',
        '# Returns',
        'The amount of late fee waived.',
        '',
        '# Access Control',
        'Only the EA can call this instruction.',
      ]
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
      docs: [
        "Withdraws all the lender's assets after the pool has been permanently closed.",
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
      docs: [
        'Withdraw the Evaluation Agent fees.',
        '',
        '# Arguments',
        '* `amount` - The amount to be withdrawn.',
        '',
        '# Access Control',
        'Either the EA or pool owner can trigger reward withdrawal for EA.',
        "When it is triggered by the pool owner, the fund still flows to the EA's account.",
      ]
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
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'eaUnderlyingToken'
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
      docs: [
        'Withdraws the pool fees.',
        '',
        '# Arguments',
        '* `amount` - The amount to be withdrawn.',
        '',
        '# Access Control',
        'Only the pool owner treasury account can call this instruction.',
      ]
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
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'signerUnderlyingToken'
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
      docs: [
        'Withdraws the protocol fees.',
        '',
        '# Arguments',
        '* `amount` - The amount to be withdrawn.',
        '',
        '# Access Control',
        'Only the Huma treasury account can call this instruction.',
      ]
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
          name: 'poolUnderlyingToken'
          writable: true
        },
        {
          name: 'signerUnderlyingToken'
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
      name: 'lenderAccountsClosedEvent'
      discriminator: [114, 190, 186, 18, 188, 195, 238, 186]
    },
    {
      name: 'lenderAccountsCreatedEvent'
      discriminator: [175, 24, 152, 252, 143, 70, 152, 142]
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
      name: 'poolBasicConfigChangedEvent'
      discriminator: [156, 251, 67, 67, 95, 41, 255, 137]
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
      code: 6001
      name: 'zeroAmountProvided'
    },
    {
      code: 6002
      name: 'invalidBasisPointHigherThan10000'
    },
    {
      code: 6003
      name: 'insufficientAmountForRequest'
    },
    {
      code: 6004
      name: 'insufficientSharesForRequest'
    },
    {
      code: 6005
      name: 'zeroSharesMinted'
    },
    {
      code: 6006
      name: 'unsupportedFunction'
    },
    {
      code: 6101
      name: 'startDateLaterThanEndDate'
    },
    {
      code: 6201
      name: 'humaOwnerRequired'
    },
    {
      code: 6202
      name: 'humaTreasuryRequired'
    },
    {
      code: 6203
      name: 'poolOwnerRequired'
    },
    {
      code: 6204
      name: 'poolOwnerOrHumaOwnerRequired'
    },
    {
      code: 6205
      name: 'poolOwnerOrEaRequired'
    },
    {
      code: 6206
      name: 'poolOwnerTreasuryRequired'
    },
    {
      code: 6207
      name: 'poolOperatorRequired'
    },
    {
      code: 6208
      name: 'lenderRequired'
    },
    {
      code: 6209
      name: 'borrowerOrEaRequired'
    },
    {
      code: 6210
      name: 'borrowerOrSentinelRequired'
    },
    {
      code: 6211
      name: 'evaluationAgentRequired'
    },
    {
      code: 6212
      name: 'eaOrSentinelRequired'
    },
    {
      code: 6213
      name: 'receivableUpdateAuthorityRequired'
    },
    {
      code: 6214
      name: 'authorizedInitialDepositorRequired'
    },
    {
      code: 6301
      name: 'protocolFeeHigherThanUpperLimit'
    },
    {
      code: 6302
      name: 'protocolIsPaused'
    },
    {
      code: 6303
      name: 'invalidHumaConfig'
    },
    {
      code: 6304
      name: 'invalidUnderlyingMint'
    },
    {
      code: 6305
      name: 'invalidNumberOfDecimalsForLiquidityAsset'
    },
    {
      code: 6401
      name: 'invalidTrancheStatePda'
    },
    {
      code: 6402
      name: 'invalidTrancheMint'
    },
    {
      code: 6403
      name: 'seniorMintRequired'
    },
    {
      code: 6404
      name: 'seniorStateRequired'
    },
    {
      code: 6405
      name: 'invalidLenderTrancheToken'
    },
    {
      code: 6406
      name: 'invalidLenderStateAccount'
    },
    {
      code: 6407
      name: 'poolSeniorTokenRequired'
    },
    {
      code: 6408
      name: 'trancheTokenNotReadyToClose'
    },
    {
      code: 6409
      name: 'lenderStateNotReadyToClose'
    },
    {
      code: 6410
      name: 'adminRewardRateTooHigh'
    },
    {
      code: 6411
      name: 'poolOwnerInsufficientLiquidity'
    },
    {
      code: 6412
      name: 'evaluationAgentInsufficientLiquidity'
    },
    {
      code: 6413
      name: 'minDepositAmountTooLow'
    },
    {
      code: 6414
      name: 'latePaymentGracePeriodTooLong'
    },
    {
      code: 6415
      name: 'poolIsNotOn'
    },
    {
      code: 6416
      name: 'poolIsOff'
    },
    {
      code: 6417
      name: 'poolIsNotClosed'
    },
    {
      code: 6418
      name: 'poolNameTooLong'
    },
    {
      code: 6501
      name: 'previousAssetsNotWithdrawn'
    },
    {
      code: 6502
      name: 'trancheLiquidityCapExceeded'
    },
    {
      code: 6503
      name: 'depositAmountTooLow'
    },
    {
      code: 6504
      name: 'withdrawTooEarly'
    },
    {
      code: 6505
      name: 'epochClosedTooEarly'
    },
    {
      code: 6601
      name: 'zeroPayPeriodsProvided'
    },
    {
      code: 6602
      name: 'creditNotInStateForApproval'
    },
    {
      code: 6603
      name: 'creditLimitTooHigh'
    },
    {
      code: 6604
      name: 'committedAmountExceedsCreditLimit'
    },
    {
      code: 6605
      name: 'payPeriodsTooLowForCreditsWithDesignatedStartDate'
    },
    {
      code: 6606
      name: 'creditWithoutCommitmentShouldHaveNoDesignatedStartDate'
    },
    {
      code: 6607
      name: 'designatedStartDateInThePast'
    },
    {
      code: 6608
      name: 'committedCreditCannotBeStarted'
    },
    {
      code: 6609
      name: 'creditNotInStateForDrawdown'
    },
    {
      code: 6610
      name: 'creditLimitExceeded'
    },
    {
      code: 6611
      name: 'firstDrawdownTooEarly'
    },
    {
      code: 6612
      name: 'attemptedDrawdownOnNonRevolvingCredit'
    },
    {
      code: 6613
      name: 'insufficientPoolBalanceForDrawdown'
    },
    {
      code: 6614
      name: 'borrowAmountLessThanPlatformFees'
    },
    {
      code: 6615
      name: 'drawdownNotAllowedInFinalPeriodAndBeyond'
    },
    {
      code: 6616
      name: 'drawdownNotAllowedAfterDueDateWithUnpaidDue'
    },
    {
      code: 6617
      name: 'creditNotInStateForMakingPayment'
    },
    {
      code: 6618
      name: 'creditNotInStateForMakingPrincipalPayment'
    },
    {
      code: 6619
      name: 'zeroReceivableAmount'
    },
    {
      code: 6620
      name: 'invalidReceivableReferencePda'
    },
    {
      code: 6621
      name: 'receivableAlreadyMatured'
    },
    {
      code: 6622
      name: 'invalidReceivableState'
    },
    {
      code: 6623
      name: 'receivableOwnershipMismatch'
    },
    {
      code: 6624
      name: 'receivableAutoApprovalNotEnabled'
    },
    {
      code: 6625
      name: 'defaultHasAlreadyBeenTriggered'
    },
    {
      code: 6626
      name: 'defaultTriggeredTooEarly'
    },
    {
      code: 6627
      name: 'creditNotInStateForUpdate'
    },
    {
      code: 6628
      name: 'creditHasOutstandingBalance'
    },
    {
      code: 6629
      name: 'creditHasUnfulfilledCommitment'
    },
    {
      code: 6630
      name: 'referenceIdTooLong'
    },
  ]
  types: [
    {
      name: 'accruedIncomes'
      docs: [
        'The incomes accrued by pool admins.',
        '',
        '# Fields',
        '* `protocol_income` - The cumulative amount of income accrued by the Huma owner.',
        '* `pool_owner_income` - The cumulative amount of income accrued by the pool owner.',
        '* `ea_income` - The cumulative amount of income accrued by the Evaluation Agent.',
      ]
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
        '# Fields',
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
      docs: [
        'The admin reward and responsibility settings have been updated.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `admin_rnr` - The new admin R&R settings.',
      ]
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
        '# Fields',
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
        '# Fields',
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
      docs: [
        'Parameters used for receivable creation.',
        '',
        '# Fields',
        '* `name` - The name of the receivable.',
        '* `uri` - The URI of the metadata associated with the receivable.',
        '* `currency_code` - The ISO 4217 currency code that the receivable is denominated in.',
        '* `receivable_amount` - The total amount of the receivable.',
        '* `maturity_date` - The date on which the receivable becomes due.',
        '* `reference_id` - A unique internal reference ID used for de-duplication by the creator.',
      ]
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
        '# Fields',
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
        '# Fields',
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
        '# Fields',
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
        "Keeps track of the static settings of a credit. It's created after the approval of each credit.",
        '',
        '# Fields',
        '* `bump` - A bump seed of this PDA.',
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
        '* `revolving` - A flag indicating if repeated borrowing is allowed.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
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
            name: 'revolving'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'creditRecord'
      docs: [
        'Keeps track of the dynamic stats of a credit that change from pay period to pay period,',
        'e.g. due info for each bill.',
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
        'The credit-related states of a borrower.',
        '',
        '# Fields',
        '* `bump` - A bump seed of this PDA.',
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
            name: 'bump'
            type: 'u8'
          },
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
        '# Variants',
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
        '# Fields',
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
      docs: [
        "The information related to a lender's deposit.",
        '',
        '# Fields',
        '* `principal` - The total amount of underlying assets deposited by the lender.',
        '* `last_deposit_time` - The time the lender deposited into the pool.',
      ]
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
        '# Fields',
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
        'The detailed information about next due and past due.',
        '',
        '`CreditRecord.yield_due = max(committed, accrued) - paid`',
        '`CreditRecord.total_past_due = late_fee + principal_past_due + yield_past_due`',
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
      docs: [
        'The Evaluation Agent fee withdrawal has failed.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `receiver` - The recipient account of the fees.',
        '* `amount` - The amount of fees withdrawn.',
      ]
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
      docs: [
        'The Evaluation Agent fees have been withdrawn.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `receiver` - The recipient account of the fees.',
        '* `amount` - The amount of fees withdrawn.',
      ]
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
      docs: [
        'An epoch has closed.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `epoch_id` - The ID of the epoch that just closed.',
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
      name: 'epochProcessedAfterPoolClosureEvent'
      docs: [
        'The current epoch has been processed after the pool is closed.',
        '',
        '# Fields',
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
      docs: [
        'An epoch has been processed.',
        '',
        '# Fields',
        '* `tranche` - The ID of the tranche.',
        '* `epoch_id` - The epoch ID.',
        '* `price` - The price of the tranche token.',
        '* `shares_requested` - The number of tranche shares that were requested for redemption.',
        '* `shares_processed` - The number of tranche shares that have been redeemed.',
        '* `amount_processed` - The amount of the underlying pool asset token redeemed in this epoch.',
      ]
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
      docs: [
        'The summary of redemption information of an epoch.',
        '',
        '# Fields',
        '* `epoch_id` - The epoch ID.',
        '* `total_shares_requested` - The total number of shares requested for redemption in this epoch.',
        '* `total_shares_processed` - The total number of shares processed for redemption in this epoch.',
        '* `total_amount_processed` - The total amount redeemed in this epoch.',
        '',
        '# Dev Notes',
        'EpochRedemptionSummary space in bytes: 8 + 16 + 16 + 16 = 56',
      ]
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
      docs: [
        'The Evaluation Agent has been updated.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `old_ea` - The address of the old Evaluation Agent.',
        '* `new_ea` - The address of the new Evaluation Agent.',
      ]
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
        '# Fields',
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
      docs: [
        'The fee structure of the has been updated.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `fee_structure` - The new fee structure.',
      ]
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
            name: 'bump'
            type: 'u8'
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
          {
            name: 'paused'
            type: 'bool'
          },
        ]
      }
    },
    {
      name: 'humaConfigChangedEvent'
      docs: [
        'Various fields of the Huma config has been updated.',
        '',
        '# Fields',
        '* `id` - The ID of the Huma config being modified.',
        '* `treasury` - The address of the Huma treasury account.',
        '* `sentinel` - The address of the Sentinel Service account.',
        '* `protocol_fee_bps` - The Huma protocol fee in bps.',
      ]
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
      docs: [
        'An instance of Huma protocol config has been created.',
        '',
        '# Fields',
        '* `id` - The ID of the new Huma config.',
        '* `owner` - The address of the Huma owner account.',
        '* `treasury` - The address of the Huma treasury account.',
        '* `sentinel` - The address of the Sentinel Service account.',
        '* `protocol_fee_bps` - The Huma protocol fee in bps.',
      ]
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
      docs: [
        'The address of the Huma protocol owner has changed.',
        '',
        '# Fields',
        '* `id` - The ID of the Huma config being modified.',
        '* `owner` - The address of the new owner.',
      ]
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
        '# Fields',
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
      docs: [
        'The incomes withdrawn by pool admins.',
        '',
        '# Fields',
        '* `protocol_income_withdrawn` - The cumulative amount of income withdrawn by the Huma owner.',
        '* `pool_owner_income_withdrawn` - The cumulative amount of income withdrawn by the pool owner.',
        '* `ea_income_withdrawn` - The cumulative amount of income withdrawn by the Evaluation Agent.',
      ]
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
        '# Fields',
        '* `liquidity_cap` - The max liquidity allowed for the pool.',
        '* `max_senior_junior_ratio` - The upper bound of senior-to-junior ratio allowed.',
        '* `fixed_senior_yield_bps` - The fixed yield for senior tranche. Either this or tranches_risk_adjustment_bps is non-zero.',
        '* `tranches_risk_adjustment_bps` - Percentage of yield to be shifted from senior to junior. Either this or fixed_senior_yield_bps is non-zero.',
        '* `withdrawal_lockup_period_days` - How long a lender has to wait after the last deposit before they can withdraw.',
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
            name: 'withdrawalLockupPeriodDays'
            type: 'u16'
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
        '* `pool` - The pool ID.',
        '* `lp_config` - The new LP config.',
      ]
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
        '# Fields',
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
        fields: [
          {
            name: 'bump'
            type: 'u8'
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
        '* `tranche` - The tranche mint key.',
        '* `lender` - The lender who closed their accounts.',
      ]
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
        ]
      }
    },
    {
      name: 'lenderAccountsCreatedEvent'
      docs: [
        'Lender accounts have been created.',
        '',
        '# Fields',
        '* `tranche` - The tranche mint key.',
        '* `lender` - The lender who created their accounts.',
      ]
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
        ]
      }
    },
    {
      name: 'lenderAddedEvent'
      docs: [
        'A lender has been added.',
        '',
        '# Fields',
        '* `tranche` - The tranche mint key.',
        '* `lender` - The lender being removed.',
      ]
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
        ]
      }
    },
    {
      name: 'lenderFundDisbursedEvent'
      docs: [
        'A disbursement to the lender for a processed redemption.',
        '',
        '# Fields',
        '* `tranche` - The tranche mint key.',
        '* `lender` - The lender whose shares have been redeemed.',
        '* `amount_disbursed` - The amount of the disbursement.',
      ]
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
      docs: [
        'A lender has withdrawn all their assets after pool closure.',
        '',
        '# Fields',
        '* `tranche` - The tranche which the lender has withdrawn from.',
        '* `lender` - The lender who has withdrawn.',
        '* `shares` - The number of shares burned.',
        '* `assets` - The amount that was withdrawn.',
      ]
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
      docs: [
        "The information related to a lender's redemption.",
        '',
        '# Fields',
        '* `next_epoch_id_to_process` - The next epoch ID for redemption processing.',
        '* `num_shares_requested` - The number of shares requested for redemption in this epoch.',
        '* `principal_requested` - The principal amount included in the redemption request.',
        '* `total_amount_processed` - The total amount processed for redemption in all epochs.',
        '* `total_amount_withdrawn` - The total amount withdrawn by the lender. The withdrawable amount',
        '= `total_amount_processed` - `total_amount_withdrawn`.',
      ]
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
      docs: [
        'A lender has been removed.',
        '',
        '# Fields',
        '* `tranche` - The tranche mint key.',
        '* `lender` - The lender being removed.',
      ]
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
        '# Fields',
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
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
    {
      name: 'liquidityAssetAddedEvent'
      docs: [
        'New underlying asset supported by the protocol is added.',
        '',
        '# Fields',
        '* `id` - The ID of the Huma config being modified.',
        '* `mint` - The mint account of the liquidity asset being added.',
      ]
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
      docs: [
        'Remove the asset that is no longer supported by the protocol.',
        '',
        '# Fields',
        '* `id` - The ID of the Huma config being modified.',
        '* `mint` - The mint account of the liquidity asset being removed.',
      ]
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
      docs: [
        'A deposit has been made to the tranche.',
        '',
        '# Fields',
        '* `tranche` - The tranche mint key.',
        '* `depositor` - The account that made the deposit.',
        '* `assets` - The amount of underlying assets deposited.',
        '* `shares` - The number of shares minted for this deposit.',
      ]
      type: {
        kind: 'struct'
        fields: [
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
        '# Fields',
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
        '# Fields',
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
      docs: [
        'A new epoch has started.',
        '',
        '# Fields',
        '* `pool` - The ID of the pool.',
        '* `epoch_id` - The ID of the epoch that just started.',
        '* `end_time` - The time when the current epoch should end.',
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
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
    {
      name: 'pauserAddedEvent'
      docs: [
        'A pauser has been added. A pauser is someone who can pause the protocol.',
        '',
        '# Fields',
        '* `id` - The ID of the Huma config being modified.',
        '* `pauser` - The address of the pauser being added.',
      ]
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
      docs: [
        'A pauser has been removed.',
        '',
        '# Fields',
        '* `id` - The ID of the Huma config being modified.',
        '* `pauser` - The address of the pauser being removed.',
      ]
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
      docs: [
        'This library defines functions for date calculation. All inputs and outputs are in UTC.',
        'We use the 30/360 day count convention in this implementation, which treats every month as',
        'having 30 days and every year as having 360 days, regardless of the actual number of days in a',
        'month/year. This is a common practice in corporate finance.',
      ]
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
        '* `asset` - The asset address on which payment was declared.',
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
            name: 'asset'
            type: 'pubkey'
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
        '# Fields',
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
      docs: [
        'The accounts necessary for pool operation have been created.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `junior_mint` - The mint account of the junior tranche token.',
        '* `senior_mint` - The mint account of the senior tranche token, if the senior tranche exists.',
        '* `junior_token` - The token account of the junior tranche.',
        '* `senior_token` - The token account of the senior tranche, if the senior tranche exists.',
        '* `junior_state` - The junior tranche state.',
        '* `senior_state` - The senior tranche state, if the senior tranche exists.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'pool'
            type: 'pubkey'
          },
          {
            name: 'juniorMint'
            type: 'pubkey'
          },
          {
            name: 'seniorMint'
            type: {
              option: 'pubkey'
            }
          },
          {
            name: 'juniorToken'
            type: 'pubkey'
          },
          {
            name: 'seniorToken'
            type: {
              option: 'pubkey'
            }
          },
          {
            name: 'juniorState'
            type: 'pubkey'
          },
          {
            name: 'seniorState'
            type: {
              option: 'pubkey'
            }
          },
        ]
      }
    },
    {
      name: 'poolBasicConfigChangedEvent'
      docs: [
        'The basic pool configurations have been updated.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `pool_name` - The new name of the pool.',
        '* `tranches_policy_type` - The new tranches policy type.',
      ]
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
        '# Fields',
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
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'poolAuthorityBump'
            type: 'u8'
          },
          {
            name: 'juniorMintBump'
            type: 'u8'
          },
          {
            name: 'seniorMintBump'
            type: {
              option: 'u8'
            }
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
      docs: [
        'A liquidity pool has been created.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `huma_config` - The ID of the Huma config that the pool is associated with.',
        '* `pool_owner` - The address of the pool owner.',
        '* `pool_name` - The name of the pool.',
        '* `underlying_mint` - The mint account of the underlying asset.',
        '* `evaluation_agent` - The address of the Evaluation Agent.',
        '* `tranches_policy_type` - The tranches policy type.',
        '* `pool_authority` - The address of the pool authority account.',
        '* `pool_underlying_token` - The underlying asset token account of the pool.',
      ]
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
          {
            name: 'poolAuthority'
            type: 'pubkey'
          },
          {
            name: 'poolUnderlyingToken'
            type: 'pubkey'
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
        '* `pool` - The pool ID.',
        '* `by` - The account that disabled the pool.',
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
        '# Fields',
        '* `pool` - The pool ID.',
        '* `by` - The account that enabled the pool.',
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
        '* `pool` - The pool ID.',
        '* `operator` - The address of the new operator being added.',
      ]
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
      docs: [
        'A pool operator has been removed.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `operator` - The address of the operator being removed.',
      ]
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
      docs: [
        'The pool owner has changed.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `owner` - The address of the new owner.',
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
        ]
      }
    },
    {
      name: 'poolOwnerFeesWithdrawalFailedEvent'
      docs: [
        'The pool owner fee withdrawal has failed.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `receiver` - The recipient account of the fees.',
        '* `amount` - The amount of fees withdrawn.',
      ]
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
      docs: [
        'The pool owner fees have been withdrawn.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `receiver` - The recipient account of the fees.',
        '* `amount` - The amount of fees withdrawn.',
      ]
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
      docs: [
        'The pool owner treasury has been updated.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `old_treasury` - The address of the old pool owner treasury.',
        '* `new_treasury` - The address of the new pool owner treasury.',
      ]
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
        '# Fields',
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
      docs: [
        'The pool settings have been updated.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `pool_settings` - The new pool settings.',
      ]
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
            name: 'disbursementReserve'
            type: 'u128'
          },
          {
            name: 'amountOriginated'
            docs: ['The following fields are used by the FE only.']
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
      docs: [
        'The pool status',
        '',
        '# Variants',
        '* `Off` - The pool is temporarily turned off.',
        '* `On` - The pool is active.',
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
        '# Fields',
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
        '# Fields',
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
      docs: [
        'The protocol fee withdrawal has failed.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `receiver` - The recipient account of the fees.',
        '* `amount` - The amount of fees withdrawn.',
      ]
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
      docs: [
        'The protocol fees have been withdrawn.',
        '',
        '# Fields',
        '* `pool` - The pool ID.',
        '* `receiver` - The recipient account of the fees.',
        '* `amount` - The amount of fees withdrawn.',
      ]
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
      docs: [
        'The Huma protocol has been paused.',
        '',
        '# Fields',
        '* `id` - The ID of the Huma config being modified.',
        '* `pauser` - The pauser that paused the protocol.',
      ]
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
      docs: [
        'The Huma protocol has been unpaused.',
        '',
        '# Fields',
        '* `id` - The ID of the Huma config being modified.',
        '* `owner` - The address of the Huma owner.',
      ]
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
            name: 'asset'
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
        '* `bump` - The canonical bump of this PDA.',
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
            name: 'bump'
            type: 'u8'
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
      docs: [
        'A redemption request has been added.',
        '',
        '# Fields',
        '* `tranche` - The tranche mint key.',
        '* `epoch_id` - The epoch ID.',
        '* `lender` - The lender who requested redemption.',
        '* `shares` - The number of shares to be redeemed.',
      ]
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
      docs: [
        'A redemption request has been canceled.',
        '',
        '# Fields',
        '* `tranche` - The tranche mint key.',
        '* `epoch_id` - The epoch ID.',
        '* `lender` - The lender who requested cancellation.',
        '* `shares` - The number of shares to be included in the cancellation.',
      ]
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
      docs: [
        'Pending redemption requests have been processed.',
        '',
        '# Fields',
        '* `pool` - The ID of the pool.',
        '* `senior_tranche_assets` - The total amount of assets in the senior tranche.',
        '* `junior_tranche_assets` - The total amount of assets in the junior tranche.',
        '* `amount_unprocessed` - The amount of assets requested for redemption but not fulfilled.',
      ]
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
        '# Fields',
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
        '# Fields',
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
      docs: [
        'The state of the tranche.',
        '',
        '# Dev Notes',
        '1. `TrancheState` space in bytes: 8 + 4 + 36 * 56 = 2032',
        '2. The maximum number of `EpochRedemptionSummary` is 36, which means we can store at least',
        '3 years worth of redemption history with a monthly pay period duration.',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            type: 'u8'
          },
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
        '# Fields',
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
        '# Fields',
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
      name: 'maxTokenDecimals'
      docs: [
        'The maximum number of decimals the liquidity asset token may have.',
      ]
      type: 'u8'
      value: '9'
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
      name: 'minTokenDecimals'
      docs: [
        'The minimum number of decimals the liquidity asset token may have.',
      ]
      type: 'u8'
      value: '6'
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
      name: 'receivableReferenceSeed'
      type: 'bytes'
      value: '[114, 101, 99, 101, 105, 118, 97, 98, 108, 101, 95, 114, 101, 102, 101, 114, 101, 110, 99, 101]'
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
