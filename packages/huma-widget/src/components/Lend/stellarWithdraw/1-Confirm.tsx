import { StellarPoolInfo } from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import React from 'react'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: StellarPoolInfo
  withdrawableAmountFormatted: string
  onConfirm: () => void
}

export function Confirm({
  poolInfo,
  withdrawableAmountFormatted,
  onConfirm,
}: Props): React.ReactElement {
  const theme = useTheme()
  const { symbol } = poolInfo.underlyingToken

  const styles = {
    itemWrapper: css`
      margin-top: ${theme.spacing(9)};
      color: ${theme.palette.text.primary};
      font-weight: 400;
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
      font-weight: 700;
    `,
  }

  return (
    <WrapperModal
      title={`Withdraw ${symbol}`}
      subTitle='Withdraw all the available amount'
    >
      <Box css={styles.itemWrapper}>
        <Box css={styles.item}>
          <Box fontWeight={700}>Available to withdraw</Box>
          <Box css={styles.itemValue}>
            {withdrawableAmountFormatted} {symbol}
          </Box>
        </Box>
      </Box>
      <BottomButton variant='contained' onClick={onConfirm}>
        WITHDRAW
      </BottomButton>
    </WrapperModal>
  )
}
