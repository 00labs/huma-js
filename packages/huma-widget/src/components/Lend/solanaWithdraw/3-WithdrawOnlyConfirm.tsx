import { UnderlyingTokenInfo } from '@huma-finance/shared'
import { Box, Divider, css, useTheme } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  withdrawableAmountFormatted: string | number
  sharePrice: number
}

export function WithdrawOnlyConfirm({
  poolUnderlyingToken,
  withdrawableAmountFormatted,
  sharePrice,
}: Props): React.ReactElement {
  useLogOnFirstMount('ConfirmTransfer')
  const theme = useTheme()
  const dispatch = useDispatch()
  const { symbol } = poolUnderlyingToken

  const goToWithdraw = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

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
    divider: css`
      border-color: ${theme.palette.divider};
      margin-bottom: ${theme.spacing(3)};
    `,
  }

  return (
    <WrapperModal
      title={`Withdraw ${symbol}`}
      subTitle='Withdraw all the available amount'
    >
      <Box css={styles.itemWrapper}>
        {sharePrice !== 0 && (
          <>
            <Box css={styles.item}>
              <Box>Price Per Share</Box>
              <Box css={styles.itemValue}>
                {sharePrice.toFixed(1)} {symbol}
              </Box>
            </Box>
            <Divider css={styles.divider} orientation='horizontal' />
          </>
        )}
        <Box css={styles.item}>
          <Box fontWeight={700}>Available to withdraw</Box>
          <Box css={styles.itemValue}>
            {withdrawableAmountFormatted} {symbol}
          </Box>
        </Box>
      </Box>
      <BottomButton variant='contained' onClick={goToWithdraw}>
        WITHDRAW
      </BottomButton>
    </WrapperModal>
  )
}
