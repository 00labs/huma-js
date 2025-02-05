import { sleep, SolanaChainEnum } from '@huma-finance/shared'
import React, { useCallback, useEffect, useState } from 'react'
import {
  buildOptimalTransactionFromConnection,
  extractWritableAccounts,
} from '@huma-finance/sdk'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useForceRefresh } from '@huma-finance/web-shared'
import { Box, Button, css, Typography, useTheme } from '@mui/material'
import { useAppDispatch } from '../hooks/useRedux'
import { setError, setSolanaSignature } from '../store/widgets.reducers'
import { LoadingModal } from './LoadingModal'
import { SolanaViewOnExplorer } from './SolanaViewOnExplorer'
import { SorryImg } from './images'

type Props = {
  chainId: SolanaChainEnum
  tx?: Transaction
  handleSuccess: (options?: { signature: string }) => void
}

export function SolanaTxSendModal({
  chainId,
  tx,
  handleSuccess,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { publicKey, signTransaction, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [signature, setSignature] = useState<string>('')
  const [showRetryScreen, setShowRetryScreen] = useState<boolean>(false)
  const [useHighPriority, setUseHighPriority] = useState<boolean>(true)
  const [refreshCount, refresh] = useForceRefresh()

  const styles = {
    wrapper: css`
      height: 438px;
      position: relative;
    `,
    sorry: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(12)};
      margin-right: ${theme.spacing(4)};
      & > img {
        width: 170px;
      }
    `,
    bottomButtonGroup: css`
      width: 100%;
      position: absolute;
      bottom: 0;
      display: flex;
      flex-direction: column;
      row-gap: ${theme.spacing(1)};
      column-gap: ${theme.spacing(1)};

      button {
        height: 40px;
        margin-top: ${theme.spacing(1)};
      }
    `,
    content: css`
      margin-top: ${theme.spacing(2)};
      font-size: 16px;
    `,
    retryHighPriorityButton: css`
      font-size: 16px;
    `,
  }

  useEffect(() => {
    async function sendTx() {
      if (!connection || !tx || !publicKey || !signTransaction) {
        return
      }

      let signatureResult = ''
      try {
        // Optimize transaction
        // Make a copy of the tx so we can use the original tx for retries
        const txCopy = new Transaction()
        txCopy.instructions = [...tx.instructions]
        const recentBlockhash = await connection.getLatestBlockhash('confirmed')
        txCopy.recentBlockhash = recentBlockhash.blockhash
        txCopy.lastValidBlockHeight = recentBlockhash.lastValidBlockHeight
        txCopy.feePayer = publicKey
        // Extract writable accounts
        const txAccounts = extractWritableAccounts(txCopy)
        // Add on compute unit limit + price instructions
        const optimizedTx = await buildOptimalTransactionFromConnection(
          txCopy,
          txAccounts,
          connection,
          chainId,
          publicKey,
          useHighPriority ? 'High' : undefined,
          process.env.REACT_APP_HELIUS_API_KEY,
        )
        signatureResult = await sendTransaction(optimizedTx, connection, {
          preflightCommitment: 'confirmed',
          skipPreflight: true,
        })
        setSignature(signatureResult)
        dispatch(setSolanaSignature(signatureResult))
        await connection.confirmTransaction({
          blockhash: optimizedTx.recentBlockhash!,
          lastValidBlockHeight: optimizedTx.lastValidBlockHeight!,
          signature: signatureResult,
        })
        const txResult = await connection.getParsedTransaction(
          signatureResult,
          'confirmed',
        )
        if (txResult?.meta?.err) {
          dispatch(
            setError({
              errorMessage:
                'Your transaction was confirmed but had errors. Please check the transaction details on the explorer for more information.',
            }),
          )
          return
        }
        handleSuccess({ signature: signatureResult })
      } catch (error: unknown) {
        console.log(error)

        let signatureStatusRetries = 0
        while (signatureStatusRetries < 5) {
          // Attempt to load the signature status using transaction history
          // eslint-disable-next-line no-await-in-loop
          await sleep(1000)
          // eslint-disable-next-line no-await-in-loop
          const result = await connection.getSignatureStatus(signatureResult, {
            searchTransactionHistory: true,
          })
          if (
            result?.value?.confirmationStatus === 'finalized' ||
            result?.value?.confirmationStatus === 'confirmed'
          ) {
            if (result?.value?.err) {
              dispatch(
                setError({
                  errorMessage:
                    'Your transaction was confirmed but had errors. Please check the transaction details on the explorer for more information.',
                }),
              )
              return
            }
            handleSuccess({ signature: signatureResult })
            return
          }

          signatureStatusRetries += 1
        }

        const err = error as Error
        if (err?.message?.includes('block height exceeded')) {
          // Allow the user to retry the transaction
          setShowRetryScreen(true)
        } else {
          dispatch(setError({ errorMessage: err?.message || '' }))
        }
      }
    }
    sendTx()
  }, [
    chainId,
    connection,
    dispatch,
    handleSuccess,
    publicKey,
    sendTransaction,
    signTransaction,
    tx,
    refreshCount,
    useHighPriority,
  ])

  const handleRetry = useCallback(
    (highPriority: boolean) => {
      console.log('handleRetry')
      setUseHighPriority(highPriority)
      setShowRetryScreen(false)
      refresh()
    },
    [refresh],
  )

  if (showRetryScreen) {
    return (
      <Box css={styles.wrapper}>
        <Box css={styles.sorry}>
          <img src={SorryImg} alt='sorry' />
        </Box>
        <Typography variant='h6'>Block Height Exceeded</Typography>
        <Box css={styles.content}>
          Your transaction was unable to be confirmed in time. This can happen
          when the network is congested. Please retry submitting your
          transaction or retry with a higher priority fee.
        </Box>
        <Box css={styles.bottomButtonGroup}>
          <Button
            variant='outlined'
            fullWidth
            onClick={() => handleRetry(false)}
          >
            RETRY
          </Button>
          <Button
            css={styles.retryHighPriorityButton}
            variant='contained'
            fullWidth
            onClick={() => handleRetry(true)}
          >
            RETRY (HIGH PRIORITY)
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <LoadingModal
      title='Transaction Pending'
      description='Waiting for confirmation...'
    >
      <SolanaViewOnExplorer chainId={chainId} signature={signature} />
    </LoadingModal>
  )
}
