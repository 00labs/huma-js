import { UnderlyingTokenInfo } from '@huma-finance/shared'
import { Box, css, Input, useTheme } from '@mui/material'
import React, { useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setWithdrawAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
}

export function ChooseAmount({
  poolUnderlyingToken,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { symbol } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const [inputTouched, setInputTouched] = useState(false)

  const styles = {
    inputAmountWrapper: css`
      margin-bottom: ${theme.spacing(1)};
      margin-top: ${theme.spacing(4)};
    `,
    inputAmount: css`
      ${theme.cssMixins.rowSpaceBetweened};
    `,
    inputField: css`
      width: 100%;
      color: ${theme.palette.text.primary};
      font-family: 'Uni-Neue-Black';
      font-size: 40px;
      line-height: 133.4%;
    `,
  }

  const handleChangeAmount = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInputTouched(true)
    const newAmount = event.target.value
    setCurrentAmount(newAmount)
    dispatch(setWithdrawAmount(Number(newAmount)))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  return (
    <WrapperModal title={`Withdraw ${symbol}`}>
      <Box css={styles.inputAmountWrapper}>
        <Box css={styles.inputAmount}>
          <Input
            css={styles.inputField}
            type='number'
            value={!inputTouched && currentAmount === 0 ? '' : currentAmount}
            onChange={handleChangeAmount}
            placeholder='0'
            endAdornment={symbol}
          />
          {/* TODO Max limit check */}
        </Box>
      </Box>
      <BottomButton
        variant='contained'
        onClick={handleAction}
        disabled={Number(currentAmount) <= 0}
      >
        WITHDRAW
      </BottomButton>
    </WrapperModal>
  )
}
