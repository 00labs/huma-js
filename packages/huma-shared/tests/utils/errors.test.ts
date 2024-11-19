import {
  DEFAULT_ERROR_ACTION,
  DEFAULT_ERROR_HEADER,
  EARejectionError,
  IntegrationError,
  MetaMaskConnectionError,
} from '../../src/common/utils/errors'
import { EARejectMessage } from '../../src/evm/utils/const'

describe('IntegrationError', () => {
  it('sets the correct properties', () => {
    const message = 'Test message'
    const error = new IntegrationError(message)

    expect(error.message).toBe(message)
    expect(error.name).toBe('IntegrationError')
    expect(error.header).toBe(DEFAULT_ERROR_HEADER)
    expect(error.action).toBe(DEFAULT_ERROR_ACTION)
    expect(error.dismissable).toBe(false)
  })
})

describe('MetaMaskConnectionError', () => {
  it('sets the correct properties', () => {
    const error = new MetaMaskConnectionError()

    expect(error.message).toBe(
      "'A Metamask error caused your wallet to disconnect. Reload the page to reconnect.'",
    )
    expect(error.name).toBe('ConnectionError')
    expect(error.header).toBe('Wallet disconnected')
    expect(error.action).toBe('Reload')
    expect(error.dismissable).toBe(false)
  })
})

describe('EARejectionError', () => {
  it('sets the correct properties', () => {
    const error = new EARejectionError()

    expect(error.message).toBe(EARejectMessage)
    expect(error.name).toBe('Error')
  })
})
