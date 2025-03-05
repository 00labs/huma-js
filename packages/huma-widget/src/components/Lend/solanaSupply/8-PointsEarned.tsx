import {
  CampaignService,
  CHAIN_TYPE,
  CloseModalOptions,
  formatNumber,
  isEmpty,
  NETWORK_TYPE,
} from '@huma-finance/shared'
import {
  SolanaPoolState,
  txAtom,
  useChainInfo,
  checkIsDev,
} from '@huma-finance/web-shared'
import { Box, css, useTheme } from '@mui/material'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { resetState } from '../../../store/widgets.reducers'
import { BottomButton } from '../../BottomButton'
import { CongratulationsIcon, HumaPointsIcon, RibbonIcon } from '../../icons'
import { LoadingModal } from '../../LoadingModal'
import { SignIn } from '../../SignIn'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'

enum STATE {
  Loading = 'Loading',
  SignIn = 'SignIn',
  Congrats = 'Congrats',
}

type Props = {
  transactionHash: string
  poolState: SolanaPoolState
  networkType: NETWORK_TYPE
  handleAction: (options?: CloseModalOptions) => void
}

export function PointsEarned({
  transactionHash,
  poolState,
  networkType,
  handleAction,
}: Props): React.ReactElement {
  useLogOnFirstMount('PointsEarned')
  const theme = useTheme()
  const isDev = checkIsDev()
  const dispatch = useDispatch()
  const reset = useResetAtom(txAtom)
  const { account, chainId } = useChainInfo(isDev, CHAIN_TYPE.SOLANA)
  const [pointsAccumulated, setPointsAccumulated] = useState<
    number | undefined
  >()
  const hasPointsAccumulated =
    !isEmpty(pointsAccumulated) && pointsAccumulated! > 0
  const lockupMonths = Math.round(
    (poolState.withdrawalLockupPeriodDays ?? 0) / 30,
  )
  const monthText =
    lockupMonths > 1 ? `${lockupMonths} months` : `${lockupMonths} month`
  const [state, setState] = useState<STATE>(STATE.Loading)

  useEffect(() => {
    const updateWalletPoints = async () => {
      try {
        const result = await CampaignService.updateHumaAccountPoints(
          account!,
          transactionHash,
          chainId!,
          networkType,
          isDev,
        )
        setPointsAccumulated(result.pointsAccumulated)
        setState(STATE.Congrats)
      } catch (error) {
        console.error('Failed to update wallet points', error)
      }
    }
    updateWalletPoints()
  }, [account, chainId, isDev, networkType, transactionHash])

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

  if (state === STATE.SignIn) {
    return (
      <SignIn description='Please sign in to check the points that you earned.' />
    )
  }

  if (state === STATE.Congrats) {
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
                ? `${formatNumber(pointsAccumulated)} Points`
                : 'Points earned'}
            </Box>
          </Box>
        </Box>
        <Box css={styles.entirePoints}>
          {hasPointsAccumulated ? (
            <>
              <Box>Congratulations,</Box>
              <Box>you've earned {pointsAccumulated} points</Box>
            </>
          ) : (
            <Box>Congratulations on joining the Huma Protocol!</Box>
          )}
        </Box>
        <Box css={styles.entirePointsDetails}>
          You'll earn points <span css={styles.everyday}>everyday</span> for{' '}
          {monthText} straight.
        </Box>
        <BottomButton variant='contained' onClick={handleCloseModal}>
          GREAT
        </BottomButton>
      </Box>
    )
  }

  return <LoadingModal title='SUPPLY' />
}
