import {
  PoolInfoV2,
  timestampToLL,
  UnderlyingTokenInfo,
  useLenderDepositRecordV2,
  useLPConfigV2,
  useNextEpochStartTimeV2,
} from '@huma-finance/shared'
import {
  css,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React from 'react'

import { ActionType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setError, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { LoadingModal } from '../../LoadingModal'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedActionType: ActionType | undefined
  actionTypes: ActionType[]
  changeActionType: (ActionType: ActionType) => void
}

export function ChooseAction({
  poolInfo,
  poolUnderlyingToken,
  selectedActionType,
  actionTypes,
  changeActionType,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { symbol } = poolUnderlyingToken
  const { account, provider } = useWeb3React()
  const [seniorDepositRecord] = useLenderDepositRecordV2(
    poolInfo.poolName,
    'senior',
    account,
    provider,
  )
  const [juniorDepositRecord] = useLenderDepositRecordV2(
    poolInfo.poolName,
    'junior',
    account,
    provider,
  )
  const lpConfig = useLPConfigV2(poolInfo.poolName, provider)
  const nextEpochStartTime = useNextEpochStartTimeV2(
    poolInfo.poolName,
    provider,
  )

  const isLoading = lpConfig === undefined || nextEpochStartTime === undefined

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
    if (selectedActionType!.action === 'cancelRedemption') {
      const depositRecord =
        selectedActionType!.value === 'senior'
          ? seniorDepositRecord
          : juniorDepositRecord

      const SECONDS_IN_A_DAY = 24 * 60 * 60
      if (
        nextEpochStartTime! <
        depositRecord!.lastDepositTime.toNumber() +
          lpConfig!.withdrawalLockoutPeriodInDays * SECONDS_IN_A_DAY
      ) {
        dispatch(setStep(WIDGET_STEP.Error))
        dispatch(
          setError({
            errorReason: 'Redemption request too soon',
            errorMessage: `Your last deposit was on ${timestampToLL(
              depositRecord!.lastDepositTime.toNumber(),
            )}. Depositors need to wait ${
              lpConfig!.withdrawalLockoutPeriodInDays
            } days before redemption request`,
          }),
        )
        return
      }
    }

    if (
      selectedActionType!.action === 'withdraw' &&
      ['senior', 'junior'].includes(selectedActionType!.type)
    ) {
      dispatch(setStep(WIDGET_STEP.Transfer))
    } else {
      dispatch(setStep(WIDGET_STEP.ChooseAmount))
    }
  }

  const handleChangeActionType = (actionTypeValue: string | number) => {
    const actionType = actionTypes.find(
      (item) => item.value === actionTypeValue,
    )
    if (actionType) {
      changeActionType(actionType)
    }
  }

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
          onChange={(e) => handleChangeActionType(e.target.value)}
        >
          {actionTypes.map((item) => (
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
        disabled={!selectedActionType}
        onClick={handleNext}
      >
        NEXT
      </BottomButton>
    </WrapperModal>
  )
}
