/* eslint-disable @typescript-eslint/no-explicit-any */
import { hexToUtf8 } from './lib'
import { call, getChainId, RSV, signData } from './rpc'

const MAX_INT =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export interface DaiPermitMessage {
  holder: string
  spender: string
  nonce: number
  expiry: number | string
  allowed?: boolean
}

export interface ERC2612PermitMessage {
  owner: string
  spender: string
  value: number | string
  nonce: number | string
  deadline: number | string
}

export interface TradableStreamPermitMessage {
  owner: string
  receiver: string
  token: string
  origin: string
  flowrate: string
  durationInSeconds: number
  nonce: number | string
  expiry: number | string
}

interface Domain {
  name: string
  version: string
  chainId: number
  verifyingContract: string
}

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

const createTypedDaiData = (message: DaiPermitMessage, domain: Domain) => {
  const typedData = {
    types: {
      EIP712Domain,
      Permit: [
        { name: 'holder', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiry', type: 'uint256' },
        { name: 'allowed', type: 'bool' },
      ],
    },
    primaryType: 'Permit',
    domain,
    message,
  }

  return typedData
}

const createTypedERC2612Data = (
  message: ERC2612PermitMessage,
  domain: Domain,
) => {
  const typedData = {
    types: {
      EIP712Domain,
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'Permit',
    domain,
    message,
  }

  return typedData
}

const createTypedTradableStreamData = (
  message: TradableStreamPermitMessage,
  domain: Domain,
) => {
  const typedData = {
    types: {
      EIP712Domain,
      MintToWithAuthorization: [
        { name: 'receiver', type: 'address' },
        { name: 'token', type: 'address' },
        { name: 'origin', type: 'address' },
        { name: 'owner', type: 'address' },
        { name: 'flowrate', type: 'int96' },
        { name: 'durationInSeconds', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiry', type: 'uint256' },
      ],
    },
    primaryType: 'MintToWithAuthorization',
    domain,
    message,
  }

  return typedData
}

const NONCES_FN = '0x7ecebe00'
const NAME_FN = '0x06fdde03'

const zeros = (numZeros: number) => ''.padEnd(numZeros, '0')

const getTokenName = async (provider: any, address: string) =>
  hexToUtf8((await call(provider, address, NAME_FN)).substr(130))

const getDomain = async (
  provider: any,
  token: string | Domain,
): Promise<Domain> => {
  if (typeof token !== 'string') {
    return token as Domain
  }

  const tokenAddress = token as string

  const [name, chainId] = await Promise.all([
    getTokenName(provider, tokenAddress),
    getChainId(provider),
  ])

  const domain: Domain = {
    name,
    version: '1',
    chainId,
    verifyingContract: tokenAddress,
  }
  return domain
}

export const signDaiPermit = async (
  provider: any,
  token: string | Domain,
  holder: string,
  spender: string,
  expiry?: number,
  nonce?: number,
): Promise<DaiPermitMessage & RSV> => {
  const tokenAddress = (token as Domain).verifyingContract || (token as string)

  const message: DaiPermitMessage = {
    holder,
    spender,
    nonce:
      nonce === undefined
        ? await call(
            provider,
            tokenAddress,
            `${NONCES_FN}${zeros(24)}${holder.substr(2)}`,
          )
        : nonce,
    expiry: expiry || MAX_INT,
    allowed: true,
  }

  const domain = await getDomain(provider, token)
  const typedData = createTypedDaiData(message, domain)
  const sig = await signData(provider, holder, typedData)

  return { ...sig, ...message }
}

export const signERC2612Permit = async (
  provider: any,
  token: string | Domain,
  owner: string,
  spender: string,
  value: string | number = MAX_INT,
  deadline?: number,
  nonce?: number,
): Promise<ERC2612PermitMessage & RSV> => {
  const tokenAddress = (token as Domain).verifyingContract || (token as string)

  const message: ERC2612PermitMessage = {
    owner,
    spender,
    value,
    nonce:
      nonce === undefined
        ? await call(
            provider,
            tokenAddress,
            `${NONCES_FN}${zeros(24)}${owner.substr(2)}`,
          )
        : nonce,
    deadline: deadline || MAX_INT,
  }

  const domain = await getDomain(provider, token)
  const typedData = createTypedERC2612Data(message, domain)
  const sig = await signData(provider, owner, typedData)

  return { ...sig, ...message }
}

export const signTradableStreamPermit = async (
  provider: any,
  NFT: string | Domain,
  receiver: string,
  token: string,
  origin: string,
  owner: string,
  flowrate: string,
  durationInSeconds: number,
  expiry?: number,
  nonce?: number,
): Promise<TradableStreamPermitMessage & RSV> => {
  const NFTAddress = (NFT as Domain).verifyingContract || (NFT as string)

  const message: TradableStreamPermitMessage = {
    receiver,
    token,
    origin,
    owner,
    flowrate,
    durationInSeconds,
    nonce:
      nonce === undefined
        ? await call(
            provider,
            NFTAddress,
            `${NONCES_FN}${zeros(24)}${receiver.substr(2)}`,
          )
        : nonce,
    expiry: expiry || MAX_INT,
  }

  const domain = await getDomain(provider, NFT)
  const typedData = createTypedTradableStreamData(message, domain)
  const sig = await signData(provider, receiver, typedData)

  return { ...sig, ...message }
}
