import {
  CloseModalOptions,
  FEATHERS_TO_HUMA_RATIO,
  formatNumber,
  isEmpty,
} from '@huma-finance/shared'
import { txAtom } from '@huma-finance/web-shared'
import { Box, css, useTheme } from '@mui/material'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../hooks/useRedux'
import { resetState } from '../store/widgets.reducers'
import { selectWidgetState } from '../store/widgets.selectors'
import { BottomButton } from './BottomButton'
import { CongratulationsIcon, HumaPointsIcon, RibbonIcon } from './icons'

type Props = {
  lpConfig: { withdrawalLockupPeriodDays?: number }
  handleAction: (options?: CloseModalOptions) => void
}

export function PointsEarned({
  lpConfig,
  handleAction,
}: Props): React.ReactElement {
  const theme = useTheme()
  const dispatch = useDispatch()
  const reset = useResetAtom(txAtom)
  const { pointsAccumulated } = useAppSelector(selectWidgetState)
  const hasPointsAccumulated =
    !isEmpty(pointsAccumulated) && pointsAccumulated! > 0
  const lockupMonths = Math.round(
    (lpConfig.withdrawalLockupPeriodDays ?? 0) / 30,
  )
  const monthText =
    lockupMonths > 1 ? `${lockupMonths} months` : `${lockupMonths} month`

  const rewardsAccumulated = pointsAccumulated
    ? pointsAccumulated / FEATHERS_TO_HUMA_RATIO
    : undefined

  const handleCloseModal = useCallback(() => {
    reset()
    dispatch(resetState())
    handleAction({ isSuccess: true })
  }, [dispatch, handleAction, reset])

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
      font-weight: 700;
      margin-top: ${theme.spacing(-8)};
      color: ${theme.palette.text.primary};
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
      font-weight: 700;
      font-size: 20px;
      line-height: 160%;
      letter-spacing: 0.15px;
      margin-top: ${theme.spacing(7)};
    `,
    entirePointsDetails: css`
      color: ${theme.palette.text.tertiary};
      text-align: center;
      font-weight: 400;
      font-size: 16px;
      line-height: 150%;
      letter-spacing: 0.15px;
      margin-top: ${theme.spacing(4)};
    `,
    everyday: css`
      font-weight: 700;
    `,
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
          <Box>
            {hasPointsAccumulated
              ? `${formatNumber(rewardsAccumulated)} $HUMA`
              : 'Rewards earned'}
          </Box>
        </Box>
      </Box>
      <Box css={styles.entirePoints}>
        {hasPointsAccumulated ? (
          <>
            <Box>Congratulations,</Box>
            <Box>you've earned {rewardsAccumulated} $HUMA</Box>
          </>
        ) : (
          <Box>Congratulations on joining the Huma Protocol!</Box>
        )}
      </Box>
      <Box css={styles.entirePointsDetails}>
        You'll earn rewards <span css={styles.everyday}>everyday</span> for{' '}
        {monthText} straight.
      </Box>
      <BottomButton variant='contained' onClick={handleCloseModal}>
        GREAT
      </BottomButton>
    </Box>
  )
}
