import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const HUMA_TESTNET_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.HumaTestnet,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44',
    poolConfig: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    poolCredit: '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB',
    poolCreditManager: '0x851356ae760d987E095750cCeb3bC6014560891C',
    poolSafe: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
    seniorTrancheVault: '0x09635F643e140090A9A8Dcd712eD6285858ceBef',
    juniorTrancheVault: '0x67d269191c92Caf3cD7723F116c85e6E9bf55933',
    epochManager: '0x4A679253410272dd5232B3Ff7cF5dbB88f295319',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
      [FirstLossCoverIndex.affiliate]:
        '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Jia V2 Testing Pool',
    desc: 'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
    supplyLink: 'https://app.huma.finance',
  },
  ArfCreditPoolV2: {
    chainId: ChainEnum.HumaTestnet,
    poolVersion: 'v2',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb',
    poolConfig: '0x0355B7B8cb128fA5692729Ab3AAa199C1753f726',
    poolCredit: '0x5c74c94173F05dA1720953407cbb920F3DF9f887',
    poolCreditManager: '0x18E317A7D70d8fBf8e6E893616b52390EbBdb629',
    poolSafe: '0x4EE6eCAD1c2Dae9f525404De8555724e3c35d07B',
    seniorTrancheVault: '0x4631BCAbD6dF18D94796344963cB60d44a4136b6',
    juniorTrancheVault: '0xA4899D35897033b927acFCf422bc745916139776',
    epochManager: '0x7A9Ec1d04904907De0ED7b6839CcdD59c3716AC9',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xD84379CEae14AA33C123Af12424A37803F885889',
      [FirstLossCoverIndex.affiliate]:
        '0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://app.huma.finance',
  },
}
