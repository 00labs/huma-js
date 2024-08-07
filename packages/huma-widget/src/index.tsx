import { JsonRpcProvider } from '@ethersproject/providers'
import {
  Provider as Web3Provider,
  ProviderProps as Web3Props,
} from '@huma-shan/web-core'
import { ThemeProvider } from '@mui/material'
import { Provider as Eip1193Provider } from '@web3-react/types'
import { Provider as AtomProvider } from 'jotai'
import { useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { ChainSupportProvider } from './components/ChainSupportProvider'
import {
  CreditLineApprove,
  CreditLineApproveProps,
} from './components/CreditLine/approve'
import {
  AutoPaybackPropsV2,
  AutoPaybackV2,
} from './components/CreditLine/autoPaybackV2'
import {
  CreditLineBorrow,
  CreditLineBorrowProps,
} from './components/CreditLine/borrow'
import {
  CreditLineBorrowPropsV2,
  CreditLineBorrowV2,
} from './components/CreditLine/borrowV2'
import {
  CreditLinePayment,
  CreditLinePaymentProps,
} from './components/CreditLine/payment'
import {
  CreditLinePaymentPropsV2,
  CreditLinePaymentV2,
} from './components/CreditLine/paymentV2'
import {
  SupplyFirstLossCover,
  SupplyFirstLossCoverProps,
} from './components/CreditLine/supplyFLC'
import {
  InvoiceFactoringBorrow,
  InvoiceFactoringBorrowProps,
} from './components/InvoiceFactoring/borrow'
import {
  InvoiceFactoringPayment,
  InvoiceFactoringPaymentProps,
} from './components/InvoiceFactoring/payment'
import {
  AddRedemptionPropsV2,
  AddRedemptionV2,
} from './components/Lend/addRedemptionV2'
import {
  CancelRedemptionPropsV2,
  CancelRedemptionV2,
} from './components/Lend/cancelRedemptionV2 '
import { LendSupply, LendSupplyProps } from './components/Lend/supply'
import { LendSupplyPropsV2, LendSupplyV2 } from './components/Lend/supplyV2'
import { LendWithdraw, LendWithdrawProps } from './components/Lend/withdraw'
import {
  LendWithdrawPropsV2,
  LendWithdrawV2,
} from './components/Lend/withdrawV2'
import {
  ReceivableBackedCreditLineBorrowPropsV2,
  ReceivableBackedCreditLineBorrowV2,
} from './components/ReceivableBackedCreditLine/borrow'
import {
  ReceivableBackedCreditLinePaymentPropsV2,
  ReceivableBackedCreditLinePaymentV2,
} from './components/ReceivableBackedCreditLine/payment'
import { SuperfluidFactoring } from './components/SuperfluidFactoring'
import { store } from './store'
import { themeHuma } from './theme'
import { WCProps } from './utilTypes'

/**
 * Mapping of your JSON-RPC connections indexed by chainId
 * @typedef {Object} JsonRpcConnectionMap
 * @property {Object.<number, string|Array<string>|JsonRpcProvider|Array<JsonRpcProvider>>} chainId Chain id to map the JSON-RPC URL/URLs or JsonRpcProvider/JsonRpcProviders
 */
type JsonRpcConnectionMap = {
  [chainId: number]: string | string[] | JsonRpcProvider | JsonRpcProvider[]
}

/**
 * Object representing the props passed to web3 provider
 * @typedef {Object} WidgetProps
 * @property {desiredChainId|undefined} desiredChainId Optional desired chain id, will trigger the switch network action if different from the current chain id
 * @property {JsonRpcConnectionMap|undefined} jsonRpcUrlMap Optional mapping of your JSON-RPC connections indexed by chainId
 * @property {Eip1193Provider|JsonRpcProvider} provider EIP-1193 provider or JsonRpc Provider
 */
type WidgetProps = {
  handleClose?: () => void
  desiredChainId?: number
  jsonRpcUrlMap?: JsonRpcConnectionMap
  provider: Eip1193Provider | JsonRpcProvider
}

function Widget(props: WCProps<WidgetProps>) {
  const { children, provider } = props
  const [chainId, setChainId] = useState<number | undefined>(undefined)

  useEffect(() => {
    const getChainId = async () => {
      if (provider instanceof JsonRpcProvider) {
        const network = await provider.getNetwork()
        setChainId(network?.chainId)
      }
    }
    getChainId()
  }, [provider])

  return (
    <ThemeProvider theme={themeHuma}>
      <ReduxProvider store={store}>
        <Web3Provider {...(props as Web3Props)} defaultChainId={chainId}>
          <AtomProvider>
            <ChainSupportProvider>{children}</ChainSupportProvider>
          </AtomProvider>
        </Web3Provider>
      </ReduxProvider>
    </ThemeProvider>
  )
}

/**
 * Invoice factoring pool borrow widget props
 * @typedef {Object} InvoiceFactoringBorrowWidgetProps
 * @property {InvoiceFactoringBorrowProps} InvoiceFactoringBorrowProps - Invoice factoring pool borrow props.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type InvoiceFactoringBorrowWidgetProps = InvoiceFactoringBorrowProps &
  WidgetProps

/**
 * Invoice factoring borrow widget
 *
 * @param {InvoiceFactoringBorrowWidgetProps} props - The invoice factoring pool borrow widget props.
 * @returns Invoice factoring pool borrow widget component
 */
export function InvoiceFactoringBorrowWidget(
  props: InvoiceFactoringBorrowWidgetProps,
) {
  return (
    <Widget {...props}>
      <InvoiceFactoringBorrow {...props} />
    </Widget>
  )
}

/**
 * Invoice factoring pool payment widget props
 * @typedef {Object} InvoiceFactoringPaymentWidgetProps
 * @property {InvoiceFactoringPaymentProps} InvoiceFactoringPaymentProps - Invoice factoring pool payment props.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type InvoiceFactoringPaymentWidgetProps = InvoiceFactoringPaymentProps &
  WidgetProps

/**
 * Invoice factoring payment widget
 *
 * @param {InvoiceFactoringPaymentWidgetProps} props - The invoice factoring pool payment widget props.
 * @returns Invoice factoring pool payment widget component
 */
export function InvoiceFactoringPaymentWidget(
  props: InvoiceFactoringPaymentWidgetProps,
) {
  return (
    <Widget {...props}>
      <InvoiceFactoringPayment {...props} />
    </Widget>
  )
}

/**
 * Credit line pool borrow widget props
 * @typedef {Object} CreditLineBorrowWidgetProps
 * @property {CreditLineBorrowProps} CreditLineBorrowProps - Credit line pool borrow props.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type CreditLineBorrowWidgetProps = CreditLineBorrowProps & WidgetProps

/**
 * Credit line borrow widget
 *
 * @param {CreditLineBorrowWidgetProps} props - The credit line pool borrow widget props.
 * @returns Credit line pool borrow widget component
 */
export function CreditLineBorrowWidget(props: CreditLineBorrowWidgetProps) {
  return (
    <Widget {...props}>
      <CreditLineBorrow {...props} />
    </Widget>
  )
}

/**
 * Credit line pool borrow widget props V2
 * @typedef {Object} CreditLineBorrowWidgetPropsV2
 * @property {CreditLineBorrowPropsV2} CreditLineBorrowPropsV2 - Credit line pool borrow props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type CreditLineBorrowWidgetPropsV2 = CreditLineBorrowPropsV2 & WidgetProps

/**
 * Credit line borrow widget V2
 *
 * @param {CreditLineBorrowWidgetPropsV2} props - The credit line pool borrow widget props V2.
 * @returns Credit line pool borrow widget component V2
 */
export function CreditLineBorrowWidgetV2(props: CreditLineBorrowWidgetPropsV2) {
  return (
    <Widget {...props}>
      <CreditLineBorrowV2 {...props} />
    </Widget>
  )
}

/**
 * Credit line pool payment widget props
 * @typedef {Object} CreditLinePaymentWidgetProps
 * @property {CreditLinePaymentProps} CreditLinePaymentProps - Credit line pool payment props.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type CreditLinePaymentWidgetProps = CreditLinePaymentProps & WidgetProps

/**
 * Credit line payment widget
 *
 * @param {CreditLinePaymentWidgetProps} props - The credit line pool payment widget props.
 * @returns Credit line pool payment widget component
 */
export function CreditLinePaymentWidget(props: CreditLinePaymentWidgetProps) {
  return (
    <Widget {...props}>
      <CreditLinePayment {...props} />
    </Widget>
  )
}

/**
 * Credit line pool payment widget props V2
 * @typedef {Object} CreditLinePaymentWidgetPropsV2
 * @property {CreditLinePaymentPropsV2} CreditLinePaymentPropsV2 - Credit line pool payment props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type CreditLinePaymentWidgetPropsV2 = CreditLinePaymentPropsV2 & WidgetProps

/**
 * Credit line payment widget V2
 *
 * @param {CreditLinePaymentWidgetPropsV2} props - The credit line pool payment widget props V2.
 * @returns Credit line pool payment widget component V2
 */
export function CreditLinePaymentWidgetV2(
  props: CreditLinePaymentWidgetPropsV2,
) {
  return (
    <Widget {...props}>
      <CreditLinePaymentV2 {...props} />
    </Widget>
  )
}

/**
 * Credit line allowance approval widget props
 * @typedef {Object} CreditLinePaymentWidgetProps
 * @property {CreditLineApproveProps} CreditLineApproveProps - Credit line allowance approve props.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type CreditLineApproveWidgetProps = CreditLineApproveProps & WidgetProps

/**
 * Credit line allowance approve widget to top up a pool's ERC20 token allowance.
 * To be used when re-enabling autopay and other pool actions that require allowance.
 *
 * @param {CreditLineApproveWidgetProps} props - The credit line pool approve widget props.
 * @returns Credit line pool approve widget component
 */
export function CreditLineApproveWidget(props: CreditLineApproveWidgetProps) {
  return (
    <Widget {...props}>
      <CreditLineApprove {...props} />
    </Widget>
  )
}

/**
 * Lend pool supply widget props
 * @typedef {Object} LendSupplyWidgetProps
 * @property {LendSupplyProps} LendSupplyProps - Lend pool supply props.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type LendSupplyWidgetProps = LendSupplyProps & WidgetProps

/**
 * Lend supply widget
 *
 * @param {LendSupplyWidgetProps} props - The lend pool supply widget props.
 * @returns Lend pool supply widget component
 */
export function LendSupplyWidget(props: LendSupplyWidgetProps) {
  return (
    <Widget {...props}>
      <LendSupply {...props} />
    </Widget>
  )
}

/**
 * Lend pool supply widget props V2
 * @typedef {Object} LendSupplyWidgetPropsV2
 * @property {LendSupplyPropsV2} LendSupplyPropsV2 - Lend pool supply props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type LendSupplyWidgetPropsV2 = LendSupplyPropsV2 & WidgetProps

/**
 * Lend supply widget V2
 *
 * @param {LendSupplyWidgetPropsV2} props - The lend pool supply widget props V2.
 * @returns Lend pool supply widget component V2
 */
export function LendSupplyWidgetV2(props: LendSupplyWidgetPropsV2) {
  return (
    <Widget {...props}>
      <LendSupplyV2 {...props} />
    </Widget>
  )
}

/**
 * Lend pool withdraw widget props
 * @typedef {Object} LendWithdrawWidgetProps
 * @property {LendWithdrawProps} LendWithdrawProps - Lend pool withdraw props.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type LendWithdrawWidgetProps = LendWithdrawProps & WidgetProps

/**
 * Lend withdraw widget
 *
 * @param {LendWithdrawWidgetProps} props The lend pool withdraw widget props
 * @returns Lend pool withdraw widget component
 */
export function LendWithdrawWidget(props: LendWithdrawWidgetProps) {
  return (
    <Widget {...props}>
      <LendWithdraw {...props} />
    </Widget>
  )
}

/**
 * Lend pool supply widget props V2
 * @typedef {Object} LendWithdrawWidgetPropsV2
 * @property {LendWithdrawPropsV2} LendSupplyPropsV2 - Lend pool supply props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type LendWithdrawWidgetPropsV2 = LendWithdrawPropsV2 & WidgetProps

/**
 * Lend withdraw widget V2
 *
 * @param {LendWithdrawWidgetPropsV2} props - The lend pool supply widget props V2.
 * @returns Lend pool supply widget component V2
 */
export function LendWithdrawWidgetV2(props: LendWithdrawWidgetPropsV2) {
  return (
    <Widget {...props}>
      <LendWithdrawV2 {...props} />
    </Widget>
  )
}

/**
 * Lend pool add redemption widget props V2
 * @typedef {Object} AddRedemptionWidgetPropsV2
 * @property {AddRedemptionWidgetPropsV2} AddRedemptionWidgetPropsV2 - Lend pool add redemption props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type AddRedemptionWidgetPropsV2 = AddRedemptionPropsV2 & WidgetProps

/**
 * Add redemption widget V2
 *
 * @param {AddRedemptionWidgetPropsV2} props - The lend pool add redemption widget props V2.
 * @returns Lend pool add redemption widget component V2
 */
export function AddRedemptionWidgetV2(props: AddRedemptionWidgetPropsV2) {
  return (
    <Widget {...props}>
      <AddRedemptionV2 {...props} />
    </Widget>
  )
}

/**
 * Lend pool cancel redemption widget props V2
 * @typedef {Object} CancelRedemptionWidgetPropsV2
 * @property {CancelRedemptionWidgetPropsV2} CancelRedemptionWidgetPropsV2 - Lend pool cancel redemption props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type CancelRedemptionWidgetPropsV2 = CancelRedemptionPropsV2 & WidgetProps

/**
 * Cancel redemption widget V2
 *
 * @param {CancelRedemptionWidgetPropsV2} props - The lend pool cancel redemption widget props V2.
 * @returns Lend pool cancel redemption widget component V2
 */
export function CancelRedemptionWidgetV2(props: CancelRedemptionWidgetPropsV2) {
  return (
    <Widget {...props}>
      <CancelRedemptionV2 {...props} />
    </Widget>
  )
}

/**
 * Supply first loss cover widget props
 * @typedef {Object} SupplyFirstLossCoverWidgetProps
 * @property {SupplyFirstLossCover} SupplyFirstLossCover - Supply first loss cover props.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type SupplyFirstLossCoverWidgetProps = SupplyFirstLossCoverProps & WidgetProps

/**
 * Supply first loss cover widget
 *
 * @param {SupplyFirstLossCoverWidgetProps} props - The supply first loss cover widget props.
 * @returns Supply first loss cover widget component
 */
export function SupplyFirstLossCoverWidget(
  props: SupplyFirstLossCoverWidgetProps,
) {
  return (
    <Widget {...props}>
      <SupplyFirstLossCover {...props} />
    </Widget>
  )
}

/**
 * Superfluid factoring widget
 *
 * @param {WidgetProps} props - The superfluid factoring widget props.
 * @returns Superfluid factoring widget component
 */
export function SuperfluidFactoringWidget(props: WidgetProps) {
  return (
    <Widget {...props}>
      <SuperfluidFactoring />
    </Widget>
  )
}

/**
 * Auto payback widget props V2
 * @typedef {Object} AutoPaybackWidgetPropsV2
 * @property {AutoPayback} AutoPayback - Auto payback props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type AutoPaybackWidgetPropsV2 = AutoPaybackPropsV2 & WidgetProps

/**
 * Supply first loss cover widget
 *
 * @param {SupplyFirstLossCoverWidgetProps} props - The supply first loss cover widget props.
 * @returns Supply first loss cover widget component
 */
export function AutoPaybackWidgetV2(props: AutoPaybackWidgetPropsV2) {
  return (
    <Widget {...props}>
      <AutoPaybackV2 {...props} />
    </Widget>
  )
}

/**
 * Receivable backed credit line pool borrow widget props V2
 * @typedef {Object} ReceivableBackedCreditLineBorrowWidgetPropsV2
 * @property {ReceivableBackedCreditLineBorrowPropsV2} ReceivableBackedCreditLineBorrowPropsV2 - Receivable backed credit line pool borrow props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type ReceivableBackedCreditLineBorrowWidgetPropsV2 =
  ReceivableBackedCreditLineBorrowPropsV2 & WidgetProps

/**
 * Receivable backed credit line borrow widget V2
 *
 * @param {ReceivableBackedCreditLineBorrowWidgetPropsV2} props - The receivable backed credit line pool borrow widget props V2.
 * @returns Receivable backed credit line pool borrow widget component V2
 */
export function ReceivableBackedCreditLineBorrowWidgetV2(
  props: ReceivableBackedCreditLineBorrowWidgetPropsV2,
) {
  return (
    <Widget {...props}>
      <ReceivableBackedCreditLineBorrowV2 {...props} />
    </Widget>
  )
}

/**
 * Receivable backed credit line pool payment widget props V2
 * @typedef {Object} ReceivableBackedCreditLinePaymentWidgetPropsV2
 * @property {ReceivableBackedCreditLinePaymentPropsV2} ReceivableBackedCreditLinePaymentPropsV2 - Receivable backed credit line pool payment props V2.
 * @property {WidgetProps} WidgetProps - Widget general props.
 */
type ReceivableBackedCreditLinePaymentWidgetPropsV2 =
  ReceivableBackedCreditLinePaymentPropsV2 & WidgetProps

/**
 * Receivable backed credit line payment widget V2
 *
 * @param {ReceivableBackedCreditLinePaymentWidgetPropsV2} props - The receivable backed credit line pool payment widget props V2.
 * @returns Receivable backed credit line pool payment widget component V2
 */
export function ReceivableBackedCreditLinePaymentWidgetV2(
  props: ReceivableBackedCreditLinePaymentWidgetPropsV2,
) {
  return (
    <Widget {...props}>
      <ReceivableBackedCreditLinePaymentV2 {...props} />
    </Widget>
  )
}
