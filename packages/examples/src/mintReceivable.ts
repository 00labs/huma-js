import { Wallet, ethers } from "ethers";
import { ReceivableService } from "@huma-finance/sdk";
import { ChainEnum, POOL_NAME, POOL_TYPE } from "@huma-finance/shared";
require("dotenv").config();

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
    {
      name: "Mumbai",
      chainId: ChainEnum.Mumbai,
    }
  );
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
  //     {
  //       name: "Goerli",
  //       chainId: ChainEnum.Goerli,
  //     }
  //   );

  const wallet = new Wallet(TEST_PRIVATE_KEY, provider);

  // Mint a receivable without metadata
  //   const tx = await ReceivableService.createReceivable(
  //     wallet,
  //     POOL_NAME.Superfluid,
  //     POOL_TYPE.Stream,
  //     840, // currencyCode for USD
  //     1000, // receivableAmount
  //     1684517656, // maturityDate
  //     ""
  //   );
  //   const data = await tx.wait();
  //   console.log(`Success. Tx hash: ${data.transactionHash}`);

  // Mint a receivable with metadata uploaded to ARWeave
  const tx = await ReceivableService.createReceivableWithMetadata(
    wallet,
    TEST_PRIVATE_KEY, // privateKey
    ChainEnum.Mumbai, // chainId
    POOL_NAME.Superfluid,
    POOL_TYPE.Stream,
    840, // currencyCode for USD
    1000, // receivableAmount
    1684517656, // maturityDate
    JSON.parse('{"test": "test"}'), // metadata
    "12345", // internalId
    [] // extraTags
  );
  const txResponse = await tx.wait();
  console.log(`Success. Tx hash: ${txResponse.transactionHash}`);
}

main();
