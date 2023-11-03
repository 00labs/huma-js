import {
  openInNewTab,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
  useLenderApprovedV2,
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

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedTranche: TrancheType | undefined
  changeTranche: (tranche: TrancheType) => void
}

export function ChooseTranche({
  poolInfo,
  poolUnderlyingToken,
  selectedTranche,
  changeTranche,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const { poolName } = poolInfo
  const dispatch = useAppDispatch()
  const { account, chainId, provider } = useWeb3React()
  const [lenderApprovedSenior] = useLenderApprovedV2(
    poolName,
    'senior',
    account,
    chainId,
    provider,
  )
  const [lenderApprovedJunior] = useLenderApprovedV2(
    poolName,
    'junior',
    account,
    chainId,
    provider,
  )
  const isLoading =
    lenderApprovedSenior === undefined || lenderApprovedJunior === undefined

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
    if (
      (selectedTranche === 'senior' && lenderApprovedSenior) ||
      (selectedTranche === 'junior' && lenderApprovedJunior)
    ) {
      dispatch(setStep(WIDGET_STEP.ChooseAmount))
    } else if (poolInfo.KYC) {
      dispatch(setStep(WIDGET_STEP.Evaluation))
    } else if (poolInfo.supplyLink) {
      openInNewTab(poolInfo.supplyLink)
    }
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

  if (isLoading) {
    return <LoadingModal title={`Supply ${poolUnderlyingToken.symbol}`} />
  }

  return (
    <WrapperModal title={`Supply ${poolUnderlyingToken.symbol}`}>
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
