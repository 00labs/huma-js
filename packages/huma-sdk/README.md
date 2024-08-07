# Huma SDK

![Badge functions](coverage/badge-functions.svg) ![Badge lines](coverage/badge-lines.svg)

The Huma SDK includes utilities and services for interacting with different layers of our protocol including contracts, our evaluation agent underwriting service, and data storage hosted on ARWeave, Subgraph, on-chain, etc. It's currently offered just as a Javascript NPM package at https://www.npmjs.com/package/@huma-shan/sdk.

## Getting Started

We recommend onboarding onto our SDK using the [Getting Started guide](getting-started.md)

## Documentation

For extensive documentation on the different functions offered please refer to the [API documentation](API.md)

## Features

- Services
  - `ARWeaveService` contains helper methods for storing data on ARWeave conforming to Huma data standards, querying for metadata, and prefunding ARWeave nodes to pay for data uploading.
  - `EAService` contains helper methods to request credit approvals from Huma's Evaluation Agent layer.
  - `ReceivableService` contains helper methods to manage minting and paying Receivable tokens
  - `SubgraphService` contains helper methods for querying Huma's subgraphs
- Hooks
  - React hooks for fetching ethers.js Contract instances of Huma contracts
- Helpers
  - `ERC20TransferableReceivableContractHelper` fetches ERC20TransferableReceivable contract instances, which Huma uses for its Request Network integration
  - `RealWorldReceivableContractHelper` fetches RealWorldReceivable contract instances, which Huma uses to power pool loan tapes
  - `PoolContractHelper` helper function for interacting with Huma's pool contracts, including drawdown and payback

## Examples

To see how the Huma SDK can be used, feel free to use our interactive example in the `huma-widgets` package.

1. Open up the `huma-widgets` package in your terminal
2. Run `yarn cosmos`
3. Open up localhost:8000 in your browser and navigate to the SDKTesting fixture

If you're looking for nodeJS script integrations, go to our `packages/examples` folder and view the examples scripts provided there.
