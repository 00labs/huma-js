import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { ARF_PERSONA_KYC_COPY } from '../../v2'
import { SolanaChainEnum } from '../chain'
import { SolanaChainInfo, SolanaPoolsInfo } from '../pool'

export const SOLANA_DEVNET_INFO: SolanaChainInfo = {
  humaProgramAuthority: 'DMEiNSUMjXUXh2XX6gUydSt7Uan5Q4BhAjLJwYxaZUEm',
  poolProgram: 'EVQ4s1b6N1vmWFDv8PRNc77kufBP8HcrSNWXQAhRsJq9',
  sentinel: '8GQMZVEvYsssewqu2EvoAtVeBMWEkns7vGiUMQ6V7KDo',
}

export const SOLANA_DEVNET_METADATA: SolanaPoolsInfo = {
  ArfCreditPool3Months: {
    title: 'Arf - Cross Border Payment Financing',
    poolName: POOL_NAME.ArfCreditPool3Months,
    poolType: POOL_TYPE.CreditLine,
    chainId: SolanaChainEnum.SolanaDevnet,
    industry: 'Remittance Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    poolId: '76d8rK4YdHd5qxqqZ4KaJgUtCM8KkqMC3znbD9mutHgN',
    poolAuthority: 'CzQhXCdfcB53ExZCcrHKhZxf22utjGANMYMrtCBgBmJc',
    poolUnderlyingTokenAccount: 'DxgGcBC87cL4rVkYiqRdQo2Q4mV9bHuCarDH1tnnVxvv',
    poolConfig: 'GWs8KUxRaKhepYzUER4v1CWBqwjr4TmqSGYFJKz9DECG',
    humaConfig: 'F2it2fBcdjeX9KCaEAWcQ1H8LnMB2zPn3nrPpHc7J8vL',
    poolState: 'EWhyXxA9SWvTTgfH4T6ED7DYeBiojUibA2xJ74Rv2q3D',
    juniorTrancheMint: 'D8NkRC2kszBdSqVATbjsJmUhVZs8vtim7EQTm8Ac3thn',
    juniorTrancheState: 'BXccmYxW4USBk69ns6GwucfTMsjPz9GGWaHi99tC9Ywu',
    seniorTrancheMint: 'AAZ5cHWkG9XbmQBkKfeFJG1kEsxzFFhonsAinx2K2w9',
    seniorTrancheState: '4GKihfFhjGRLn3Bi7PCPzjuaJHPznDB7CioDjMZ7reZP',
    trancheDecimals: 6,
    receivable: '5o7qiQZeCbTowg75xgB5xMnYRHpXx43c6CnFbnC3MXkJ',
    underlyingMint: {
      address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
  },
}
