import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { ARF_PERSONA_KYC_COPY } from '../../v2'
import { SolanaChainEnum } from '../chain'
import {
  SolanaChainInfo,
  SolanaChainInfoPermissionless,
  SolanaPoolsInfo,
} from '../pool'

export const SOLANA_DEVNET_PERMISSIONLESS: SolanaChainInfoPermissionless = {
  poolProgram: 'ACQydQGziybxnN6dPAy3ssmYYbTp6K4rvwnBjjmh11Hj',
  humaConfig: 'F2it2fBcdjeX9KCaEAWcQ1H8LnMB2zPn3nrPpHc7J8vL',
  poolConfig: '8bZkGVDziZLver5ZTa3whZqWhRTzTBiCXHhYnS1L7BCB',
  poolState: '9tNHuAjsx3nZMWrLQrDMX5sKrMvNvZgXEo76U2C8NN3n',
  classicModeConfig: 'CdNvmFR73UoGAEPEgM4wMiVuhNDd3AAtsXhDfgPaECcy',
  classicModeMint: '3kTT1x7H2tKSA6hJXdyZnQqwFrMvse4CoBttcMRuDXzS',
  maxiModeConfig: 'GYUW3PPU5nmBo2ZQ4AmPf3tJXmH3A7q8K3ns7MgsiGAw',
  maxiModeMint: 'CQRBRW29Mk6eiVoet7bgHhvQm6H4aPSdwErxaYkWvp1T',
  underlyingMint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
}

export const SOLANA_DEVNET_INFO: SolanaChainInfo = {
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
    underlyingMint: {
      address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
    extra: {
      hasReceivables: true,
    },
  },
}
