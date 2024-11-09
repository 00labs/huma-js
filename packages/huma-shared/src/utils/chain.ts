import type { AddEthereumChainParameter } from '@web3-react/types'
import { ethers } from 'ethers'

export enum CHAIN_TYPE {
  EVM = 'evm',
  SOLANA = 'solana',
  STELLAR = 'stellar',
}

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'MATIC',
  symbol: 'MATIC',
  decimals: 18,
}

const CELO: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'CELO',
  symbol: 'CELO',
  decimals: 18,
}

export interface BasicChainInformation {
  id: number
  urls: string[]
  name: string
  explorer: string
  wait: number
  requestAPIUrl?: string | undefined
  isTestnet: boolean
  icon: string
  disabled?: boolean
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

export enum ChainEnum {
  Polygon = 137,
  Goerli = 5,
  Mumbai = 80001,
  Amoy = 80002,
  Celo = 42220,
  Alfajores = 44787,
  Localhost = 31337,
  HumaTestnet = 31338,
  BaseSepolia = 84532,
  Scroll = 534352,
  ScrollSepolia = 534351,
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation
} = {
  [ChainEnum.Polygon]: {
    id: ChainEnum.Polygon,
    urls: ['https://polygon-rpc.com/'],
    name: 'Polygon',
    nativeCurrency: MATIC,
    explorer: 'https://polygonscan.com',
    wait: 6,
    isTestnet: false,
    icon: 'Polygon',
  },
  [ChainEnum.Goerli]: {
    id: ChainEnum.Goerli,
    urls: ['https://rpc.ankr.com/eth_goerli'],
    name: 'Goerli',
    nativeCurrency: ETH,
    explorer: 'https://goerli.etherscan.io',
    wait: 1,
    requestAPIUrl: 'https://dev.goerli.rnreader.huma.finance',
    isTestnet: true,
    icon: 'Ethereum',
    disabled: true,
  },
  [ChainEnum.Localhost]: {
    id: ChainEnum.Localhost,
    urls: ['http://localhost:8545'],
    name: 'Localhost',
    nativeCurrency: ETH,
    explorer: '',
    wait: 1,
    isTestnet: true,
    icon: 'Ethereum',
  },
  [ChainEnum.HumaTestnet]: {
    id: ChainEnum.HumaTestnet,
    urls: ['https://integration.v2.huma.finance'],
    name: 'HumaTestnet',
    nativeCurrency: ETH,
    explorer: '',
    wait: 1,
    isTestnet: true,
    icon: 'Ethereum',
  },
  [ChainEnum.Mumbai]: {
    id: ChainEnum.Mumbai,
    urls: ['https://rpc.ankr.com/polygon_mumbai'],
    name: 'Mumbai',
    nativeCurrency: MATIC,
    explorer: 'https://mumbai.polygonscan.com',
    wait: 1,
    isTestnet: true,
    icon: 'Polygon',
    disabled: true,
  },
  [ChainEnum.Amoy]: {
    id: ChainEnum.Amoy,
    urls: ['https://rpc.ankr.com/polygon_amoy'],
    name: 'Amoy',
    nativeCurrency: MATIC,
    explorer: 'https://amoy.polygonscan.com',
    wait: 1,
    isTestnet: true,
    icon: 'Polygon',
  },
  [ChainEnum.Celo]: {
    id: ChainEnum.Celo,
    urls: ['https://forno.celo.org'],
    name: 'Celo Mainnet',
    nativeCurrency: CELO,
    explorer: 'https://celoscan.io',
    wait: 1,
    isTestnet: false,
    icon: 'Celo',
  },
  [ChainEnum.Alfajores]: {
    id: ChainEnum.Alfajores,
    urls: ['https://alfajores-forno.celo-testnet.org'],
    name: 'Alfajores',
    nativeCurrency: CELO,
    explorer: 'https://alfajores.celoscan.io',
    wait: 1,
    isTestnet: true,
    icon: 'Celo',
  },
  [ChainEnum.BaseSepolia]: {
    id: ChainEnum.BaseSepolia,
    urls: ['https://sepolia.base.org'],
    name: 'Base Sepolia Testnet',
    nativeCurrency: ETH,
    explorer: 'https://sepolia.basescan.org',
    wait: 1,
    isTestnet: true,
    icon: 'Ethereum',
  },
  [ChainEnum.Scroll]: {
    id: ChainEnum.Scroll,
    urls: ['https://rpc.scroll.io'],
    name: 'Scroll',
    nativeCurrency: ETH,
    explorer: 'https://scrollscan.com',
    wait: 3,
    isTestnet: false,
    icon: 'Ethereum',
  },
  [ChainEnum.ScrollSepolia]: {
    id: ChainEnum.ScrollSepolia,
    urls: ['https://sepolia-rpc.scroll.io'],
    name: 'Scroll Sepolia Testnet',
    nativeCurrency: ETH,
    explorer: 'https://sepolia.scrollscan.com',
    wait: 3,
    isTestnet: true,
    icon: 'Ethereum',
  },
}

export function isTestnet(chainId: number): boolean {
  return CHAINS[chainId].isTestnet ?? false
}

export function isChainEnum(
  chainId: number | string | undefined,
): chainId is keyof typeof ChainEnum {
  return Object.keys(ChainEnum).includes(String(chainId))
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(
  chainId: number,
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
    }
  }
  return chainId
}

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS,
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs
  }

  return accumulator
}, {})

export const getWalletAddressAbbr = (address: string) => {
  if (!address) {
    return address
  }
  const { length } = address
  return `${address.slice(0, 6)}...${address.slice(length - 4, length)}`
}

/**
 * Returns the input chain ID if chain is supported. If not, return undefined
 * @param chainId a chain ID, which will be returned if it is a supported chain ID
 */
export function supportedChainId(
  chainId: number | undefined,
): ChainEnum | undefined {
  if (typeof chainId === 'number' && chainId in ChainEnum) {
    return chainId
  }
  if (typeof chainId === 'string' && Number(chainId) in ChainEnum) {
    return Number(chainId)
  }
  return undefined
}

export function findChainIdByName(chainName: string) {
  const chainId = Object.keys(CHAINS).find(
    (key) => CHAINS[Number(key)].name === chainName,
  )
  return chainId ? Number(chainId) : undefined
}

export function getExplorerUrl(
  chainId: number | undefined,
  hash: string,
  type: 'tx' | 'address',
): string | null {
  const chain = chainId ? CHAINS[chainId] : null

  if (!chain) {
    return null
  }

  return `${chain.explorer}/${type}/${hash}`
}

/**
 * Get the chain ID from a signer or provider object.
 * @param {ethers.provider.Provider | ethers.Signer | undefined} signerOrProvider - The signer or provider object to get the chain ID from.
 * @returns {number} - The chain ID.
 */
export async function getChainIdFromSignerOrProvider(
  signerOrProvider: ethers.providers.Provider | ethers.Signer | undefined,
): Promise<number | undefined> {
  if (!signerOrProvider) {
    return undefined
  }

  let network
  if (
    'getNetwork' in signerOrProvider &&
    typeof signerOrProvider.getNetwork === 'function'
  ) {
    network = await signerOrProvider.getNetwork()
  } else if ('provider' in signerOrProvider) {
    network = await signerOrProvider.provider?.getNetwork()
  }

  return network?.chainId
}
