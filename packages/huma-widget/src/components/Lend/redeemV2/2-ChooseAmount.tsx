import {
  formatMoney,
  getTrancheVaultContractV2,
  PoolInfoV2,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { Box, css, Slider, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { REDEMPTION_TYPE, RedemptionActionInfo } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import {
  setRedeemAmount,
  setRedeemShares,
  setStep,
} from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { LoadingModal } from '../../LoadingModal'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  redemptionType: REDEMPTION_TYPE
  maxAmount: BigNumber
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  redemptionType,
  maxAmount,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { provider } = useWeb3React()
  const { symbol } = poolUnderlyingToken
  const [sharePrice, setSharePrice] = useState(0)
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const [currentShares, setCurrentShares] = useState<number>(0)
  const redemptionActionInfo = RedemptionActionInfo[redemptionType]
  const maxAmountFormatted = ethers.utils.formatUnits(
    maxAmount,
    poolUnderlyingToken.decimals,
  )

  useEffect(() => {
    if (maxAmount.gt(0)) {
      const fetchData = async () => {
        const vaultContract = await getTrancheVaultContractV2(
          poolInfo.poolName,
          redemptionActionInfo.tranche,
          provider,
        )
        if (vaultContract) {
          const shares = await vaultContract.convertToShares(maxAmount)
          const price = maxAmount.div(shares)
          setSharePrice(price.toNumber())
        }
      }
      fetchData()
    }
  }, [maxAmount, poolInfo.poolName, provider, redemptionActionInfo.tranche])

  const styles = {
    sliderWrapper: css`
      margin-bottom: ${theme.spacing(1)};
      margin-top: ${theme.spacing(14)};
    `,
    currentAmount: css`
      font-size: 32px;
      font-family: 'Uni-Neue-Bold';
      text-align: center;
      background: linear-gradient(233deg, #b246ff 4.17%, #ff6a8a 178.69%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `,
    slider: css`
      &.MuiSlider-root {
        height: 8px !important;
        color: #e9e9e9;
      }
      & .MuiSlider-track {
        height: 8px !important;
        background: linear-gradient(232.71deg, #a363f4 4.17%, #ff6a8a 178.69%);
        border-radius: 8px;
      }
      & .MuiSlider-thumb::before {
        background: #ffffff;
        border: 1px solid #f9f9f9;
        box-shadow: 1px 1px 12px 2px rgba(163, 100, 244, 0.6);
        border-radius: 50px;
        width: 24px;
        height: 24px;
      }
    `,
    shares: css`
      color: ${theme.palette.text.primary};
      font-family: 'Uni-Neue-Bold';
      font-size: 20px;
      line-height: 160%;
      letter-spacing: 0.15px;
    `,
  }

  const handleChangeAmount = (event: Event, newAmount: number | number[]) => {
    const shares = Number(newAmount) / sharePrice
    setCurrentShares(shares)
    setCurrentAmount(Number(newAmount))
    dispatch(setRedeemAmount(Number(newAmount)))
    dispatch(setRedeemShares(shares))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  if (sharePrice === 0) {
    return (
      <LoadingModal
        title={`${redemptionActionInfo.action} Redemption Request`}
      />
    )
  }

  return (
    <WrapperModal
      title={redemptionActionInfo.action}
      subTitle={
        redemptionActionInfo.action === 'Create'
          ? `Select ${symbol} amount to redeem from ${redemptionActionInfo.tranche} tranche}`
          : `Cancel ${symbol} amount from ${redemptionActionInfo.tranche} tranche redemption request`
      }
    >
      <Box css={styles.sliderWrapper}>
        <Box css={styles.currentAmount}>
          {formatMoney(currentAmount)} {poolUnderlyingToken.symbol}
        </Box>
        <Slider
          max={Number(maxAmountFormatted)}
          min={0}
          css={styles.slider}
          aria-label='Amount'
          value={currentAmount}
          onChange={handleChangeAmount}
        />
        <Box css={styles.shares}>{currentShares.toFixed(1)} Shares</Box>
      </Box>
      <BottomButton
        variant='contained'
        onClick={handleAction}
        disabled={Number(currentAmount) <= 0}
      >
        SUBMIT
      </BottomButton>
    </WrapperModal>
  )
}
