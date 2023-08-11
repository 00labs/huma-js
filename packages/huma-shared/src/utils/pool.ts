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
  ArfCreditPool1 = 'ArfCreditPool1',
  BSOS = 'BSOS',
}

export enum POOL_TYPE {
  Invoice = 'Invoice',
  CreditLine = 'CreditLine',
  Stream = 'Stream',
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

export type PoolInfoType = {
  basePoolConfig: string
  pool: string
  poolProcessor?: string
  poolFeeManager: string
  poolUnderlyingToken: {
    address: string
    symbol: string
    decimals: number
    icon: 'USDC'
  }
  assetAddress?: string
  poolName: POOL_NAME
  poolType: POOL_TYPE
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
    hidden?: boolean // For pools that shouldn't be displayed in the UI
    order?: number // Ordering in the pool list. Null values are sorted last.
    disableBorrow?: boolean
    lenderApprovalProvider?: LenderApprovalProvider
    detailsPage?: boolean
  }
}

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
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-mumbai',
    receivablesSubgraph:
      'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-mumbai',
  },
}

export const PoolContractMap: PoolContractMapType = {
  [ChainEnum.Polygon]: {
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.HumaCreditLine]: {
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
        basePoolConfig: '0x4AC443e87211B940C9e7c4c6801d24C34bD9f227',
        pool: '0x3EBc1f0644A69c565957EF7cEb5AEafE94Eb6FcE',
        poolFeeManager: '0x989F1194d637A928628a2d8204990E35d198b6D0',
        poolUnderlyingToken: {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          symbol: 'USDC',
          decimals: 6,
          icon: 'USDC',
        },
        poolName: POOL_NAME.ArfCreditPool1,
        poolType: POOL_TYPE.CreditLine,
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
  [ChainEnum.Mumbai]: {
    [POOL_TYPE.Stream]: {
      [POOL_NAME.Superfluid]: {
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
        },
      },
    },
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.ArfCreditPool1]: {
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
      '0x5F9E8b946472C9bA78491a4AbeA9d3BAccfB28E5',
    [SupplementaryContracts.TestUSDC]:
      '0xcFcaac79a9c4C9B8919d20b9d7214EF7Bd9A6e8F',
  },
}

export function getPoolInfo(
  chainId: number | undefined,
  poolType: POOL_TYPE,
  poolName: POOL_NAME,
): PoolInfoType | null {
  if (chainId === undefined) {
    chainId = configUtil.DEFAULT_CHAIN_ID
  }

  return PoolContractMap[chainId]?.[poolType]?.[poolName] ?? null
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
      const foundPool = Object.values(poolsByType).find(
        (poolInfo: PoolInfoType) => {
          if (poolInfo?.pool.toLowerCase() === poolAddress.toLowerCase()) {
            foundPoolInfo = poolInfo
            return true
          }

          return false
        },
      )

      if (foundPool) {
        return true
      }
    }

    return false
  })

  return foundPoolInfo
}
