import { CampaignService, formatNumber } from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setError } from '../../../store/widgets.reducers'
import { BottomButton } from '../../BottomButton'
import {
  CheckIcon,
  CongratulationsIcon,
  HumaPointsIcon,
  RibbonIcon,
} from '../../icons'

type Props = {
  transactionHash: string
  lpConfig: { withdrawalLockoutPeriodInDays: number }
  handleAction: () => void
}

export function PointsEarned({
  transactionHash,
  lpConfig,
  handleAction,
}: Props): React.ReactElement {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const [pointAccumulated, setPointAccumulated] = useState<number | undefined>()
  const lockupMonths = lpConfig.withdrawalLockoutPeriodInDays / 30
  const stepNum = lockupMonths >= 6 ? 6 : lockupMonths
  const steps = Array.from(Array(stepNum).keys())
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateWalletPoints = async () => {
      try {
        const { pointAccumulated } = await CampaignService.updateWalletPoints(
          chainId!,
          account!,
          transactionHash,
        )
        setPointAccumulated(pointAccumulated)
      } catch (error) {
        dispatch(
          setError({
            errorMessage:
              'Failed to update wallet points. Be assured that your points will be added later.',
          }),
        )
      }
    }
    updateWalletPoints()
  }, [account, chainId, dispatch, transactionHash])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((pre) => (pre + 2 > 100 ? 100 : pre + 2))
    }, 40)
    return () => clearInterval(interval)
  }, [])

  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
    `,
    congrats: css`
      margin: ${theme.spacing(-4, -4.5, 0, -4.5)};
    `,
    ribbon: css`
      position: relative;
      ${theme.cssMixins.rowHCentered};
      font-family: 'Uni-Neue-Bold';
      margin-top: ${theme.spacing(-9)};
      color: #fbfbfc;
      font-size: 20px;
      line-height: 160%;
      letter-spacing: 0.15px;
    `,
    ribbonContent: css`
      ${theme.cssMixins.rowVCentered};
      position: absolute;
      top: ${theme.spacing(1)};

      svg {
        margin-right: ${theme.spacing(1)};
      }
    `,
    entirePoints: css`
      color: ${theme.palette.text.tertiary};
      text-align: center;
      font-family: 'Uni-Neue-Bold';
      font-size: 20px;
      line-height: 160%;
      letter-spacing: 0.15px;
      margin-top: ${theme.spacing(7)};
    `,
    entirePointsDetails: css`
      color: ${theme.palette.text.tertiary};
      text-align: center;
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      line-height: 150%;
      letter-spacing: 0.15px;
      margin-top: ${theme.spacing(1)};
    `,
    points: css`
      font-family: 'Uni-Neue-Bold';
    `,
    progress: css`
      width: 100%;
      margin-top: -42px;

      & > div {
        display: inline-block;
        transition: all 0.1s linear;
      }
    `,
    progressLeft: css`
      width: ${progress}%;
      height: 7px;
      background-color: #18dca1;
    `,
    progressRight: css`
      width: ${100 - progress}%;
      height: 7px;
      background-color: #d9d9d9;
    `,
    stepWrapper: css`
      margin-top: ${theme.spacing(7)};
    `,
    stepItemWrapper: css`
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
    `,
    stepItem: (index: number) => {
      const completed = progress >= (100 / (steps.length - 1)) * index
      return css`
        svg {
          width: 24px;
          height: 24px;

          circle {
            fill: ${completed ? '#18dca1' : '#d9d9d9'};
            transition: all 0.1s linear;
          }

          path {
            fill: #fff;
          }
        }
      `
    },
  }

  return (
    <Box css={styles.wrapper}>
      <Box css={styles.congrats}>
        <CongratulationsIcon />
      </Box>
      <Box css={styles.ribbon}>
        <RibbonIcon />
        <Box css={styles.ribbonContent}>
          <HumaPointsIcon />
          <Box>{formatNumber(pointAccumulated)} Points</Box>
        </Box>
      </Box>
      <Box css={styles.stepWrapper}>
        <Box css={styles.stepItemWrapper}>
          {steps.map((step, index) => (
            <Box css={styles.stepItem(index)} key={step}>
              <CheckIcon />
            </Box>
          ))}
        </Box>
        <Box css={styles.progress}>
          <Box css={styles.progressLeft} />
          <Box css={styles.progressRight} />
        </Box>
      </Box>
      <Box css={styles.entirePoints}>
        Entire {lockupMonths} months worth of points earned
      </Box>
      <Box css={styles.entirePointsDetails}>
        You have earned total{' '}
        <span css={styles.points}>{formatNumber(pointAccumulated)}</span> Human
        Points. If you keep your investment till after 3 months, you’ll gain
        extra points daily.
      </Box>
      <BottomButton variant='contained' onClick={handleAction}>
        GREAT
      </BottomButton>
    </Box>
  )
}
