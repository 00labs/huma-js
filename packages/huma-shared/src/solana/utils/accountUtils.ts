import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { SolanaChainEnum } from '../chain'
import { Huma as HumaProgram } from '../idl/huma'
import HumaIDL from '../idl/huma.json'

export const getHumaConfigAccountInfo = async (
  _chainId: SolanaChainEnum,
  connection: Connection,
) => {
  // @ts-ignore
  const provider = new AnchorProvider(connection, null)
  const humaProgram = new Program<HumaProgram>(HumaIDL as HumaProgram, provider)

  const humaConfigAccountResult = await humaProgram.account.humaConfig.fetch(
    new PublicKey('F2it2fBcdjeX9KCaEAWcQ1H8LnMB2zPn3nrPpHc7J8vL'),
  )

  console.log('humaConfigAccountResult', humaConfigAccountResult)
}
