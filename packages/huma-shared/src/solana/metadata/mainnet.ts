import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { ARF_PERSONA_KYC_COPY } from '../../v2'
import { SolanaChainEnum } from '../chain'
import { SolanaChainInfo, SolanaPoolsInfo } from '../pool'

export const SOLANA_MAINNET_INFO: SolanaChainInfo = {
  poolProgram: 'EVQ4s1b6N1vmWFDv8PRNc77kufBP8HcrSNWXQAhRsJq9',
  sentinel: 'Huma3jh5pZd1WKKEApB66W5c75vzHfFdRUHM7oMLwdQV',
}

export const SOLANA_MAINNET_METADATA: SolanaPoolsInfo = {
  ArfCreditPool6Months: {
    title: 'Arf - Cross Border Payment Financing',
    poolName: POOL_NAME.ArfCreditPool6Months,
    poolType: POOL_TYPE.CreditLine,
    chainId: SolanaChainEnum.SolanaMainnet,
    industry: 'Remittance Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    poolId: '6oAuPDYheeDBrmRgY5z1iXvmFwbmtpEGdGBtMCWgAHwb',
    poolAuthority: 'FyBd4A7VzeTBP1dyfmmi1rqZYx6wpLT63xKKzngDKu5p',
    poolUnderlyingTokenAccount: 'FwZoHpBs1cwHRZzQ9XAzd2Jai4okVVAsNTZbAoEysRpV',
    poolConfig: '4beixqv1temogHLmJU98SLpQvGyxkgTyn2AK7dWTr3k8',
    humaConfig: 'Fh2WKYCJfota6k76gDGnhTELUuhPa7FHQvVza4cE11ja',
    poolState: 'BA1nPxHMnaWiuXeqHSGQntNnx7hobXhHNtiK1PWhrS6E',
    juniorTrancheMint: 'EabTCfsZytPd8PRAsSVxcPpMn9hPARLFgvNx6eRjFz1i',
    juniorTrancheState: '78Jz2ne15ahye3iC2vVmWF4kDQba7xFFcVE3nT9nE1q6',
    seniorTrancheMint: '9J7t9Lnd3bwmACix1Xiw9W3crdtzx6q5Y18LGt25UYco',
    seniorTrancheState: 'GGsYvQW5Xw4VLwJAzRA36NHFc146XBQJ6DveR2qBAUgS',
    trancheDecimals: 6,
    underlyingMint: {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
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
  ArfCreditPool3Months: {
    title: 'Arf - Cross Border Payment Financing',
    poolName: POOL_NAME.ArfCreditPool3Months,
    poolType: POOL_TYPE.CreditLine,
    chainId: SolanaChainEnum.SolanaMainnet,
    industry: 'Remittance Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    poolId: '29cg8D8hKeNxcN4ujoP2hTNB3eDFgYkzYEKggrJqDAsd',
    poolAuthority: '6Q4e1GEZEYS4GZJst767NU8Z6NeZoqykqhontcWZ33vS',
    poolUnderlyingTokenAccount: '8ZcgiBPiAxErfe3ZPTyKiWPFBCvNP2JeVgUKnTiiFUAc',
    poolConfig: '8NkJUfNPTn7cRF8Jn1Z84SamRe4NLKWhvQLkbcHpsRXP',
    humaConfig: 'Fh2WKYCJfota6k76gDGnhTELUuhPa7FHQvVza4cE11ja',
    poolState: 'FaAQ5uEm4Coi6mRZ2PkEobbPBDEWHTP8J3HU4jJQnPjP',
    juniorTrancheMint: '3U4X1vs4vvtadfTf4CNqdHZ3fYwL7ZLbWaTKkXjt4c2S',
    juniorTrancheState: 'UZQspSnnmUprmXKQhNxdbWTMwzqfSgoKZfoTHQPuaXw',
    seniorTrancheMint: '7HpPrzapRiAooyCUverJRZVCgXrtroNsvWspCJLh2Mjh',
    seniorTrancheState: '5zNaDGjFZ2XKN8kSX1Yf9LFUToFsd78eK1Um58wa38ZL',
    trancheDecimals: 6,
    underlyingMint: {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
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
