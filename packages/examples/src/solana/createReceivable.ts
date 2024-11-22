import { Connection, Keypair, sendAndConfirmTransaction } from '@solana/web3.js'
import {
  AnchorProvider,
  BN,
  setProvider,
  Wallet,
  web3,
} from '@coral-xyz/anchor'
import { POOL_NAME, SolanaChainEnum } from '@huma-finance/shared'
import {
  HumaSolanaContext,
  HumaSolanaReceivableHelper,
} from '@huma-finance/sdk'

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
    publicKey: wallet.publicKey,
    connection: connection,
    chainId: SolanaChainEnum.SolanaDevnet,
    poolName: POOL_NAME.ArfCreditPool3Months,
  })

  const humaReceivableHelper = new HumaSolanaReceivableHelper({
    solanaContext: solanaHumaContext,
  })

  const newAsset = Keypair.generate()

  const oneWeekFromNow = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
  const tx = await humaReceivableHelper.buildCreateReceivableTransaction(
    newAsset,
    {
      name: 'Test Receivable',
      uri: 'https://test.com',
      currencyCode: '840',
      receivableAmount: new BN(100),
      maturityDate: new BN(oneWeekFromNow),
      referenceId: 'test-reference-id6',
    },
  )

  console.log(tx)

  const txResult = await sendAndConfirmTransaction(
    connection,
    tx,
    [newAsset, keypair],
    {
      preflightCommitment: 'confirmed',
    },
  )

  console.log(txResult)
}

main()
