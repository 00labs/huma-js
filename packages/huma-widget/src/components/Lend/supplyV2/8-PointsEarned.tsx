import { CampaignService, formatNumber } from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setError } from '../../../store/widgets.reducers'
import { BottomButton } from '../../BottomButton'
import { CongratulationsIcon, HumaPointsIcon, RibbonIcon } from '../../icons'
import { LoadingModal } from '../../LoadingModal'

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
  const [pointsAccumulated, setPointsAccumulated] = useState<
    number | undefined
  >()
  const lockupMonths = lpConfig.withdrawalLockoutPeriodInDays / 30
  const monthText =
    lockupMonths > 1 ? `${lockupMonths} months` : `${lockupMonths} month`
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const updateWalletPoints = async () => {
      const setErrorMessage = () => {
        dispatch(
          setError({
            errorMessage:
              'Failed to update wallet points. Be assured that your points will be added later.',
          }),
        )
      }

      try {
        setLoading(true)
        const result = await CampaignService.updateWalletPoints(
          chainId!,
          account!,
          transactionHash,
        )
        if (!result.pointsAccumulated) {
          setErrorMessage()
        }
        setPointsAccumulated(result.pointsAccumulated)
      } catch (error) {
        setErrorMessage()
      } finally {
        setLoading(false)
      }
    }
    updateWalletPoints()
  }, [account, chainId, dispatch, transactionHash])

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
      margin-top: ${theme.spacing(-8)};
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
      margin-top: ${theme.spacing(4)};
    `,
    everyday: css`
      font-family: 'Uni-Neue-Bold';
    `,
  }

  if (loading) {
    return <LoadingModal title='SUPPLY' />
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
          <Box>{formatNumber(pointsAccumulated)} Points</Box>
        </Box>
      </Box>
      <Box css={styles.entirePoints}>
        <Box>Congratulations,</Box>
        <Box>you've earned {pointsAccumulated} points</Box>
      </Box>
      <Box css={styles.entirePointsDetails}>
        You'll earn points <span css={styles.everyday}>everyday</span> for{' '}
        {monthText} straight. Plus, If you keep your investment till after{' '}
        {monthText}, you’ll gain extra points daily.
      </Box>
      <BottomButton variant='contained' onClick={handleAction}>
        GREAT
      </BottomButton>
    </Box>
  )
}
