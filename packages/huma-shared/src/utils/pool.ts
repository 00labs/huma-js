import BASE_CREDIT_POOL_ABI from '../abis/BaseCreditPool.json'
import BASE_POOL_CONFIG_ABI from '../abis/BasePoolConfig.json'
import HDT_ABI from '../abis/HDT.json'
import STEAM_FACTORING_POOL_ABI from '../abis/StreamFactoringPool.json'
import TRADABLE_STREAM_ABI from '../abis/TradableStream.json'
import { ChainEnum } from './chain'
import { configUtil } from './config'

export enum POOL_NAME {
  HumaCreditLine = 'HumaCreditLine',
  Superfluid = 'Superfluid',
  Jia = 'Jia',
  JiaV2 = 'JiaV2',
  JiaUSDC = 'JiaUSDC',
  ArfCreditPool1 = 'ArfCreditPool1',
  ArfCreditPoolV2 = 'ArfCreditPoolV2',
  ArfCreditLinePoolV2 = 'ArfCreditLinePoolV2',
  ArfPoolUSDC = 'ArfPoolUSDC',
  BSOS = 'BSOS',
  ImpactMarket = 'ImpactMarket',
  Raincards = 'Raincards',
  Quipu = 'Quipu',
}

export enum POOL_TYPE {
  Invoice = 'Invoice',
  CreditLine = 'CreditLine',
  Stream = 'Stream',
  ReceivableBackedCreditLine = 'ReceivableBackedCreditLine',
}

export type PoolMapType = {
  [poolType in POOL_TYPE]: {
    [poolName in POOL_NAME]?: {
      name: string
      borrowDesc: string
      lendDesc: string
      estAPY?: string
    }
  }
}

export type LenderApprovalProvider = {
  type: 'KYC' | 'EA'
  provider?: 'Securitize'
}

export type PoolVersion = 'v1' | 'v2'

export type PoolInfoType = {
  chainId: ChainEnum
  poolVersion: PoolVersion
  basePoolConfig: string
  pool: string
  poolProcessor?: string
  poolFeeManager: string
  poolUnderlyingToken: {
    address: string
    symbol: string
    decimals: number
    icon: string
  }
  assetAddress?: string
  poolName: POOL_NAME
  poolType: POOL_TYPE
  industry?:
    | 'Supply Chain Financing'
    | 'Remittance Financing'
    | 'Green Financing'
    | 'Invoice Factoring'
  poolAbi: unknown
  basePoolConfigAbi: unknown
  poolAssetAbi?: unknown
  HDT: {
    address: string
    abi: unknown
  }
  extra?: {
    subgraph?: string
    superToken?: { id: string; symbol: string; decimals: number }
    borrower?: string // For single borrower pools
    rwrUploader?: string // For single borrower pools where receivables are uploaded by a different wallet
    hidden?: boolean // For pools that shouldn't be displayed in the UI
    order?: number // Ordering in the pool list. Null values are sorted last.
    disableBorrow?: boolean
    lenderApprovalProvider?: LenderApprovalProvider
    detailsPage?: boolean
  }
  isClosed?: boolean
}

export type PoolInfo = {
  chainId: ChainEnum
} & PoolInfoType

export type PoolSubgraphMapType = {
  [chainId: number]: {
    subgraph: string
  }
}

export type PoolContractMapType = {
  [chainId: number]: {
    [poolType in POOL_TYPE]?: {
      [poolName in POOL_NAME]?: PoolInfoType
    }
  }
}

