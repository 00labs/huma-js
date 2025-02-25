import { STELLAR_CHAINS_INFO, StellarPoolInfo } from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { Client as Sep41TokenClient } from '@huma-finance/soroban-sep41'
import React, { useCallback, useContext, useState } from 'react'

import { rpc, xdr } from '@stellar/stellar-sdk'
import {
  fetchStellarPoolSentinel,
  getClientCommonParams,
  StellarConnectionContext,
} from '@huma-finance/web-shared'
import { WrapperModal } from '../../WrapperModal'
import { AutoPaybackImg } from '../../images'
import { BottomButton } from '../../BottomButton'
import { StellarTxSendModal } from '../../StellarTxSendModal'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { setStep } from '../../../store/widgets.reducers'
import { useAppDispatch } from '../../../hooks/useRedux'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: StellarPoolInfo
}

export function ApproveAllowance({
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const { symbol, decimals } = poolInfo.underlyingToken
  const [tx, setTx] = useState<xdr.Transaction | null>(null)
  const [loadingTx, setLoadingTx] = useState(false)

  const styles = {
    iconWrapper: css`
      ${theme.cssMixins.rowCentered};
      margin-top: ${theme.spacing(6)};
      & > img {
        width: 220px;
      }
    `,
    description: css`
      margin-top: ${theme.spacing(4)};
      font-weight: 400;
      font-size: 16px;
      color: ${theme.palette.text.secondary};
      padding: ${theme.spacing(0, 1)};
    `,
  }

  const handleSuccess = useCallback(async () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  const sendIncreaseAllowance = useCallback(async () => {
    if (!stellarAddress) {
      return
    }
    setLoadingTx(true)

    const sentinelAddress = await fetchStellarPoolSentinel(
      poolInfo,
      stellarAddress,
    )

    const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
    const server = new rpc.Server(chainMetadata.rpc, {
      allowHttp: true,
    })
    const latestLedger = await server.getLatestLedger()
    const advanceLedgerNum = 3_000_000

    const client = new Sep41TokenClient({
      publicKey: stellarAddress,
      contractId: poolInfo.underlyingToken.address,
      ...getClientCommonParams(chainMetadata, stellarAddress),
    })
    const tx = await client.approve({
      from: stellarAddress,
      spender: sentinelAddress,
      amount: BigInt(1_000_000_000) * BigInt(10) ** BigInt(decimals),
      expiration_ledger: latestLedger.sequence + advanceLedgerNum,
    })
    setTx(tx)
    setLoadingTx(false)
  }, [decimals, poolInfo, stellarAddress])

  if (loadingTx) {
    return (
      <LoadingModal
        title='Generating Approval Transaction'
        description='Loading...'
      />
    )
  }

  if (!tx) {
    return (
      <WrapperModal
        title='Auto Payback'
        subTitle='Approve token allowance to enable autopayments.'
      >
        <Box css={styles.iconWrapper}>
          <img src={AutoPaybackImg} alt='auto-payback' />
        </Box>
        <Box css={styles.description}>
          This allowance transaction allows our automation to make minimum
          payments automatically on your behalf.
        </Box>
        <BottomButton variant='contained' onClick={sendIncreaseAllowance}>
          APPROVE {symbol} PAYMENTS
        </BottomButton>
      </WrapperModal>
    )
  }

  return <StellarTxSendModal tx={tx} handleSuccess={handleSuccess} />
}
