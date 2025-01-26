import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
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
    'https://api.devnet.solana.com',
    'confirmed',
  )

  const keypair = web3.Keypair.fromSecretKey(
    Buffer.from(JSON.parse(TEST_PRIVATE_KEY)),
  )
  const wallet = new Wallet(keypair)
  setProvider(new AnchorProvider(connection, wallet))

  const solanaHumaContext = new HumaSolanaContext({
    publicKey: new PublicKey('4PxkeCBfCCPYWMgV2g9URsMqkp3VR1S5ABuB1ZbrRpVz'),
    connection: connection,
    chainId: SolanaChainEnum.SolanaDevnet,
    poolName: POOL_NAME.ArfCreditPool3Months,
  })

  const humaSolanaProgramHelper = new HumaSolanaProgramHelper({
    solanaContext: solanaHumaContext,
  })

  const data = await humaSolanaProgramHelper.getAvailableCreditForPool()

  console.log(data)
}

main()
