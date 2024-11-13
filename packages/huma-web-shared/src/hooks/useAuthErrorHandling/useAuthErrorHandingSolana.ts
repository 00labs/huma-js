/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthService,
  CHAIN_TYPE,
  SiwsMessage,
  SOLANA_CHAINS,
  SolanaChainEnum,
} from '@huma-finance/shared'
import { WalletName } from '@solana/wallet-adapter-base'
import { useConnection, useWallet, Wallet } from '@solana/wallet-adapter-react'
import {
  LedgerWalletName,
  PhantomWalletName,
} from '@solana/wallet-adapter-wallets'
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import bs58 from 'bs58'
import { useEffect } from 'react'
import { ErrorType } from '.'

// Required for serialized tx for hard wallet sign in like Ledger. Followed this article:
// https://medium.com/@legendaryangelist/how-to-implement-message-signing-with-the-ledger-on-solana-50a4a925e752
const MEMO_PROGRAM_ID = new PublicKey(
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
)

const WALLETS_WITH_SERIALIZED_TX: WalletName<string>[] = [
  LedgerWalletName,
  PhantomWalletName,
]

const createSiwsMessage = (
  address: string,
  chainId: SolanaChainEnum,
  nonce: string,
  expiresAt: string,
) => {
  const domain = window.location.hostname
  const message = new SiwsMessage({
    domain,
    address,
    statement: 'Please sign in to verify your ownership of this wallet',
    uri: window.location.origin,
    version: '1',
    chainId: SOLANA_CHAINS[chainId].name,
    nonce,
    expirationTime: expiresAt,
  })
  return message.prepareMessage()
}

const buildAuthTx = async (message: string): Promise<Transaction> => {
  const tx = new Transaction()

  tx.add(
    new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [],
      data: Buffer.from(message, 'utf8'),
    }),
  )
  return tx
}

const verifyOwnershipSolana = async (
  wallet: Wallet,
  connection: Connection,
  address: string,
  chainId: number,
  isDev: boolean,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
  onVerificationComplete: () => void,
) => {
  try {
    const { nonce, expiresAt } = await AuthService.createSession(chainId, isDev)
    const message = createSiwsMessage(address, chainId, nonce, expiresAt)

    if (WALLETS_WITH_SERIALIZED_TX.includes(wallet.adapter.name)) {
      const tx = await buildAuthTx(message)
      tx.feePayer = new PublicKey(address)
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      const signedTx = await signTransaction(tx)
      const serializedTx = signedTx.serialize().toString('base64')
      await AuthService.verifySolanaTx(message, serializedTx, chainId, isDev)
    } else {
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = await signMessage(encodedMessage)
      const signatureEncoded = bs58.encode(signedMessage as Uint8Array)
      await AuthService.verifySignature(
        message,
        signatureEncoded,
        chainId,
        isDev,
      )
    }

    onVerificationComplete()
  } catch (error) {
    console.error(error)
  }
}

export const useAuthErrorHandingSolana = (
  chainType: CHAIN_TYPE,
  isDev: boolean,
  error: any,
  getErrorInfo: (error: any) => {
    isUnauthorizedError: boolean
    isWalletNotCreatedError: boolean
    isWalletNotSignInError: boolean
  },
  setError: (error: any) => void,
  setErrorType: (errorType: ErrorType) => void,
  setIsVerificationRequired: (isVerificationRequired: boolean) => void,
  handleVerificationCompletion: () => void,
) => {
  const { connection } = useConnection()
  const { publicKey, signMessage, wallet, signTransaction } = useWallet()
  const account = publicKey?.toString() ?? ''

  useEffect(() => {
    if (
      chainType !== CHAIN_TYPE.SOLANA ||
      !wallet ||
      !account ||
      !error ||
      !signMessage ||
      !signTransaction
    ) {
      return
    }

    const {
      isUnauthorizedError,
      isWalletNotCreatedError,
      isWalletNotSignInError,
    } = getErrorInfo(error)

    if (
      isUnauthorizedError ||
      isWalletNotCreatedError ||
      isWalletNotSignInError
    ) {
      setErrorType('NotSignedIn')
      setIsVerificationRequired(true)
      verifyOwnershipSolana(
        wallet,
        connection,
        account,
        isDev ? SolanaChainEnum.SolanaDevnet : SolanaChainEnum.SolanaMainnet,
        isDev,
        signTransaction,
        signMessage,
        handleVerificationCompletion,
      ).catch((e) => setError(e))
    } else if ([4001, 'ACTION_REJECTED'].includes((error as any).code)) {
      setErrorType('UserRejected')
    } else {
      setErrorType('Other')
    }
  }, [
    account,
    chainType,
    connection,
    error,
    getErrorInfo,
    handleVerificationCompletion,
    isDev,
    setError,
    setErrorType,
    setIsVerificationRequired,
    signMessage,
    signTransaction,
    wallet,
  ])
}