export const PoolMap: PoolMapType = {
  [POOL_TYPE.CreditLine]: {
    [POOL_NAME.HumaCreditLine]: {
      name: 'Huma Credit Line',
      borrowDesc:
        'Credit lines backed by your future crypto income. Only available to the members of partner DAOs during beta.',
      lendDesc:
        'Earn active yield by participating in credit lines backed by on-chain income. Only available to the members of partner DAOs during beta.',
    },
    [POOL_NAME.Jia]: {
      name: 'Jia Pioneer Fund Pool',
      borrowDesc:
        'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
      lendDesc:
        'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
      estAPY: '25-27%',
    },
    [POOL_NAME.JiaUSDC]: {
      name: 'Jia Pioneer Fund Pool in USDC',
      borrowDesc:
        'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
      lendDesc:
        'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
      estAPY: '25-27%',
    },
    [POOL_NAME.ArfCreditPool1]: {
      name: 'Arf Credit Line Pool',
      borrowDesc:
        'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
      lendDesc:
        'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
      estAPY: '13%',
    },
    [POOL_NAME.ArfPoolUSDC]: {
      name: 'Arf Credit Line Pool in USDC',
      borrowDesc:
        'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
      lendDesc:
        'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
      estAPY: '13%',
    },
    [POOL_NAME.BSOS]: {
      name: 'BSOS Green Finance Pool',
      borrowDesc:
        'BSOS, a leading FinTech SaaS company, pioneers green financing through Web3 and real-world assets.',
      lendDesc:
        'BSOS, a leading FinTech SaaS company, pioneers green financing through Web3 and real-world assets.',
      estAPY: '13%',
    },
    [POOL_NAME.ImpactMarket]: {
      name: 'impactMarket Microcredit Pool',
      borrowDesc:
        'impactMarket is empowering entrepreneurs in developing countries to thrive by providing microcredit on-chain.',
      lendDesc:
        'impactMarket is empowering entrepreneurs in developing countries to thrive by providing microcredit on-chain.',
      estAPY: '20%',
    },
    [POOL_NAME.Raincards]: {
      name: 'Rain Receivables Pool',
      borrowDesc:
        'The Rain Receivables Pool is reshaping spend management for Web3 teams, enabling Web3 entities like DAOs and protocols to effortlessly manage fiat expenses through corporate cards.',
      lendDesc:
        'The Rain Receivables Pool is reshaping spend management for Web3 teams, enabling Web3 entities like DAOs and protocols to effortlessly manage fiat expenses through corporate cards.',
      estAPY: '15%',
    },
    [POOL_NAME.Quipu]: {
      name: 'Quipu Pool',
      borrowDesc: 'The Quipu Pool. [Note: This is not visible publicly]',
      lendDesc: 'The Quipu Pool. [Note: This is not visible publicly]',
      estAPY: 'N/A%',
    },
  },
  [POOL_TYPE.Invoice]: {},
  [POOL_TYPE.Stream]: {
    [POOL_NAME.Superfluid]: {
      name: 'Superfluid',
      borrowDesc:
        'Stream factoring for your crypto streams, up to 100% of their value. Only available to select streaming platforms.',
      lendDesc:
        'Earn active yield by participating in this crypto stream factoring market where loans are backed by collateralized streaming assets and paid back automatically every moment.',
    },
  },
  [POOL_TYPE.ReceivableBackedCreditLine]: {},
}

export const PoolSubgraphMap: PoolSubgraphMapType = {
  [ChainEnum.Polygon]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-polygon',
  },
  [ChainEnum.Goerli]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-goerli',
  },
  [ChainEnum.Mumbai]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-mumbai',
  },
  [ChainEnum.Celo]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-celo',
  },
  [ChainEnum.Alfajores]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-alfajores',
  },
  [ChainEnum.Localhost]: {
    subgraph: 'http://localhost:8000/subgraphs/name/huma-localhost',
  },
  [ChainEnum.HumaTestnet]: {
    subgraph:
      'https://integration.v2.huma.finance:8000/subgraphs/name/huma-localhost',
  },
  [ChainEnum.BaseSepolia]: {
    subgraph:
      'https://api.studio.thegraph.com/query/38092/huma-base-sepolia/version/latest',
  },
}

