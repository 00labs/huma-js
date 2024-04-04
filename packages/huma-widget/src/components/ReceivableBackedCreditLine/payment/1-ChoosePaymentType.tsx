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

import { PaymentType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  paymentType: PaymentType | undefined
  changePaymentType: (paymentType: PaymentType) => void
}

export function ChoosePaymentType({
  paymentType,
  changePaymentType,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()

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

  const handleNext = () => {
    dispatch(setStep(WIDGET_STEP.ChooseAmount))
  }

  const items: {
    label: string
    value: PaymentType
  }[] = [
    {
      label: 'Payment with Receivable',
      value: PaymentType.PaymentWithReceivable,
    },
    {
      label: 'Payment with Receivable and Drawdown',
      value: PaymentType.PaymentWithReceivableAndDrawdown,
    },
  ]

  return (
    <WrapperModal title='Pay'>
      <FormControl>
        <FormLabel css={styles.subTitle}>Select Payment Type</FormLabel>
        <RadioGroup
          aria-labelledby='buttons-group-label'
          name='radio-buttons-group'
          css={styles.radioGroup}
          onChange={(e) =>
            changePaymentType(Number(e.target.value) as PaymentType)
          }
        >
          {items.map((item) => (
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
        disabled={paymentType === undefined}
        onClick={handleNext}
      >
        NEXT
      </BottomButton>
    </WrapperModal>
  )
}
