import { SolanaChainEnum } from '../../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../../utils/pool'
import { SolanaChainInfo, SolanaPoolsInfo } from '../../utils'

export const SOLANA_DEVNET_INFO: SolanaChainInfo = {
  sentinel: '8GQMZVEvYsssewqu2EvoAtVeBMWEkns7vGiUMQ6V7KDo',
}

export const SOLANA_DEVNET_METADATA: SolanaPoolsInfo = {
  HumaCreditLine: {
    title: 'Test Creditline Pool',
    poolName: POOL_NAME.HumaCreditLine,
    poolType: POOL_TYPE.CreditLine,
    chainId: SolanaChainEnum.SolanaDevnet,
    industry: 'Remittance Financing',
    desc: 'This is a test pool for Huma creditline on Solana',
    pool: '6VsBVe7dhKyEGoihwUtGwU9MeS6suKDSuZEMC4LHZyka',
    poolId: 'C6RwLt8ByHX4bT6arBg6kvCemZdCWhQTc6Qia3BXDFMU',
    poolConfig: '2JWWfRh9zeqqL1etwx6tYpXaug7oS1SGaKeg8odz2AU3',
    poolState: '4E1soDme3RGFnEDzb1npDQY33T9auCJDmZY7RxeBAdTx',
    juniorTrancheMint: '6PhLVQ3WLZ8n1K1QdGCLojxH7SFk48rXhAofYUFZZ8aq',
    seniorTrancheMint: 'HFpg8Vqranm6rwvFwzDPCyH6nyQjUkRq8Nk9BpuRKXBQ',
    underlyingMint: {
      address: 'BuobkQeuoRmR8RSs4W1ooKvj4QpiVoXfiudcGqNE6zk7',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
  },
}
