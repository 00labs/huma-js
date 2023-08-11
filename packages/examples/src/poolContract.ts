import { Wallet, ethers } from "ethers";
import { getPoolContract, getTotalDue } from "@huma-finance/sdk";
import { ChainEnum, POOL_NAME, POOL_TYPE } from "@huma-finance/shared";
require("dotenv").config();

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
    {
      name: "Goerli",
      chainId: ChainEnum.Goerli,
    }
  );

  const wallet = new Wallet(TEST_PRIVATE_KEY, provider);

  const poolContract = getPoolContract(
    wallet,
    ChainEnum.Goerli,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine
  );

  // Read or call any function off the contract
  const data = await poolContract.creditRecordMapping(wallet.address);
  console.log(data);

  const totalDue = await getTotalDue(
    wallet.address,
    wallet,
    ChainEnum.Goerli,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine
  );
  console.log("Total due: " + totalDue.toString());
}
main();
