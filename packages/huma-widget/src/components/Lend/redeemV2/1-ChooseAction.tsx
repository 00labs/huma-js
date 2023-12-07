import { UnderlyingTokenInfo } from '@huma-finance/shared'
import {
  Box,
  css,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material'
import { BigNumber, ethers } from 'ethers'
import React from 'react'

import { REDEMPTION_TYPE, RedemptionInfo } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { LoadingModal } from '../../LoadingModal'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  seniorRedemptionInfo: RedemptionInfo | undefined
  juniorRedemptionInfo: RedemptionInfo | undefined
  redemptionType: REDEMPTION_TYPE | undefined
  seniorPosition: BigNumber | undefined
  juniorPosition: BigNumber | undefined
  changeRedemptionType: (tranche: REDEMPTION_TYPE) => void
}

export function ChooseAction({
  poolUnderlyingToken,
  seniorRedemptionInfo,
  juniorRedemptionInfo,
  redemptionType,
  seniorPosition,
  juniorPosition,
  changeRedemptionType,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { symbol } = poolUnderlyingToken
  const isLoading =
    seniorRedemptionInfo === undefined || juniorRedemptionInfo === undefined

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

  const formatAmount = (amount?: BigNumber) => {
    if (!amount || amount.lte(0)) {
      return undefined
    }
    return ethers.utils.formatUnits(amount, poolUnderlyingToken.decimals)
  }

  const items: {
    label: string
    value: REDEMPTION_TYPE
    amount?: string
    show: boolean
  }[] = [
    {
      label: 'Request Senior Tranche Redemption',
      value: REDEMPTION_TYPE.AddSeniorRedemption,
      show: seniorPosition?.gt(0) ?? false,
    },
    {
      label: 'Cancel Senior Tranche Redemption',
      value: REDEMPTION_TYPE.CancelSeniorRedemption,
      amount: formatAmount(seniorRedemptionInfo?.amount),
      show: seniorRedemptionInfo?.amount.gt(0) ?? false,
    },
    {
      label: 'Request Junior Tranche Redemption',
      value: REDEMPTION_TYPE.AddJuniorRedemption,
      show: juniorPosition?.gt(0) ?? false,
    },
    {
      label: 'Cancel Junior Tranche Redemption',
      value: REDEMPTION_TYPE.CancelJuniorRedemption,
      amount: formatAmount(juniorRedemptionInfo?.amount),
      show: juniorRedemptionInfo?.amount.gt(0) ?? false,
    },
  ]

  if (isLoading) {
    return <LoadingModal title={`Redeem ${symbol}`} />
  }

  return (
    <WrapperModal title={`Redeem ${symbol}`}>
      <FormControl>
        <FormLabel css={styles.subTitle}>Select Redemption Type</FormLabel>
        <RadioGroup
          aria-labelledby='buttons-group-label'
          name='radio-buttons-group'
          css={styles.radioGroup}
          onChange={(e) => changeRedemptionType(Number(e.target.value))}
        >
          {items
            .filter((item) => item.show)
            .map((item) => {
              const { label } = item
              let labelNode = <Box>{label}</Box>
              if (item.amount) {
                labelNode = (
                  <>
                    <Box>{label}</Box>
                    <Box>
                      ({item.amount} {symbol} available)
                    </Box>
                  </>
                )
              }
              return (
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
                  label={labelNode}
                  css={styles.formControl}
                />
              )
            })}
        </RadioGroup>
      </FormControl>
      <BottomButton
        variant='contained'
        disabled={redemptionType === undefined}
        onClick={handleNext}
      >
        NEXT
      </BottomButton>
    </WrapperModal>
  )
}
