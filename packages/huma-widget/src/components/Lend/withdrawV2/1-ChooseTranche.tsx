import { UnderlyingTokenInfo } from '@huma-finance/shared'
import {
  css,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material'
import React from 'react'

import { WithdrawType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedWithdrawType: WithdrawType | undefined
  withdrawTypes: WithdrawType[]
  changeWithdrawType: (WithdrawType: WithdrawType) => void
}

export function ChooseTranche({
  poolUnderlyingToken,
  selectedWithdrawType,
  withdrawTypes,
  changeWithdrawType,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { symbol } = poolUnderlyingToken

  const styles = {
    subTitle: css`
      color: ${theme.palette.text.primary} !important;
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      line-height: 150%;
      letter-spacing: 0.15px;
      margin-top: ${theme.spacing(5)};
      margin-left: ${theme.spacing(2)};
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

  const handleChangeWithdrawType = (withdrawTypeValue: string | number) => {
    const withdrawType = withdrawTypes.find(
      (item) => item.value === withdrawTypeValue,
    )
    if (withdrawType) {
      changeWithdrawType(withdrawType)
    }
  }

  const handleNext = () => {
    if (selectedWithdrawType?.type === 'firstLossCover') {
      dispatch(setStep(WIDGET_STEP.ChooseAmount))
    } else {
      dispatch(setStep(WIDGET_STEP.Transfer))
    }
  }

  return (
    <WrapperModal title={`Withdraw ${symbol}`}>
      <FormControl>
        <FormLabel css={styles.subTitle}>Select Withdraw Type</FormLabel>
        <RadioGroup
          aria-labelledby='buttons-group-label'
          name='radio-buttons-group'
          css={styles.radioGroup}
          onChange={(e) => handleChangeWithdrawType(e.target.value)}
        >
          {withdrawTypes.map((item) => (
            <FormControlLabel
              key={item.label}
              value={item.value}
              control={
                <Radio
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                    },
                  }}
                />
              }
              label={item.label}
              css={styles.formControl}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <BottomButton
        variant='contained'
        disabled={!selectedWithdrawType}
        onClick={handleNext}
      >
        NEXT
      </BottomButton>
    </WrapperModal>
  )
}
