import { ChainEnum } from './chain'

/**
 * Fallback JSON RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
export const JSON_RPC_FALLBACK_ENDPOINTS: Record<ChainEnum, string[]> = {
  [ChainEnum.Localhost]: ['http://localhost:8545'],
  [ChainEnum.HumaTestnet]: ['https://integration.v2.huma.finance'],
  [ChainEnum.Goerli]: ['https://rpc.ankr.com/eth_goerli'],
  [ChainEnum.BaseSepolia]: ['https://sepolia.base.org'],
  [ChainEnum.Mumbai]: ['https://rpc.ankr.com/polygon_mumbai'],
  [ChainEnum.Polygon]: ['https://polygon-rpc.com/'],
  [ChainEnum.Alfajores]: ['https://alfajores-forno.celo-testnet.org'],
  [ChainEnum.Celo]: ['https://rpc.ankr.com/celo'],
}
