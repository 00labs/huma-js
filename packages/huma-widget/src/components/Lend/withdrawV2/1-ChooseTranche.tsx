import {
  formatBNFixed,
  getTrancheVaultContractV2,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
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
import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { LoadingModal } from '../../LoadingModal'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedTranche: TrancheType | undefined
  seniorWithdrawableAmount: BigNumber | undefined
  juniorWithdrawableAmount: BigNumber | undefined
  changeTranche: (tranche: TrancheType) => void
}

export function ChooseTranche({
  poolInfo,
  poolUnderlyingToken,
  selectedTranche,
  seniorWithdrawableAmount,
  juniorWithdrawableAmount,
  changeTranche,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken
  const [seniorWithdrawableShares, setSeniorWithdrawableShares] = useState(
    BigNumber.from(0),
  )
  const [juniorWithdrawableShares, setJuniorWithdrawableShares] = useState(
    BigNumber.from(0),
  )

  const isLoading =
    seniorWithdrawableAmount === undefined ||
    juniorWithdrawableAmount === undefined

  useEffect(() => {
    const fetchData = async () => {
      if (seniorWithdrawableAmount?.gt(0)) {
        const seniorVaultContract = await getTrancheVaultContractV2(
          poolInfo.poolName,
          'senior',
          provider,
        )
        if (seniorVaultContract) {
          const shares = await seniorVaultContract.convertToShares(
            seniorWithdrawableAmount,
          )
          setSeniorWithdrawableShares(shares)
        }
      }
    }
    fetchData()
  }, [poolInfo.poolName, provider, seniorWithdrawableAmount])

  useEffect(() => {
    const fetchData = async () => {
      if (juniorWithdrawableAmount?.gt(0)) {
        const juniorVaultContract = await getTrancheVaultContractV2(
          poolInfo.poolName,
          'senior',
          provider,
        )
        if (juniorVaultContract) {
          const shares = await juniorVaultContract.convertToShares(
            juniorWithdrawableAmount,
          )
          setJuniorWithdrawableShares(shares)
        }
      }
    }
    fetchData()
  }, [poolInfo.poolName, provider, juniorWithdrawableAmount])

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
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  const items: {
    label: string
    value: TrancheType
    disabled: boolean | undefined
  }[] = [
    {
      label: `Withdraw ${formatBNFixed(
        seniorWithdrawableAmount,
        decimals,
      )} ${symbol} from Senior vault (${formatBNFixed(
        seniorWithdrawableShares,
        decimals,
      )} shares)`,
      value: 'senior',
      disabled: seniorWithdrawableAmount?.lte(0) ?? true,
    },
    {
      label: `Withdraw ${formatBNFixed(
        juniorWithdrawableAmount,
        decimals,
      )} ${symbol} from Junior vault (${formatBNFixed(
        juniorWithdrawableShares,
        decimals,
      )} shares)`,
      value: 'junior',
      disabled: juniorWithdrawableAmount?.lte(0) ?? true,
    },
  ]

  if (isLoading) {
    return <LoadingModal title={`Withdraw ${symbol}`} />
  }

  return (
    <WrapperModal title={`Withdraw ${symbol}`}>
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
              disabled={item.disabled}
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
