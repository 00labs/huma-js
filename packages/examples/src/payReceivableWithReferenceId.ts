import { Wallet, ethers } from 'ethers'
import { ReceivableService } from '@huma-finance/sdk'
import { ChainEnum } from '@huma-finance/shared'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.VITE_ALCHEMY_API_KEY}`,
    {
      name: 'Mumbai',
      chainId: ChainEnum.Mumbai,
    },
  )
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     `https://goerli.infura.io/v3/${process.env.VITE_INFURA_API_KEY}`,
  //     {
  //       name: "Goerli",
  //       chainId: ChainEnum.Goerli,
  //     }
  //   );

  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const data = await ReceivableService.declareReceivablePaymentByReferenceId(
    wallet,
    '12345',
    10, // paymentAmount
  )
  const tx = await data.wait()
  console.log(`Success. Tx hash: ${tx.transactionHash}`)
}

main()
