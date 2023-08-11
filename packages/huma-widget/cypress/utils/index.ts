import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { ethers } from 'ethers'

export const ONE_SECOND = 1 * 1000
export const THREE_SECONDS = 3 * 1000
export const FIVE_SECONDS = 5 * 1000
export const TEN_SECONDS = 10 * 1000
export const TWENTY_SECONDS = 20 * 1000
export const ONE_MINUTE = 60 * 1000
export const TWO_MINUTES = 120 * 1000
export const INVOICE_AMOUNT = 100
export const INVOICE_FACTORED_AMOUNT = 80
export const INVOICE_FEES = 8

const chain = { name: 'Goerli', chainId: 5 }
const infuraKey = Cypress.env('E2E_TEST_INFURA_GOERLI')
export const provider = new JsonRpcProvider(infuraKey, chain)

export const privateKeyForTx = Cypress.env('E2E_TEST_PRIVATE_KEY')
export const addressForTx = new Wallet(privateKeyForTx).address
export const signerForTx = new Wallet(privateKeyForTx, provider)

const wallet = ethers.Wallet.createRandom()
export const addressForApprove = wallet.address
export const signerForApprove = new Wallet(wallet.privateKey, provider)

export const toNumber = (text: string) => {
  return Number(text.replace('$', '').replace(/,/g, '').replace('%', ''))
}

export const getWalletAddressAbbr = (address: string) => {
  if (!address) {
    return address
  }
  const { length } = address
  return `${address.slice(0, 6)}...${address.slice(length - 4, length)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmpty = (value: undefined | null | any) =>
  value === undefined || value === null

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const formatMoney = (num: number | string | undefined) => {
  if (isEmpty(num) || Number.isNaN(num)) {
    return num
  }
  return formatter.format(Number(num))
}
