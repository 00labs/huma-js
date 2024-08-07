# Getting Started

In this guide we'll take a look at using Huma's SDK to mint and pay a receivable, call functions on our pool, and more.

## Installation

Huma's SDK can be installed using npm or yarn.

```
npm install @huma-finance/sdk
yarn add @huma-finance/sdk
```

You'll also want to install Huma's shared utilities

```
npm install @huma-finance/core
yarn add @huma-finance/core
```

## Mint a Pool Receivable

Create a new file `index.js` and import services from `@huma-finance/sdk` and `@huma-finance/core`

```
import { ReceivableService, PaymentMethod } from '@huma-finance/sdk'
import { POOL_NAME, POOL_TYPE } from "@huma-finance/core";
```

Set up your ethers Provider and import your private key

```
const TEST_PRIVATE_KEY = "YOUR_PRIVATE_KEY";
const provider = new ethers.providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
    {
        name: "Goerli",
        chainId: 5,
    }
);
```

Call on the `mintReceivable` method with an ethers Wallet instance

> Note: Receivables support multiple payment methods. Declarative receivables
> don't actually transfer ERC20 tokens, they just update their balance on-chain.
> Payable receivables will actually call pool methods to transfer ERC20 tokens.

```
const wallet = new Wallet(TEST_PRIVATE_KEY, provider);
const tx = await ReceivableService.mintReceivable(
    wallet,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine,
    1000, // receivableAmount
    1684517656, // maturityDate
    PaymentMethod.Declarative, // paymentMethod
    ""
);
const data = await tx.wait();
console.log(`Success. Tx hash: ${data.transactionHash}`);
```

Running this in the console, we should see the following result

```
$ node index.js
{}
Success. Tx hash: 0xb789af3611bc01b6a90f002327500421abf575660be1bbb30013d52518260e41
```

Congrats! You've successfully minted your own receivable token, which are used to borrow from Huma's pools.

If you're stuck or want to view a complete solution, check out our `examples` directory (here)[https://github.com/00labs/huma-dapp/blob/develop/packages/examples/src/]

## Call functions from Huma's pool

We can use the Huma SDK to easily obtain ethers Contract instances of any Huma pool.

```
import { getPoolContract } from "@huma-finance/sdk";
import { POOL_NAME, POOL_TYPE } from "@huma-finance/core";
```

With a ethers provider, pass in some config options for which pool contract you'd like to fetch.

```
const poolContract = getPoolContract(
    wallet,
    5, // Goerli chain ID
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine
);
```

Now you can call any functions you want on the pool as if it were any other ethers Contract. Let's try fetching credit record details of our current account:

```
const data = await poolContract.creditRecordMapping(wallet.address);
console.log(data);
```

Running this in the console, you should see something like this

```
$ node index.js
[
  BigNumber { _hex: '0x00', _isBigNumber: true },
  BigNumber { _hex: '0x00', _isBigNumber: true },
  BigNumber { _hex: '0x00', _isBigNumber: true },
  BigNumber { _hex: '0x00', _isBigNumber: true },
  BigNumber { _hex: '0x00', _isBigNumber: true },
  0,
  0,
  0,
  unbilledPrincipal: BigNumber { _hex: '0x00', _isBigNumber: true },
  dueDate: BigNumber { _hex: '0x00', _isBigNumber: true },
  correction: BigNumber { _hex: '0x00', _isBigNumber: true },
  totalDue: BigNumber { _hex: '0x00', _isBigNumber: true },
  feesAndInterestDue: BigNumber { _hex: '0x00', _isBigNumber: true },
  missedPeriods: 0,
  remainingPeriods: 0,
  state: 0
]
Done in 4.90s.
```

# Other SDK examples

## Declare a receivable as paid

Once we've minted a receivable, we can use the `ReceivableService` to pay it off using multiple types of payment methods.

```
const wallet = new Wallet(TEST_PRIVATE_KEY, provider);

const data = await ReceivableService.payReceivableByTokenId(
    wallet,
    8, // receivableTokenId
    10, // paymentAmount
    PaymentMethod.Declarative // paymentMethod
);
console.log(`Success. Tx hash: ${data.transactionHash}`);
```

## Mint a receivable with metadata automatically uploaded to ARWeave

Huma supports both lazy funding and pre-funding the ARWeave network to pay for metadata uploads.

```
// Prefund...
await prefundBundlr(getBundlrNetworkConfig(5), signer, 1_000_000)

// Or pay as you go! (Note: it's recommended you still prefund with a small
// amount of currency to avoid slippage)
const data = await ReceivableService.mintReceivableWithMetadata(
    signer,
    TEST_PRIVATE_KEY,
    chainId,
    poolName,
    poolType,
    receivableAmount,
    maturityDate,
    paymentMethod,
    JSON.parse(metadata),
    internalID,
    [],
)
setMintResult(`Success, Tx Hash: ${data.transactionHash}`)
console.log(data)
```

## Query for receivables uploaded to ARWeave

Once metadata is uploaded to ARWeave, you can query them by referenceId tags, which you can specify during upload.

```
const data = await ARWeaveService.queryForMetadata(
    chainId,
    poolName,
    poolType,
    address,
    '12', // referenceId
)
setQueryResult(data)
console.log(data)
```

## Next steps

If you want to learn more about the different functions and helpers available in the Huma SDK, please check out our [API documentation](API.md).
