import { BigNumber, Wallet, ethers } from "ethers";
import {
  approvePoolAllowance,
  drawdownFromPool,
  getERC20Contract,
  getPoolContract,
  getPoolInfo,
  makePaymentToPool,
} from "@huma-finance/sdk";
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

  const poolInfo = getPoolInfo(
    ChainEnum.Goerli,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine
  );
  const poolTokenContract = getERC20Contract(
    poolInfo?.poolUnderlyingToken.address,
    wallet
  );
  const poolContract = getPoolContract(
    wallet,
    ChainEnum.Goerli,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine
  );

  // We recommend approving a bulk amount of tokens to the pool contract
  // in order to save on gas fees. The SDK will approve the exact amount
  // required when calling makePaymentToPool otherwise.
  const approveAllowanceTx = await approvePoolAllowance(
    wallet,
    ChainEnum.Goerli,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine,
    0
  );
  const approvalReceipt = await approveAllowanceTx.wait();
  console.log(`Approve tx: ${approvalReceipt.transactionHash}`);
  let allowance = await poolTokenContract.allowance(
    wallet.address,
    poolContract.address
  );
  console.log(`Resetting allowance to ${allowance.toString()}`);

  // Drawdown
  const drawdownTx = await drawdownFromPool(
    wallet,
    ChainEnum.Goerli,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine,
    BigNumber.from("10000000")
  );
  const drawdownReceipt = await drawdownTx.wait();
  console.log(`Drawdown tx: ${drawdownReceipt.transactionHash}`);

  // Payback
  const paybackTx = await makePaymentToPool(
    wallet,
    ChainEnum.Goerli,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine,
    BigNumber.from("10000000")
  );
  const paybackReceipt = await paybackTx.wait();
  console.log(`Payback tx: ${paybackReceipt.transactionHash}`);
}
main();
