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
import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { setError, setSolanaSignature } from '../store/widgets.reducers'
import { LoadingModal } from './LoadingModal'
import { SolanaViewOnExplorer } from './SolanaViewOnExplorer'
import { SorryImg } from './images'
import { selectWidgetLoggingContext } from '../store/widgets.selectors'

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
  const loggingHelper = useAppSelector(selectWidgetLoggingContext)
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

      try {
        // Optimize transaction
        // Make a copy of the tx so we can use the original tx for retries
        const txCopy = new Transaction()
        txCopy.instructions = [...tx.instructions]
        const txBlockhashData = await connection.getLatestBlockhash('confirmed')
        txCopy.recentBlockhash = txBlockhashData.blockhash
        txCopy.lastValidBlockHeight = txBlockhashData.lastValidBlockHeight
        txCopy.feePayer = publicKey
        // Extract writable accounts
        const txAccounts = extractWritableAccounts(txCopy)
        // Add on compute unit limit + price instructions
        const {
          tx: optimizedTx,
          unitsConsumed,
          fee,
        } = await buildOptimalTransactionFromConnection(
          txCopy,
          txAccounts,
          connection,
          chainId,
          publicKey,
          useHighPriority ? 'High' : undefined,
          import.meta.env.REACT_APP_HELIUS_API_KEY,
        )
        loggingHelper.logAction('SigningTransaction', {
          priorityFee: fee,
          computeUnitLimit: unitsConsumed,
          recentBlockhash: optimizedTx.recentBlockhash,
          lastValidBlockHeight: optimizedTx.lastValidBlockHeight,
        })
        const signedTx = await signTransaction(optimizedTx)
        loggingHelper.logAction('SendingTransaction', {})
        const signatureResult = await connection.sendRawTransaction(
          signedTx.serialize(),
          {
            preflightCommitment: 'confirmed',
            skipPreflight: true,
            maxRetries: 0,
          },
        )
        setSignature(signatureResult)
        dispatch(setSolanaSignature(signatureResult))

        // Loop and poll the transaction continuously until it is either confirmed or
        // the block height has been exceeded
        // eslint-disable-next-line no-constant-condition
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const result = await connection.getSignatureStatus(signatureResult, {
            searchTransactionHistory: true,
          })
          if (
            result?.value?.confirmationStatus === 'finalized' ||
            result?.value?.confirmationStatus === 'confirmed'
          ) {
            if (result?.value?.err) {
              loggingHelper.logAction('TransactionError', {
                signature: signatureResult,
              })
              dispatch(
                setError({
                  errorMessage:
                    'Your transaction was confirmed but had errors. Please check the transaction details on the explorer for more information.',
                }),
              )
              return
            }

            loggingHelper.logAction('TransactionSuccess', {
              signature: signatureResult,
            })
            handleSuccess({ signature: signatureResult })
            return
          }

          // eslint-disable-next-line no-await-in-loop
          const latestBlockheight = await connection.getBlockHeight('confirmed')
          if (latestBlockheight > optimizedTx.lastValidBlockHeight!) {
            loggingHelper.logAction('ShowRetryScreenDueToExpiration', {
              signature: signatureResult,
            })
            setShowRetryScreen(true)
            return
          }

          // eslint-disable-next-line no-await-in-loop
          await sleep(1000)
        }
      } catch (error: unknown) {
        console.log(error)

        const err = error as Error
        loggingHelper.logAction('UnknownError', { error: err?.message })
        loggingHelper.logError(err)
        dispatch(setError({ errorMessage: err?.message || '' }))
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
    loggingHelper,
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
