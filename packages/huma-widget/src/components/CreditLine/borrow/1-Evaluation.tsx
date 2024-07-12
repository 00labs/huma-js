import { Box, Button, css, Typography, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { PoolInfoType } from '@huma-finance/shared'
import React, { useEffect, useState } from 'react'

import useEA from '../../../hooks/useEA'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { CheckCircleIcon, CheckGreenIcon } from '../../icons'
import spinner from '../../icons/spinner.gif'
import { SignIn } from '../../SignIn'

type Props = {
  poolInfo: PoolInfoType
  handleApprove: () => void
}

export function Evaluation({
  poolInfo,
  handleApprove,
}: Props): React.ReactElement {
  const theme = useTheme()
  const {
    checkingEA,
    isWalletOwnershipVerificationRequired,
    isWalletOwnershipVerified,
  } = useEA()
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React()
  const [status, setStatus] = useState<'checking' | 'success'>('checking')

  useEffect(() => {
    const fetchData = async () => {
      if (account && chainId) {
        await checkingEA(
          {
            poolAddress: poolInfo.pool,
            borrowerWalletAddress: account,
          },
          WIDGET_STEP.Evaluation,
        )
        handleApprove()
        setStatus('success')
      }
    }
    fetchData()
  }, [
    account,
    chainId,
    checkingEA,
    handleApprove,
    poolInfo.assetAddress,
    poolInfo.pool,
    isWalletOwnershipVerified,
  ])

  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(-0.5)};
    `,
    content: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(4)};
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #49505b;
      margin-bottom: ${theme.spacing(8)};
    `,
    checkWrapper: css`
      ${theme.cssMixins.rowVCentered}
      width: 100%;
      height: 72px;
      background: #f9f8fa;
      border-radius: 4px;
      font-weight: 400;
      font-size: 16px;
      color: #49505b;
    `,
    checkIcon: css`
      ${theme.cssMixins.rowCentered}
      width: 105px;
      height: 100%;

      & > img {
        max-width: 100%;
        max-height: 100%;
      }
    `,
    congratsWrapper: css`
      font-weight: 400;
      font-size: 16px;
      padding: ${theme.spacing(0, 2)};
      ${theme.cssMixins.rowVCentered}
      margin-top: ${theme.spacing(8)};
      height: 52px;
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.9),
          rgba(255, 255, 255, 0.9)
        ),
        #2e7d32;
      border-radius: 4px;
    `,
    bottom: css`
      & .MuiButtonBase-root {
        width: 100%;
        position: absolute;
        bottom: 0;
      }
    `,
  }

  const goToNextStep = () => {
    dispatch(setStep(WIDGET_STEP.ChooseAmount))
  }

  if (isWalletOwnershipVerificationRequired) {
    return <SignIn />
  }

  return (
    <Box css={styles.wrapper}>
      <Typography variant='h6' css={styles.header}>
        Borrow
      </Typography>
      <Box css={styles.content}>
        Looks like it’s your first time around here. Let’s see if you qualify...
      </Box>
      <Box css={styles.checkWrapper} sx={{ marginBottom: '16px' }}>
        <Box css={styles.checkIcon}>
          {status === 'checking' && <img src={spinner} alt='loading...' />}
          {status === 'success' && <CheckGreenIcon />}
        </Box>
        <Box>Checking your income</Box>
      </Box>
      <Box css={styles.checkWrapper}>
        <Box css={styles.checkIcon}>
          {status === 'checking' && <img src={spinner} alt='loading...' />}
          {status === 'success' && <CheckGreenIcon />}
        </Box>
        <Box>Checking other qualifications</Box>
      </Box>
      {status === 'success' && (
        <>
          <Box css={styles.congratsWrapper}>
            <CheckCircleIcon />
            <Box sx={{ marginLeft: '16px' }}>
              Congrats, you are qualified to borrow
            </Box>
          </Box>
          <Box css={styles.bottom}>
            <Button variant='contained' onClick={goToNextStep}>
              CONTINUE TO BORROW
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
