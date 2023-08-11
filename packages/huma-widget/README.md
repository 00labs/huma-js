# Huma Widgets

The `@huma-finance/widgets` package is an [npm package](https://www.npmjs.com/package/@huma-finance/widgets) of React components used to provide subsets of the Huma Finance Protocol functionality in a small user interface element for:

- Invoice factoring borrow and payment
- Credit line borrow and payment
- Lend supply and withdraw
- Superfluid stream borrow

## Installation

Install the widgets library via `npm` or `yarn`.

```js
yarn add @huma-finance/widgets
```

```js
npm i --save @huma-finance/widgets
```

## Adding Widget to Your App

```jsx
import { InvoiceFactoringBorrowWidget } from '@huma-finance/widgets'

export const InvoiceFactoringBorrowPage = () => {
  return (
    <InvoiceFactoringBorrowWidget
      poolName='pool name'
      poolType='pool type'
      tokenId={tokenId}
      handleClose={handleClose}
    />
  )
}
```

## Documentation

For documentation on the different widgets offered please refer to the [API](API.md)

## Example Usage

To see how the Huma widgets can be used, feel free to use our interactive example under src/cosmos.

1. Run `yarn cosmos`
2. Open up `localhost:8000` in your browser and choose the fixture to test
