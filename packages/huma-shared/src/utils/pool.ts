import BASE_CREDIT_POOL_ABI from '../abis/BaseCreditPool.json'
import BASE_POOL_CONFIG_ABI from '../abis/BasePoolConfig.json'
import HDT_ABI from '../abis/HDT.json'
import RECEIVABLE_FACTORING_POOL_ABI from '../abis/ReceivableFactoringPool.json'
import STEAM_FACTORING_POOL_ABI from '../abis/StreamFactoringPool.json'
import TRADABLE_STREAM_ABI from '../abis/TradableStream.json'
import { ChainEnum } from './chain'
import { configUtil } from './config'

export enum POOL_NAME {
  RequestNetwork = 'RequestNetwork',
  HumaCreditLine = 'HumaCreditLine',
  Superfluid = 'Superfluid',
  Jia = 'Jia',
  JiaV2 = 'JiaV2',
  ArfCreditPool1 = 'ArfCreditPool1',
  ArfCreditPoolV2 = 'ArfCreditPoolV2',
  ArfUSDCMigrationTest = 'ArfUSDCMigrationTest',
  BSOS = 'BSOS',
  ImpactMarket = 'ImpactMarket',
  Symplifi = 'Symplifi',
}

export enum POOL_TYPE {
  Invoice = 'Invoice',
  CreditLine = 'CreditLine',
  Stream = 'Stream',
  ReceivableBacked = 'ReceivableBacked',
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
    superTokens?: { id: string; symbol: string; decimals: number }[]
    borrower?: string // For single borrower pools
    rwrUploader?: string // For single borrower pools where receivables are uploaded by a different wallet
    hidden?: boolean // For pools that shouldn't be displayed in the UI
    order?: number // Ordering in the pool list. Null values are sorted last.
    disableBorrow?: boolean
    lenderApprovalProvider?: LenderApprovalProvider
    detailsPage?: boolean
  }
}

export type PoolInfo = {
  chainId: ChainEnum
} & PoolInfoType

export type PoolSubgraphMapType = {
  [chainId: number]: {
    subgraph: string
    receivablesSubgraph?: string
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
    [POOL_NAME.ArfCreditPool1]: {
      name: 'Arf Credit Line Pool',
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
    [POOL_NAME.Symplifi]: {
      name: 'Symplifi Pool',
      borrowDesc:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      lendDesc:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      estAPY: '20%',
    },
  },
  [POOL_TYPE.Invoice]: {
    [POOL_NAME.RequestNetwork]: {
      name: 'Request Network',
      borrowDesc:
        'Invoice factoring for your crypto invoices, up to 80% of their value. Only available to select invoicing platforms.',
      lendDesc:
        'Earn active yield by participating in this crypto invoice factoring market where loans are backed by collateralized invoice NFTs and paid back automatically when the invoice is paid.',
    },
  },
  [POOL_TYPE.Stream]: {
    [POOL_NAME.Superfluid]: {
      name: 'Superfluid',
      borrowDesc:
        'Stream factoring for your crypto streams, up to 100% of their value. Only available to select streaming platforms.',
      lendDesc:
        'Earn active yield by participating in this crypto stream factoring market where loans are backed by collateralized streaming assets and paid back automatically every moment.',
    },
  },
  [POOL_TYPE.ReceivableBacked]: {},
}

export const PoolSubgraphMap: PoolSubgraphMapType = {
  [ChainEnum.Polygon]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-polygon',
    receivablesSubgraph:
      'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-polygon',
  },
  [ChainEnum.Goerli]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-goerli',
    receivablesSubgraph:
      'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-goerli',
  },
  [ChainEnum.Mumbai]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-mumbai-v2',
    receivablesSubgraph:
      'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-mumbai',
  },
  [ChainEnum.Celo]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-celo',
    receivablesSubgraph:
      'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-celo',
  },
  [ChainEnum.Alfajores]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-alfajores',
    receivablesSubgraph:
      'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-alfajores',
  },
  [ChainEnum.Localhost]: {
    subgraph: 'http://localhost:8000/subgraphs/name/huma-localhost',
    receivablesSubgraph: 'http://localhost:8000/subgraphs/name/huma-localhost',
  },
  [ChainEnum.HumaTestnet]: {
    subgraph:
      'https://integration.v2.huma.finance:8000/subgraphs/name/huma-localhost',
    receivablesSubgraph:
      'https://integration.v2.huma.finance:8000/subgraphs/name/huma-localhost',
  },
}

