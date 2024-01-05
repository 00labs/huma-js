import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x670bd29Db78Cb1e80C339C6061D969a97a1412CF',
    poolCredit: '0xD8127E51Ba777F1153B0caF0e7f685A717aA1dCc',
    poolCreditManager: '0x936FBB4b24b76AB9F80278C50Ff6410A2664B3e8',
    poolConfig: '0x0A395b280fcB4a95e7c568d2Fc8329Cb3530B80D',
    poolSafe: '0x72977d89449BF57964D33968FEdaDd038A705e00',
    seniorTrancheVault: '0x3f9e60A1B9a6B0B23314D5861DcA88405E662128',
    juniorTrancheVault: '0xfc02995a9f6c1bb1383Cb8B9F69D3ADd0f736524',
    epochManager: '0xE53A68Fb7a8A4e115e044a66224750acf54F638f',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x048B50b463Af8ccCA0BE2b08149720739aD466eB',
      [FirstLossCoverIndex.affiliate]:
        '0x83EeFf2D39C1387C18E1B888A40B3Bf4a0E1C34C',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Jia V2 Testing Pool',
    desc: 'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
    supplyLink: 'https://app.huma.finance',
  },
  ArfCreditPoolV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0xc1aad5d015bC5906f92d46910eBb9919fcc7BFB5',
    poolConfig: '0xB1BDc89E4C2dC795d7d44D697E5d62E4fB1E5Ed7',
    poolCredit: '0x880eCAc83ae113af5f4C1b90705467d6A18fc8AD',
    poolCreditManager: '0xa85d4C33ef3728fC38E9281FCd08b0b88CEF1912',
    poolSafe: '0x53a3a2495fD279964398998eb8aaaA21B1289770',
    seniorTrancheVault: '0x57B0936B1CEe19642FBd659C8e417E084ffab8fF',
    juniorTrancheVault: '0x7d566A84AE84974d4812fEA760958E40ff91f7Da',
    epochManager: '0xf9eEB9c32d7822fF9111A75b330A6948B7A6818a',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x81aA17cC36BA98d61542F7D17Ea8a3a621Cc5666',
      [FirstLossCoverIndex.affiliate]:
        '0xa36c775a88E9A7c55B526EeefDcAFF7Bcca5aD1E',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://app.huma.finance',
  },
}