export const PoolContractMap: PoolContractMapType = {
  [ChainEnum.Polygon]: {
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.Jia]: {
        chainId: ChainEnum.Polygon,
        poolVersion: 'v1',
        basePoolConfig: '0x901427A8328139E59EA2401cBD6bB5b1F5e72E37',
        pool: '0xe8926aDbFADb5DA91CD56A7d5aCC31AA3FDF47E5',
        poolFeeManager: '0x7Ed46Ea23CD1559a77a80F651C2115CDEe55FCD1',
        poolUnderlyingToken: {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.Jia,
        poolType: POOL_TYPE.CreditLine,
        industry: 'Supply Chain Financing',
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0xc6CF8FF8a4B7f1530AC2f0531614C824285009f8',
          abi: HDT_ABI,
        },
        extra: {
          order: 1,
          borrower: '0xd4F254006d486688cE7515199C55266C581B949A',
          disableBorrow: true,
          lenderApprovalProvider: {
            type: 'KYC',
            provider: 'Securitize',
          },
          detailsPage: true,
        },
      },
      [POOL_NAME.ArfCreditPool1]: {
        chainId: ChainEnum.Polygon,
        poolVersion: 'v1',
        basePoolConfig: '0x4AC443e87211B940C9e7c4c6801d24C34bD9f227',
        pool: '0x3EBc1f0644A69c565957EF7cEb5AEafE94Eb6FcE',
        poolFeeManager: '0x989F1194d637A928628a2d8204990E35d198b6D0',
        poolUnderlyingToken: {
          address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.ArfCreditPool1,
        poolType: POOL_TYPE.CreditLine,
        industry: 'Remittance Financing',
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0xA8aCE4AFe8801363489E1a6308031FdF84332702',
          abi: HDT_ABI,
        },
        extra: {
          borrower: '0xEA57a8A51377752fFddaa3db4d13CE8F97677F2D',
          disableBorrow: true,
          detailsPage: true,
        },
      },
      [POOL_NAME.BSOS]: {
        chainId: ChainEnum.Polygon,
        poolVersion: 'v1',
        basePoolConfig: '0x9f536Dc6A2BCf042661C03b4Cc7B21693a499C35',
        pool: '0x95533e56f397152B0013A39586bC97309e9A00a7',
        poolFeeManager: '0xC3bB8745Cc183d97e8c9Ca68587eCD6941Fb4eA6',
        poolUnderlyingToken: {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.BSOS,
        poolType: POOL_TYPE.CreditLine,
        industry: 'Green Financing',
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x02dC58749E0B53A3C9A7e2ac734920F3F0A1D5f3',
          abi: HDT_ABI,
        },
        extra: {
          borrower: '0xd581AEDAB50a0431D52829F03d42d0C61bc36119',
          disableBorrow: true,
          detailsPage: true,
        },
      },
      [POOL_NAME.Raincards]: {
        chainId: ChainEnum.Polygon,
        poolVersion: 'v1',
        basePoolConfig: '0xBD239B764731b15664F62c32b7E0a6cd78a4E34B',
        pool: '0x82a76045dc4543fa4776df1bcad11f2aa6ea51d2',
        poolFeeManager: '0x4384560Eb9d4108fcb90981e7a0f03C21bf782d8',
        poolUnderlyingToken: {
          address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.Raincards,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x238F9076D0136dE0FaAe79450Ad73250A6bcD90e',
          abi: HDT_ABI,
        },
        extra: {
          borrower: '0xdbE3976d8Bac43410f421cA69aae0eC54D8155C2',
          disableBorrow: true,
          detailsPage: true,
        },
      },
    },
    [POOL_TYPE.Stream]: {
      [POOL_NAME.Superfluid]: {
        chainId: ChainEnum.Polygon,
        poolVersion: 'v1',
        basePoolConfig: '0x22C024496036A8e97F93E14efa0d8379192bb22c',
        pool: '0xF713B5203Cb6f3223830De218c2ed89Ee654b94B',
        poolProcessor: '0x6E2f33b6d3F1E2048d078984f7FFF847C0Ed3bEd',
        poolFeeManager: '0xd5FD3F917cf8901BeB102d81504033C748c87F19',
        poolUnderlyingToken: {
          address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        assetAddress: '0xa8B0362cfE0c8e4fd1D74c3512348d6f48d71080',
        poolName: POOL_NAME.Superfluid,
        poolType: POOL_TYPE.Stream,
        poolAbi: STEAM_FACTORING_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        poolAssetAbi: TRADABLE_STREAM_ABI,
        HDT: {
          address: '0x30b1f6bca8c6c742ede0ccb4eceb22af4cba58ef',
          abi: HDT_ABI,
        },
        extra: {
          subgraph:
            'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-matic',
          superToken: {
            id: '0xcaa7349cea390f89641fe306d93591f87595dc1f',
            symbol: 'USDCx',
            decimals: 18,
          },
        },
      },
    },
  },
  [ChainEnum.Alfajores]: {
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.ArfCreditPool1]: {
        chainId: ChainEnum.Alfajores,
        poolVersion: 'v1',
        basePoolConfig: '0xae72d424f746ca5c5a4457d7dca15abf2ffd40bb',
        pool: '0x8408faD2cdb181c21AD7Fa5eF6e7B8d5e6b4Eb82',
        poolFeeManager: '0x8605305fd932a82DD8FEA7662D3990a52C8FC8Fc',
        poolUnderlyingToken: {
          address: '0x50dc34a634F3E29CfBad79E9cECD2759a6bA8Eae',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.ArfCreditPool1,
        poolType: POOL_TYPE.CreditLine,
        industry: 'Remittance Financing',
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x788574e3Dd5aB0B9B77900E5b16A3dbEA03c6A9F',
          abi: HDT_ABI,
        },
      },
      [POOL_NAME.ImpactMarket]: {
        chainId: ChainEnum.Alfajores,
        poolVersion: 'v1',
        basePoolConfig: '0x9e62ad0d0354047a469135724683ba71c154122e',
        pool: '0x490d2c453c6bbb30cc93445e1eb0d334023e30ae',
        poolFeeManager: '0xbF8B9F511533C8cc4bcAf1B27E9f8CF2b1e1cdD5',
        poolUnderlyingToken: {
          address: '0x50dc34a634F3E29CfBad79E9cECD2759a6bA8Eae',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.ImpactMarket,
        poolType: POOL_TYPE.CreditLine,
        industry: 'Invoice Factoring',
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x3C32C5bFFD080E579ae58599E72F43a5b7978Fb1',
          abi: HDT_ABI,
        },
        extra: {
          borrower: '0xf069014c47387FB0265E66FE637118b11f59958d',
          disableBorrow: true,
        },
      },
      [POOL_NAME.HumaCreditLine]: {
        chainId: ChainEnum.Alfajores,
        poolVersion: 'v1',
        basePoolConfig: '0x0bb39a0136643d60244070619e2e8ecbddf038ae',
        pool: '0xB6958E6852E1dA4C2468d8c0286884C68519282a',
        poolFeeManager: '0xd6fB372Da1c157Ca769dd1bD33D3e59D1B8376d0',
        poolUnderlyingToken: {
          address: '0x5F9E8b946472C9bA78491a4AbeA9d3BAccfB28E5',
          symbol: 'USDC',
          decimals: 18,
          icon: 'USDC',
        },
        poolName: POOL_NAME.HumaCreditLine,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x25BB64Ee818fFb2ee04c18D829a3754bDbfb4802',
          abi: HDT_ABI,
        },
      },
    },
  },
  [ChainEnum.Celo]: {
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.ImpactMarket]: {
        chainId: ChainEnum.Celo,
        poolVersion: 'v1',
        basePoolConfig: '0x822ed8a0c1083154ceab6f012f978d12375b8738',
        pool: '0x0aa111db73274c7b1b155dbb9522e927b7747ade',
        poolFeeManager: '0x7Ec6d7219D61d1B7FFD35938C9a84F4d7D33d966',
        poolUnderlyingToken: {
          address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
          symbol: 'cUSD',
          decimals: 18,
          icon: 'Celo',
        },
        poolName: POOL_NAME.ImpactMarket,
        poolType: POOL_TYPE.CreditLine,
        industry: 'Invoice Factoring',
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x88cBF77E0FD6BD18d8225E51F45E35105C0C794e',
          abi: HDT_ABI,
        },
        extra: {
          disableBorrow: true,
          detailsPage: true,
          borrower: '0x10FB65dc26a7aCC7CFB4eA3b6E007c8C77591486',
          rwrUploader: '0x4c6388346f2a3af2d64461339a5cdd3a3d63ccf5',
        },
      },
      [POOL_NAME.ArfCreditPool1]: {
        chainId: ChainEnum.Celo,
        poolVersion: 'v1',
        basePoolConfig: '0x388525cE9fC784A657c73Fb5d70FBc1fa5a53d31',
        pool: '0xc88BD9aa20d6353B43e7d159b67546eD5b7A1808',
        poolFeeManager: '0x5D762498a60a302FBD85A9c1FF2e65B67baBabc6',
        poolUnderlyingToken: {
          address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
          symbol: 'cUSD',
          decimals: 18,
          icon: 'Celo',
        },
        poolName: POOL_NAME.ArfCreditPool1,
        poolType: POOL_TYPE.CreditLine,
        industry: 'Remittance Financing',
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0xFf518eb9B4328d37e28C61AAe74079cD4cC7058A',
          abi: HDT_ABI,
        },
        extra: {
          borrower: '0xea57a8a51377752ffddaa3db4d13ce8f97677f2d',
          rwrUploader: '0xea57a8a51377752ffddaa3db4d13ce8f97677f2d',
          disableBorrow: true,
          detailsPage: true,
        },
      },
      [POOL_NAME.ArfPoolUSDC]: {
        chainId: ChainEnum.Celo,
        poolVersion: 'v1',
        basePoolConfig: '0x3118F75F5fE1E1e35393bA830d75ff117CF68c3d',
        pool: '0x5a08F38aF4d6e0E727D1DCF8242243D88488Bc47',
        poolFeeManager: '0xDB626Ca15F4f813e973E734F158fA8867C9ED145',
        poolUnderlyingToken: {
          address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.ArfPoolUSDC,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x2aD929360C4eDFC0cf1eC98FC483AfDa2223250C',
          abi: HDT_ABI,
        },
        extra: {
          borrower: '0xea57a8a51377752ffddaa3db4d13ce8f97677f2d',
          rwrUploader: '0xea57a8a51377752ffddaa3db4d13ce8f97677f2d',
          disableBorrow: true,
        },
      },
      [POOL_NAME.Jia]: {
        chainId: ChainEnum.Celo,
        poolVersion: 'v1',
        basePoolConfig: '0x75be4c971c730e197cae5e643e0f05ce7b4a58fe',
        pool: '0xa190A0ab76F58b491Cc36205B268e8cF5650c576',
        poolFeeManager: '0x0c092Bb9d5bc8DEA9d98FFda84E943816AD6E710',
        poolUnderlyingToken: {
          address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
          symbol: 'cUSD',
          decimals: 18,
          icon: 'Celo',
        },
        poolName: POOL_NAME.Jia,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x3Ce8221DBd48122de424e49F649D7A57EF722439',
          abi: HDT_ABI,
        },
        extra: {
          disableBorrow: true,
          detailsPage: true,
          borrower: '0xD3CCe1eC5a3981B27bD998f33A7eafdD27Ad2dF4',
        },
      },
      [POOL_NAME.JiaUSDC]: {
        chainId: ChainEnum.Celo,
        poolVersion: 'v1',
        basePoolConfig: '0xC4531A189b0181a3e16b76Ac9bb4b41476fe5De0',
        pool: '0xE743d0Dd33040437fc8C9A4dA1e60a9c5cD7597d',
        poolFeeManager: '0x8aFB2f658602A86e047BBf36A36AC98C69948d7e',
        poolUnderlyingToken: {
          address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.JiaUSDC,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x340bD00d3B6ffE1f3D9eE8A297d653C6f774f9c0',
          abi: HDT_ABI,
        },
        extra: {
          disableBorrow: true,
          detailsPage: true,
          borrower: '0xD3CCe1eC5a3981B27bD998f33A7eafdD27Ad2dF4',
          hidden: true,
        },
      },
      [POOL_NAME.Quipu]: {
        chainId: ChainEnum.Celo,
        poolVersion: 'v1',
        basePoolConfig: '0x8b0a09032cd485321f640dc1e9cbdeb2b16d41ab',
        pool: '0xaf2e8cfabf419be03a3bfe732f7f29037b0d1fa5',
        poolFeeManager: '0x58806a6F90764eb31fc002A68947fA4825FF9f2D',
        poolUnderlyingToken: {
          address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
          symbol: 'cUSD',
          decimals: 18,
          icon: 'Celo',
        },
        poolName: POOL_NAME.Quipu,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x42B396894229961407a24664A344c6A3AfDB3131',
          abi: HDT_ABI,
        },
        extra: {
          hidden: true,
          borrower: '0xF2278F9F36f69c85E0F40673186fA281AC7CDD2E',
        },
      },
    },
  },
  [ChainEnum.Mumbai]: {
    [POOL_TYPE.Stream]: {
      [POOL_NAME.Superfluid]: {
        chainId: ChainEnum.Mumbai,
        poolVersion: 'v1',
        basePoolConfig: '0xf80AD89c7820d2f933c35370cccfA7B6Cc2c93aa',
        pool: '0xC08AC7Ba5E8633ac6398C317dF1CEBED3A313c8A',
        poolProcessor: '0xb78C28a48eE7E7BdBc93E9Fea2862DB595Bd10a3',
        poolFeeManager: '0xBF40B58c7E8f4ca87362A49c135D6be9Ca4a8b2a',
        poolUnderlyingToken: {
          address: '0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2',
          symbol: 'USDC',
          decimals: 18,
          icon: 'USDC',
        },
        assetAddress: '0xAEA5908A082F5667aEA425AEACE8dF6aEDb03694',
        poolName: POOL_NAME.Superfluid,
        poolType: POOL_TYPE.Stream,
        industry: 'Invoice Factoring',
        poolAbi: STEAM_FACTORING_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        poolAssetAbi: TRADABLE_STREAM_ABI,
        HDT: {
          address: '0xa7cd9aEA02EE65Fce9F2e3fa079F9AC6a50EE282',
          abi: HDT_ABI,
        },
        extra: {
          subgraph:
            'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai',
          superToken: {
            id: '0x42bb40bf79730451b11f6de1cba222f17b87afd7',
            symbol: 'fUSDCx',
            decimals: 18,
          },
        },
      },
    },
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.Raincards]: {
        chainId: ChainEnum.Mumbai,
        poolVersion: 'v1',
        basePoolConfig: '0x10b7CBe54178eB6C81b2D84Ac073747BcA744F6C',
        pool: '0xf8065dA82cC990325059c436939c6a90C322E9Dd',
        poolFeeManager: '0x87534B96FD15EbD6Aa0456F45045B541e5E8889a',
        poolUnderlyingToken: {
          address: '0xb961c37ABDDA55929327fa9d20eBDE6BB8B1348E',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.Raincards,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x8Ec8f8AFE179032e2929C49eF4f8Ea2d18245B9a',
          abi: HDT_ABI,
        },
      },
      [POOL_NAME.ArfCreditPool1]: {
        chainId: ChainEnum.Mumbai,
        poolVersion: 'v1',
        basePoolConfig: '0xc7E7d40F2D2B8E93E53727ECBec0Bf5683AFb7C4',
        pool: '0x51d996A8B0956F532663eB4fEe5fEC5a6eE81c63',
        poolFeeManager: '0xDe39F0a6Fb305e4B2D4a7621d7e55e783121870B',
        poolUnderlyingToken: {
          address: '0xcFcaac79a9c4C9B8919d20b9d7214EF7Bd9A6e8F',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.ArfCreditPool1,
        poolType: POOL_TYPE.CreditLine,
        industry: 'Remittance Financing',
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0xd5DC108eDC7dFE5f2811Da5ffAed914C99aCBAe8',
          abi: HDT_ABI,
        },
      },
    },
  },
}

