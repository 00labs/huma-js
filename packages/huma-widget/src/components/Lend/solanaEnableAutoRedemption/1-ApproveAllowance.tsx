import { timeUtil } from '@huma-finance/shared'
import { getLenderLockupDates, SolanaPoolState } from '@huma-finance/web-shared'
import React, { useCallback } from 'react'
import { Box, css, useTheme } from '@mui/material'
import { useAppDispatch } from '../../../hooks/useRedux'
import { WrapperModal } from '../../WrapperModal'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { setStep } from '../../../store/widgets.reducers'
import { BottomButton } from '../../BottomButton'
import { AutoPaybackImg } from '../../images'

type Props = {
  poolState: SolanaPoolState
}

export function ApproveAllowance({ poolState }: Props): React.ReactElement {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const handleNext = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  const styles = {
    iconWrapper: css`
      ${theme.cssMixins.rowCentered};
      margin-top: ${theme.spacing(6)};
      & > img {
        width: 220px;
      }
    `,
    description: css`
      margin-top: ${theme.spacing(4)};
      font-weight: 400;
      font-size: 16px;
      color: ${theme.palette.text.secondary};
      padding: ${theme.spacing(0, 1)};
    `,
  }

  const { lockupEndTimeUnix, withdrawTimeUnix } = getLenderLockupDates(
    poolState.withdrawalLockupPeriodDays ?? 0,
  )

  return (
    <WrapperModal title='Auto-Redemption'>
      <Box css={styles.iconWrapper}>
        <img src={AutoPaybackImg} alt='auto-payback' />
      </Box>
      <Box css={styles.description}>
        This allowance transaction will enable auto-redemption for your existing
        tranche shares. Redemption requests will be automatically submitted on{' '}
        {timeUtil.timestampToLL(lockupEndTimeUnix)}. Your deposit can be
        redeemed and yield rewards will stop on{' '}
        {timeUtil.timestampToLL(withdrawTimeUnix)}.
      </Box>
      <BottomButton variant='contained' onClick={handleNext}>
        APPROVE ALLOWANCE
      </BottomButton>
    </WrapperModal>
  )
}
