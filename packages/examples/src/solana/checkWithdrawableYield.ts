import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import {
  AnchorProvider,
  BN,
  setProvider,
  Wallet,
  web3,
} from '@coral-xyz/anchor'
import { POOL_NAME, SolanaChainEnum } from '@huma-finance/shared'
import { HumaSolanaContext, HumaSolanaProgramHelper } from '@huma-finance/sdk'

require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const connection = new Connection(
    'https://api.mainnet-beta.solana.com',
    'confirmed',
  )

  const keypair = web3.Keypair.fromSecretKey(
    Buffer.from(JSON.parse(TEST_PRIVATE_KEY)),
  )
  const wallet = new Wallet(keypair)
  setProvider(new AnchorProvider(connection, wallet))

  const solanaHumaContext = new HumaSolanaContext({
    publicKey: new PublicKey('C8E8YuXRzdiswUxbyh8aampqBz9pmEscw57S5JM99Li8'),
    connection: connection,
    chainId: SolanaChainEnum.SolanaMainnet,
    poolName: POOL_NAME.ArfCreditPool6Months,
  })

  const humaSolanaProgramHelper = new HumaSolanaProgramHelper({
    solanaContext: solanaHumaContext,
  })

  const data = await humaSolanaProgramHelper.getWithdrawableYields()

  console.log(data)
}

main()
