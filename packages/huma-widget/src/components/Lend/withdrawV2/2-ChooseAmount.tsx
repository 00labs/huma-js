import { UnderlyingTokenInfo } from '@huma-finance/shared'
import {
  Box,
  css,
  FormControl,
  FormControlLabel,
  Input,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material'
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
    radioGroup: css`
      margin-left: ${theme.spacing(3)};
      margin-top: ${theme.spacing(3)};
    `,
    formControl: css`
      margin-bottom: ${theme.spacing(1)};

      .MuiFormControlLabel-label {
        color: ${theme.palette.text.primary};
        font-family: 'Uni-Neue-Regular';
        font-size: 16px;
        line-height: 150%;
        letter-spacing: 0.15px;
      }
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
    <WrapperModal title='Withdraw' subTitle='Choose withdraw type'>
      <FormControl>
        <RadioGroup
          aria-labelledby='buttons-group-label'
          name='radio-buttons-group'
          css={styles.radioGroup}
          onChange={() => {}}
        >
          <FormControlLabel
            control={
              <Radio
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 24,
                  },
                }}
              />
            }
            label='Principal + Interest'
            css={styles.formControl}
          />
          {/* TODO: Interest only */}
        </RadioGroup>
      </FormControl>
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
