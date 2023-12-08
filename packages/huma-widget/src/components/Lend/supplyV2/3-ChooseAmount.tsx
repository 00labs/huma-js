import {
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
  usePoolSafeAllowanceV2,
} from '@huma-finance/shared'
import { Box, css, TextField, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { NumericFormatCustom } from '../../NumericFormatCustom'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedTranche: TrancheType | undefined
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  selectedTranche,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const { allowance = BigNumber.from(0) } = usePoolSafeAllowanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const [inputTouched, setInputTouched] = useState(false)

  const styles = {
    inputAmountWrapper: css`
      margin-bottom: ${theme.spacing(1)};
      margin-top: ${theme.spacing(16)};
    `,
    inputAmount: css`
      ${theme.cssMixins.rowSpaceBetweened};
    `,
    inputField: css`
      input {
        width: 100%;
        color: ${theme.palette.text.primary};
        font-family: 'Uni-Neue-Black';
        font-size: 40px;
        line-height: 133.4%;
      }
    `,
    inputFieldSymbol: css`
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
    dispatch(setSupplyAmount(Number(newAmount)))
  }

  const handleAction = () => {
    const currentAmountBN = ethers.utils.parseUnits(
      String(currentAmount),
      decimals,
    )
    const step = currentAmountBN.gt(allowance)
      ? WIDGET_STEP.ApproveAllowance
      : WIDGET_STEP.Transfer
    dispatch(setStep(step))
  }

  return (
    <WrapperModal
      title='Enter Amount'
      subTitle={`Supplying ${symbol} with ${selectedTranche}`}
    >
      <Box css={styles.inputAmountWrapper}>
        <Box css={styles.inputAmount}>
          <TextField
            css={styles.inputField}
            value={!inputTouched && currentAmount === 0 ? '' : currentAmount}
            onChange={handleChangeAmount}
            InputProps={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              inputComponent: NumericFormatCustom as any,
              endAdornment: (
                <Box component='span' css={styles.inputFieldSymbol}>
                  {symbol}
                </Box>
              ),
            }}
            placeholder='0'
            variant='standard'
          />
        </Box>
      </Box>

      <BottomButton
        variant='contained'
        onClick={handleAction}
        disabled={Number(currentAmount) <= 0}
      >
        SUPPLY
      </BottomButton>
    </WrapperModal>
  )
}
