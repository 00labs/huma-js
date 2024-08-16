import {
  CampaignService,
  checkIsDev,
  formatNumber,
  isEmpty,
} from '@huma-finance/shared'
import { txAtom, useAuthErrorHandling } from '@huma-finance/web-shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { resetState, setError } from '../../../store/widgets.reducers'
import { BottomButton } from '../../BottomButton'
import { CongratulationsIcon, HumaPointsIcon, RibbonIcon } from '../../icons'
import { LoadingModal } from '../../LoadingModal'
import { SignIn } from '../../SignIn'

enum STATE {
  Loading = 'Loading',
  SignIn = 'SignIn',
  Congrats = 'Congrats',
}

const ERROR_MESSAGE =
  'Failed to update wallet points. Be assured that your points will be added later.'

type Props = {
  transactionHash: string
  lpConfig: { withdrawalLockoutPeriodInDays: number }
  pointsTestnetExperience: boolean
  handleAction: () => void
}

export function PointsEarned({
  transactionHash,
  lpConfig,
  pointsTestnetExperience,
  handleAction,
}: Props): React.ReactElement {
  const theme = useTheme()
  const isDev = checkIsDev()
  const dispatch = useDispatch()
  const reset = useResetAtom(txAtom)
  const { account, chainId } = useWeb3React()
  const [pointsAccumulated, setPointsAccumulated] = useState<
    number | undefined
  >()
  const hasPointsAccumulated =
    !isEmpty(pointsAccumulated) && pointsAccumulated! > 0
  const lockupMonths = Math.round(lpConfig.withdrawalLockoutPeriodInDays / 30)
  const monthText =
    lockupMonths > 1 ? `${lockupMonths} months` : `${lockupMonths} month`

  const {
    errorType,
    setError: setAuthError,
    isWalletOwnershipVerified,
    isWalletOwnershipVerificationRequired,
  } = useAuthErrorHandling(isDev)
  const [walletOwnership, setWalletOwnership] = useState<boolean | undefined>()
  const [state, setState] = useState<STATE>(STATE.Loading)

  useEffect(() => {
    if (isWalletOwnershipVerificationRequired) {
      setState(STATE.Loading)
    }
  }, [isWalletOwnershipVerificationRequired])

  useEffect(() => {
    if (isWalletOwnershipVerified) {
      setWalletOwnership(true)
    }
  }, [isWalletOwnershipVerified])

  useEffect(() => {
    const checkWalletOwnership = async () => {
      const ownership = await CampaignService.checkWalletOwnership(
        account!,
        isDev,
        pointsTestnetExperience,
      )
      setWalletOwnership(ownership)
      if (!ownership) {
        setAuthError('WalletNotSignInException')
      }
    }
    checkWalletOwnership()
  }, [account, isDev, pointsTestnetExperience, setAuthError])

  useEffect(() => {
    if (errorType === 'NotSignedIn') {
      setState(STATE.SignIn)
    } else if (errorType === 'UserRejected') {
      dispatch(
        setError({
          errorMessage: 'User has rejected the transaction.',
        }),
      )
    } else if (errorType === 'Other') {
      dispatch(
        setError({
          errorMessage: ERROR_MESSAGE,
        }),
      )
    }
  }, [dispatch, errorType])

  useEffect(() => {
    const updateWalletPoints = async () => {
      if (walletOwnership) {
        try {
          const result = await CampaignService.updateWalletPoints(
            account!,
            transactionHash,
            chainId!,
            isDev,
            pointsTestnetExperience,
          )
          setPointsAccumulated(result.pointsAccumulated)
          setState(STATE.Congrats)
        } catch (error) {
          console.error('Failed to update wallet points', error)
        }
      }
    }
    updateWalletPoints()
  }, [
    account,
    chainId,
    dispatch,
    isDev,
    pointsTestnetExperience,
    transactionHash,
    walletOwnership,
  ])

  const handleCloseModal = useCallback(() => {
    reset()
    dispatch(resetState())
    handleAction()
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
          {monthText} straight. Plus, If you keep your investment till after{' '}
          {monthText}, you’ll gain extra points daily.
        </Box>
        <BottomButton variant='contained' onClick={handleCloseModal}>
          GREAT
        </BottomButton>
      </Box>
    )
  }

  return <LoadingModal title='SUPPLY' />
}
