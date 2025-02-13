import React, { useCallback } from 'react'
import { Box, css, useTheme } from '@mui/material'
import { getLenderLockupDates, SolanaPoolState } from '@huma-finance/web-shared'
import { timeUtil } from '@huma-finance/shared'
import { useAppDispatch } from '../../../hooks/useRedux'
import { WrapperModal } from '../../WrapperModal'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { setStep } from '../../../store/widgets.reducers'
import { BottomButton } from '../../BottomButton'
import { AutoPaybackImg } from '../../images'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'

type Props = {
  poolState: SolanaPoolState
}

export function ApproveAllowance({ poolState }: Props): React.ReactElement {
  useLogOnFirstMount('ApproveAllowance', {})
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

  const { lockupEndTimeUnix } = getLenderLockupDates(
    poolState.withdrawalLockupPeriodDays ?? 0,
  )
  return (
    <WrapperModal title='Auto-Redemption'>
      <Box css={styles.iconWrapper}>
        <img src={AutoPaybackImg} alt='auto-payback' />
      </Box>
      <Box css={styles.description}>
        This transaction will also enable auto-redemption for your tranche
        shares by approving our automation account as a delegate. Redemption
        requests will be automatically submitted on{' '}
        {timeUtil.timestampToLL(lockupEndTimeUnix)}.
      </Box>
      <BottomButton variant='contained' onClick={handleNext}>
        SUPPLY
      </BottomButton>
    </WrapperModal>
  )
}
