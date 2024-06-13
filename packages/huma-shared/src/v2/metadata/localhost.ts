import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const LOCALHOST_METADATA: PoolsInfoV2 = {
  HumaCreditLine: {
    chainId: ChainEnum.Localhost,
    poolVersion: 'v2',
    industry: 'Supply Chain Financing',
    poolName: POOL_NAME.HumaCreditLine,
    poolType: POOL_TYPE.CreditLine,
    pool: '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
    poolConfig: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    poolCredit: '0x67d269191c92Caf3cD7723F116c85e6E9bf55933',
    poolCreditManager: '0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690',
    poolSafe: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
    seniorTrancheVault: '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f',
    juniorTrancheVault: '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F',
    epochManager: '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x9A676e781A523b5d0C0e43731313A708CB607508',
      [FirstLossCoverIndex.admin]: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'V2 Credit Line Testing Pool',
    desc: 'V2 Credit Line Testing Pool',
  },
  ReceivableBackedCreditLine: {
    chainId: ChainEnum.Localhost,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ReceivableBackedCreditLine,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25',
    poolConfig: '0x21dF544947ba3E8b3c32561399E88B52Dc8b2823',
    poolCredit: '0x7A9Ec1d04904907De0ED7b6839CcdD59c3716AC9',
    poolCreditManager: '0x4631BCAbD6dF18D94796344963cB60d44a4136b6',
    poolSafe: '0x51A1ceB83B83F1985a81C295d1fF28Afef186E02',
    seniorTrancheVault: '0x46b142DD1E924FAb83eCc3c08e4D46E82f005e0E',
    juniorTrancheVault: '0x1c85638e118b37167e9298c2268758e058DdfDA0',
    epochManager: '0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7',
      [FirstLossCoverIndex.admin]: '0x202CCe504e04bEd6fC0521238dDf04Bc9E8E15aB',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'V2 Receivable Backed Credit Line Testing Pool',
    desc: 'V2 Receivable Backed Credit Line Testing Pool',
  },
}
