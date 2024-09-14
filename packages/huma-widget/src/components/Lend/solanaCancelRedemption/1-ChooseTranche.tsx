import { TrancheType } from '@huma-finance/shared'
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

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  selectedTranche: TrancheType | undefined
  changeTranche: (tranche: TrancheType) => void
}

export function ChooseTranche({
  selectedTranche,
  changeTranche,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const styles = {
    subTitle: css`
      color: ${theme.palette.text.primary} !important;
      font-weight: 400;
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
        font-weight: 400;
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
    value: TrancheType
  }[] = [
    {
      label: 'Senior',
      value: 'senior',
    },
    {
      label: 'Junior',
      value: 'junior',
    },
  ]

  return (
    <WrapperModal title='Cancel Redemption'>
      <FormControl>
        <FormLabel css={styles.subTitle}>Select Tranche Type</FormLabel>
        <RadioGroup
          aria-labelledby='buttons-group-label'
          name='radio-buttons-group'
          css={styles.radioGroup}
          onChange={(e) => changeTranche(e.target.value as TrancheType)}
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
        disabled={!selectedTranche}
        onClick={handleNext}
      >
        NEXT
      </BottomButton>
    </WrapperModal>
  )
}
