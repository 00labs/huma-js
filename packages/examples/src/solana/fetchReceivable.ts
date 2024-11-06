import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, setProvider, Wallet, web3 } from '@coral-xyz/anchor'
import { POOL_NAME, SolanaChainEnum } from '@huma-finance/shared'
import {
  getReceivableReferenceData,
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
    poolName: POOL_NAME.HumaCreditLine,
  })

  const humaReceivableHelper = new HumaSolanaReceivableHelper({
    solanaContext: solanaHumaContext,
  })

  const owner = new PublicKey('owner public key')
  const referenceId = 'test-reference-id2'

  const res = await humaReceivableHelper.getReceivableInfo(referenceId, owner)

  console.log(res)

  const receivableReferenceData = await getReceivableReferenceData(
    SolanaChainEnum.SolanaDevnet,
    owner,
    connection,
    referenceId,
  )

  console.log(receivableReferenceData)
}

main()
