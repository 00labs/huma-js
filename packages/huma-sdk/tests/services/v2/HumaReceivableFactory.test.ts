import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { BigNumber, ethers } from 'ethers'
import { HumaReceivableFactory, HumaContext } from '../../../src/services'

describe('HumaReceivableFactory', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw if the signer and arweave uploader wallet are the same', async () => {
    const mnemonic =
      'test test test test test test test test test test test junk'
    const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic)
    const provider = new ethers.providers.JsonRpcProvider(
      `http://localhost:8545`,
    )

    const humaContext = new HumaContext({
      signer: mnemonicWallet,
      provider,
      chainId: ChainEnum.Localhost,
      poolName: POOL_NAME.ArfCreditPoolV2,
      poolType: POOL_TYPE.ReceivableBackedCreditLine,
    })
    const receivableFactory = new HumaReceivableFactory({
      humaContext,
    })

    await expect(
      receivableFactory.createReceivableWithMetadata(
        mnemonicWallet.privateKey, // privateKey
        840, // currencyCode for USD
        BigNumber.from(1000), // receivableAmount
        1684517656, // maturityDate
        JSON.parse('{"test": "test"}'),
      ),
    ).rejects.toThrow(
      'The ARWeave payment private key must be different from the signer address',
    )
  })
})