export enum SupplementaryContracts {
  MultiSend = 'MultiSend',
  RealWorldReceivable = 'RealWorldReceivable',
  ERC20TransferableReceivable = 'ERC20TransferableReceivable',
  TestUSDC = 'TestUSDC',
}

export const SupplementaryContractsMap: {
  [chainId: number]: {
    [contractName in SupplementaryContracts]?: string
  }
} = {
  [ChainEnum.Polygon]: {
    [SupplementaryContracts.MultiSend]:
      '0xDa21D2Be30353EC6Aa5AcD37999806cCefaa4C6A',
    [SupplementaryContracts.RealWorldReceivable]:
      '0xCf67CcEaC38b5E1880d62b5DB531Ab1E77614E3D',
  },
  [ChainEnum.Mumbai]: {
    [SupplementaryContracts.MultiSend]:
      '0x7DeabC1F7E47eD5Cf23Fa4390C48D6ab8543eE82',
    [SupplementaryContracts.RealWorldReceivable]:
      '0xcCE0Ff2017eFC86EF49f165D895E2A19FfBA3A1a',
    [SupplementaryContracts.TestUSDC]:
      '0xcFcaac79a9c4C9B8919d20b9d7214EF7Bd9A6e8F',
  },
  [ChainEnum.Alfajores]: {
    [SupplementaryContracts.RealWorldReceivable]:
      '0xDc908153Deb70f23ef54C015F622D6E7E6F96E55',
    [SupplementaryContracts.TestUSDC]:
      '0x50dc34a634f3e29cfbad79e9cecd2759a6ba8eae',
  },
  [ChainEnum.Celo]: {
    [SupplementaryContracts.RealWorldReceivable]:
      '0xfc256098C6c63836ac71F7057c68b74165fF9cbb',
  },
}

