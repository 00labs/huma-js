import { SuperfluidFactoringWidget } from '..'
import { initEnv } from './utils/env'
import { WalletWrapper } from './WalletWrapper'

initEnv()

function Fixture() {
  return <SuperfluidFactoringWidget />
}

export default (
  <WalletWrapper>
    <Fixture />
  </WalletWrapper>
)
