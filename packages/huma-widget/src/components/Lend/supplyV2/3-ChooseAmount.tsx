import {
  PoolInfoV2,
  TrancheType,
  usePoolSafeAllowanceV2,
} from '@huma-finance/shared'
import { Box, css, Input, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  selectedTranche: TrancheType | undefined
}

export function ChooseAmount({
  poolInfo,
  selectedTranche,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { account, chainId, provider } = useWeb3React()
  const { poolUnderlyingToken } = poolInfo
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const [allowance] = usePoolSafeAllowanceV2(
    poolInfo.poolName,
    account,
    chainId,
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
          <Input
            css={styles.inputField}
            type='number'
            value={!inputTouched && currentAmount === 0 ? '' : currentAmount}
            onChange={handleChangeAmount}
            placeholder='0'
            endAdornment={symbol}
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
