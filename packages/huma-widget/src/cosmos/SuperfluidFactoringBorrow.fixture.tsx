import { JsonRpcProvider } from '@ethersproject/providers'
import { SuperfluidFactoringWidget } from '..'
import { WalletWrapper } from './WalletWrapper'

function Fixture() {
  return <SuperfluidFactoringWidget provider={new JsonRpcProvider()} />
}

export default (
  <WalletWrapper>
    <Fixture />
  </WalletWrapper>
)
