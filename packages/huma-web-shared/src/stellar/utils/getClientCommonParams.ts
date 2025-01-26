import { StellarChainInfo } from '@huma-finance/shared'
import { signTransaction } from '@stellar/freighter-api'

export const getClientCommonParams = (
  chainMetadata: StellarChainInfo,
  stellarAddress: string,
) => ({
  networkPassphrase: chainMetadata.networkPassphrase,
  rpcUrl: chainMetadata.rpc,
  signTransaction: async (xdr: string) => {
    const { signedTxXdr } = await signTransaction(xdr, {
      networkPassphrase: chainMetadata.networkPassphrase,
    })
    return { signedTxXdr, signerAddress: stellarAddress }
  },
})