export function getPoolInfo(
  chainId: number | undefined,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): PoolInfoType | undefined {
  if (!chainId) {
    return undefined
  }
  return PoolContractMap[chainId]?.[poolType]?.[poolName]
}

export function usePools(
  chainId: number | undefined,
): Array<{ poolName: POOL_NAME; poolType: POOL_TYPE }> {
  if (chainId === undefined) {
    chainId = configUtil.DEFAULT_CHAIN_ID
  }

  const chainPools = PoolContractMap[chainId] || {}
  const pools: Array<{
    poolName: POOL_NAME
    poolType: POOL_TYPE
    order: number
  }> = []
  Object.values(POOL_TYPE).forEach((poolType: POOL_TYPE) => {
    const poolConfig = chainPools[poolType]
    if (poolConfig) {
      Object.keys(poolConfig).forEach((poolName) => {
        const enumPoolName = poolName as POOL_NAME
        pools.push({
          poolName: enumPoolName,
          poolType,
          order: poolConfig[enumPoolName]?.extra?.order ?? 0,
        })
      })
    }
  })

  const poolOrderingCompare = (
    poolA: { poolName: POOL_NAME; order: number },
    poolB: { poolName: POOL_NAME; order: number },
  ): number => poolB.order - poolA.order

  pools.sort(poolOrderingCompare)

  return pools.map((pool) => ({
    poolName: pool.poolName,
    poolType: pool.poolType,
  }))
}

export function getPoolInfoForPoolAddress(
  chainId: ChainEnum,
  poolAddress: string,
): PoolInfoType | null {
  let foundPoolInfo = null

  Object.values(POOL_TYPE).find((poolType: POOL_TYPE) => {
    const poolsByType = PoolContractMap[chainId][poolType]
    if (poolsByType) {
      const foundPool = Object.values(poolsByType).find((poolInfo) => {
        if (poolInfo?.pool.toLowerCase() === poolAddress.toLowerCase()) {
          foundPoolInfo = poolInfo
          return true
        }

        return false
      })

      if (foundPool) {
        return true
      }
    }

    return false
  })

  return foundPoolInfo
}

export function isPoolName(
  poolName: string | undefined,
): poolName is POOL_NAME {
  return Object.keys(POOL_NAME).includes(String(poolName))
}