export const PoolContractMap: PoolContractMapType = {
  [ChainEnum.Polygon]: {
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.HumaCreditLine]: {
        chainId: ChainEnum.Polygon,
        poolVersion: 'v1',
        basePoolConfig: '0x39f7D6040EC30B62c508723e2EDb822413837527',
        pool: '0xAb3dc5221F373Dd879BEc070058c775A0f6Af759',
        poolFeeManager: '0x65C5535735581039c5711A9d7c223cff9384334F',
        poolUnderlyingToken: {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.HumaCreditLine,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x73c16Db24951135BC8A628185BdbfA79115793E5',
          abi: HDT_ABI,
        },
        extra: { hidden: true },
      },
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
    },
    [POOL_TYPE.Invoice]: {
      [POOL_NAME.RequestNetwork]: {
        chainId: ChainEnum.Polygon,
        poolVersion: 'v1',
        basePoolConfig: '0x98f41d57C06b302AFf999f3F58f4ae7a3F884590',
        pool: '0x58AAF1f9cB10F335111A2129273056bbED251B61',
        poolFeeManager: '0x5B7841b94a3C7246662ef514745b034A6ceaAB15',
        poolUnderlyingToken: {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        assetAddress: '0xA9930c8e4638D9a96a3B73e7ABe73a636F986323',
        poolName: POOL_NAME.RequestNetwork,
        poolType: POOL_TYPE.Invoice,
        industry: 'Invoice Factoring',
        poolAbi: RECEIVABLE_FACTORING_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0xf5F9297c74e464933e42F4a989e81D931fb20f83',
          abi: HDT_ABI,
        },
        extra: {
          hidden: true,
        },
      },
    },
  },
  [ChainEnum.Goerli]: {
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.HumaCreditLine]: {
        chainId: ChainEnum.Goerli,
        poolVersion: 'v1',
        basePoolConfig: '0x0d7bae0e14aF194e52Ea2472737b24044fe6e929',
        pool: '0xA22D20FB0c9980fb96A9B0B5679C061aeAf5dDE4',
        poolFeeManager: '0x673b3C1094AE941bb4b2eF9377DaFE3bcCc4b003',
        poolUnderlyingToken: {
          address: '0xf17FF940864351631b1be3ac03702dEA085ba51c',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.HumaCreditLine,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x61341186E8C3B7cC0De66ae86C65943797C8Fb99',
          abi: HDT_ABI,
        },
        extra: {
          lenderApprovalProvider: {
            type: 'KYC',
            provider: 'Securitize',
          },
          detailsPage: true,
        },
      },
    },
    [POOL_TYPE.Invoice]: {
      [POOL_NAME.RequestNetwork]: {
        chainId: ChainEnum.Goerli,
        poolVersion: 'v1',
        basePoolConfig: '0xBa779F41ae414dEc63265D79a02DED47fbe007a5',
        pool: '0x11672c0bBFF498c72BC2200f42461c0414855042',
        poolFeeManager: '0x7BA6B8eBC9b09c228582814D44D4a0F2B6B0B9E4',
        poolUnderlyingToken: {
          address: '0xf17FF940864351631b1be3ac03702dEA085ba51c',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        assetAddress: '0xC2AC172a293d68f548ea343414584aA37eb29Dcd',
        poolName: POOL_NAME.RequestNetwork,
        poolType: POOL_TYPE.Invoice,
        industry: 'Invoice Factoring',
        poolAbi: RECEIVABLE_FACTORING_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x27Fa332a5cA06492C2007FF4b143C921Cf779C3b',
          abi: HDT_ABI,
        },
        extra: {
          hidden: true,
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
          disableBorrow: true,
          detailsPage: true,
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
          superTokens: [
            {
              id: '0x42bb40bf79730451b11f6de1cba222f17b87afd7',
              symbol: 'fUSDCx',
              decimals: 18,
            },
          ],
          hidden: true,
        },
      },
    },
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.ArfUSDCMigrationTest]: {
        chainId: ChainEnum.Mumbai,
        poolVersion: 'v1',
        basePoolConfig: '0xe8338a5e3e58b425249f82594c82b42c2df4c5e9',
        pool: '0xbb1b50e1ec5835b3c58944e820e7a5e136141ddc',
        poolFeeManager: '0x9f667f613C16542aC8b1e502F4D796774F623D86',
        poolUnderlyingToken: {
          address: '0x9999f7fea5938fd3b1e26a12c3f2fb024e194f97',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.ArfUSDCMigrationTest,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x8bce02521622222Ee13D1Ce2c5E4CCab52ce24Bb',
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
      [POOL_NAME.Symplifi]: {
        chainId: ChainEnum.Mumbai,
        poolVersion: 'v1',
        basePoolConfig: '0x60de6e6727be2cfd0733d790528d7e4ce4049277',
        pool: '0xCCa17BB13C94E19bAd67a59687D22A68aEe9d7e7',
        poolFeeManager: '0x4CD872604DA256c752C52541B190E3E482Fd0819',
        poolUnderlyingToken: {
          address: '0xb961c37ABDDA55929327fa9d20eBDE6BB8B1348E',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.Symplifi,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x58174E6989AfB9e265b3bB1C981B18096C13D83D',
          abi: HDT_ABI,
        },
        extra: {
          borrower: '0x71a4E7F3A2c67BDBa6Ec9F864A830c255A4bF123',
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
    [SupplementaryContracts.RealWorldReceivable]:
      '0xCf67CcEaC38b5E1880d62b5DB531Ab1E77614E3D',
  },
  [ChainEnum.Goerli]: {
    [SupplementaryContracts.MultiSend]:
      '0x11ED387Fa673852Ba47F96Aa9BEdE37F12De2998',
    [SupplementaryContracts.RealWorldReceivable]:
      '0xA1EB18643dd6b75e97D55583BFFfF2311124076f',
    [SupplementaryContracts.ERC20TransferableReceivable]:
      '0xC2AC172a293d68f548ea343414584aA37eb29Dcd',
    [SupplementaryContracts.TestUSDC]:
      '0xf17FF940864351631b1be3ac03702dEA085ba51c',
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
