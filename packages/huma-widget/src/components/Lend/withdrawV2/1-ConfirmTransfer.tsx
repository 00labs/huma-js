import {
  PoolInfoV2,
  TrancheRedemptionStatus,
  TrancheType,
  UnderlyingTokenInfo,
  formatAmount,
  getTrancheVaultContractV2,
} from '@huma-finance/shared'
import { Box, Divider, css, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useWeb3React } from '@web3-react/core'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  tranche: TrancheType
  poolUnderlyingToken: UnderlyingTokenInfo
  redemptionStatus: TrancheRedemptionStatus
  poolIsClosed: boolean
}

export function ConfirmTransfer({
  poolInfo,
  tranche,
  poolUnderlyingToken,
  redemptionStatus,
  poolIsClosed,
}: Props): React.ReactElement {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken
  const { lenderRedemptionRecords, cancellableRedemptionShares } =
    redemptionStatus
  const { numSharesRequested } = lenderRedemptionRecords
  const sharesProcessed = formatAmount(
    numSharesRequested.sub(cancellableRedemptionShares),
    decimals,
  )
  const withdrawableAmount = formatAmount(
    redemptionStatus.withdrawableAssets,
    decimals,
  )
  const [sharePrice, setSharePrice] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const vaultContract = await getTrancheVaultContractV2(
        poolInfo.poolName,
        tranche,
        provider,
      )
      if (vaultContract) {
        const shares = await vaultContract.convertToShares(
          redemptionStatus.withdrawableAssets,
        )
        setSharePrice(
          redemptionStatus.withdrawableAssets.toNumber() / shares.toNumber(),
        )
      }
    }
    fetchData()
  }, [
    poolInfo.poolName,
    provider,
    redemptionStatus.withdrawableAssets,
    tranche,
  ])

  const goToWithdraw = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  const styles = {
    itemWrapper: css`
      margin-top: ${theme.spacing(9)};
      color: ${theme.palette.text.primary};
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      line-height: 175%;
      letter-spacing: 0.15px;
    `,
    item: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${theme.spacing(3)};
    `,
    itemValue: css`
      font-size: 20px;
      font-family: 'Uni-Neue-Bold';
    `,
    divider: css`
      border-color: #eae6f0;
      margin-bottom: ${theme.spacing(3)};
    `,
  }

  return (
    <WrapperModal
      title={`Withdraw ${symbol}`}
      subTitle='Withdraw all the available amount'
    >
      <Box css={styles.itemWrapper}>
        {!poolIsClosed && (
          <Box css={styles.item}>
            <Box>Shares processed</Box>
            <Box css={styles.itemValue}>{sharesProcessed}</Box>
          </Box>
        )}
        <Box css={styles.item}>
          <Box>Price Per Share</Box>
          <Box css={styles.itemValue}>
            {sharePrice.toFixed(1)} {symbol}
          </Box>
        </Box>
        <Divider css={styles.divider} orientation='horizontal' />
        <Box css={styles.item}>
          <Box fontWeight={700}>Available to withdraw</Box>
          <Box css={styles.itemValue}>
            {withdrawableAmount} {symbol}
          </Box>
        </Box>
      </Box>
      <BottomButton variant='contained' onClick={goToWithdraw}>
        WITHDRAW
      </BottomButton>
    </WrapperModal>
  )
}
