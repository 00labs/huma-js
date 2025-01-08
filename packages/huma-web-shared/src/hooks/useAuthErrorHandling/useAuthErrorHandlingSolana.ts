/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthService,
  CHAIN_TYPE,
  SiwsMessage,
  SOLANA_CHAINS,
  SolanaChainEnum,
} from '@huma-finance/shared'
import { WalletSignMessageError } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
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

const buildAuthTx = async (
  account: PublicKey,
  message: string,
): Promise<Transaction> => {
  const tx = new Transaction()

  tx.add(
    new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [
        {
          pubkey: account,
          isSigner: true,
          isWritable: true,
        },
      ],
      data: Buffer.from(message, 'utf8'),
    }),
  )
  return tx
}

const verifyOwnershipSolana = async (
  connection: Connection,
  address: string,
  chainId: number,
  isDev: boolean,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
  onVerificationComplete: () => void,
  setLoading: (loading: boolean) => void,
  reset: () => void,
) => {
  try {
    setLoading(true)
    const { nonce, expiresAt } = await AuthService.createSession(chainId, isDev)
    const message = createSiwsMessage(address, chainId, nonce, expiresAt)
    const account = new PublicKey(address)

    try {
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = await signMessage(encodedMessage)
      const signatureEncoded = bs58.encode(signedMessage)
      await AuthService.verifySignature(
        message,
        signatureEncoded,
        chainId,
        isDev,
      )
    } catch (e: unknown) {
      console.error(e)
      if (e instanceof WalletSignMessageError) {
        // If the wallet does not support message signing, try to sign a transaction
        const tx = await buildAuthTx(account, message)
        tx.feePayer = account
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
        const signedTx = await signTransaction(tx)
        const serializedTx = signedTx.serialize().toString('base64')
        await AuthService.verifySolanaTx(message, serializedTx, chainId, isDev)
      } else {
        reset()
      }
    } finally {
      setLoading(false)
    }

    onVerificationComplete()
  } catch (error) {
    console.error(error)
    reset()
  } finally {
    setLoading(false)
  }
}

export const useAuthErrorHandlingSolana = (
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
  setLoading: (loading: boolean) => void,
  reset: () => void,
) => {
  const { connection } = useConnection()
  const { publicKey, signMessage, signTransaction } = useWallet()
  const account = publicKey?.toString() ?? ''

  useEffect(() => {
    if (
      chainType !== CHAIN_TYPE.SOLANA ||
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
        connection,
        account,
        isDev ? SolanaChainEnum.SolanaDevnet : SolanaChainEnum.SolanaMainnet,
        isDev,
        signTransaction,
        signMessage,
        handleVerificationCompletion,
        setLoading,
        reset,
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
    reset,
    setError,
    setErrorType,
    setIsVerificationRequired,
    setLoading,
    signMessage,
    signTransaction,
  ])
}
