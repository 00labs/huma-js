export enum SolanaChainEnum {
  SolanaDevnet = 901,
  SolanaMainnet = 900,
}

export function isSolanaTestnet(chainId: SolanaChainEnum): boolean {
  return chainId !== SolanaChainEnum.SolanaMainnet
}

export function getSolanaExplorerUrl(
  chainId: SolanaChainEnum,
  signature: string,
  type: 'tx' | 'address',
): string | null {
  let cluster = ''
  switch (chainId) {
    case SolanaChainEnum.SolanaDevnet:
      cluster = '?cluster=devnet'
      break
    default:
      break
  }

  if (!signature) {
    return null
  }

  return `https://explorer.solana.com/${type}/${signature}${cluster}`
}
