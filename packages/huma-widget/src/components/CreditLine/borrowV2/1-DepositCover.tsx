import {
  FirstLossCoverIndex,
  PoolInfoV2,
  UnderlyingTokenInfo,
  txAtom,
  useFirstLossCoverAllowanceV2,
  useFirstLossCoverContractV2,
  useFirstLossCoverRequirement,
  useFirstLossCoverSufficientV2,
} from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { useResetAtom } from 'jotai/utils'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModalV2 } from '../../ApproveAllowanceModalV2'
import { BottomButton } from '../../BottomButton'
import { LoadingModal } from '../../LoadingModal'
import { TxSendModalV2 } from '../../TxSendModalV2'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
}

export function DepositCover({
  poolInfo,
  poolUnderlyingToken,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const reset = useResetAtom(txAtom)
  const { decimals, symbol } = poolUnderlyingToken
  const { provider, account } = useWeb3React()
  const [action, setAction] = useState<
    'instruction' | 'approveAllowance' | 'depositCover'
  >()
  const firstLossCoverContract = useFirstLossCoverContractV2(
    poolInfo.poolName,
    FirstLossCoverIndex.borrower,
    provider,
    account,
  )
  const [isSufficient] = useFirstLossCoverSufficientV2(
    poolInfo.poolName,
    FirstLossCoverIndex.borrower,
    account,
    provider,
  )
  const [allowance] = useFirstLossCoverAllowanceV2(
    poolInfo.poolName,
    FirstLossCoverIndex.borrower,
    account,
    provider,
  )
  const [requirement] = useFirstLossCoverRequirement(
    poolInfo.poolName,
    FirstLossCoverIndex.borrower,
    account,
    provider,
  )
  const { minRequirement, minAmountToDeposit } = requirement || {}

  useEffect(() => {
    if (isSufficient === true) {
      dispatch(setStep(WIDGET_STEP.ChooseAmount))
    } else if (isSufficient === false) {
      setAction('instruction')
    }
  }, [dispatch, isSufficient])

  const styles = {
    description: css`
      margin-top: ${theme.spacing(4)};
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      color: #a8a1b2;
      padding: ${theme.spacing(0, 1)};
    `,
  }

  const goToDepositFIrstLossCover = () => {
    if (minAmountToDeposit!.gt(allowance!)) {
      setAction('approveAllowance')
    } else {
      setAction('depositCover')
    }
  }

  const handleApproveAllowanceSuccess = () => {
    setAction('depositCover')
  }

  const handleDepositSuccess = () => {
    reset()
    dispatch(setStep(WIDGET_STEP.ChooseAmount))
  }

  if (isSufficient === undefined || !allowance || !firstLossCoverContract) {
    return <LoadingModal title='Borrow' />
  }

  if (action === 'instruction') {
    return (
      <WrapperModal
        title='Deposit First Loss Cover'
        subTitle='Please deposit the first loss cover before drawdown.'
      >
        <Box css={styles.description}>
          <Box>
            Min requirement:{' '}
            {minRequirement
              ? ethers.utils.formatUnits(minRequirement, decimals)
              : 0}{' '}
            {symbol}
          </Box>
          <Box>
            Min amount to deposit:{' '}
            {minAmountToDeposit
              ? ethers.utils.formatUnits(minAmountToDeposit, decimals)
              : 0}{' '}
            {symbol}
          </Box>
        </Box>
        <BottomButton
          disabled={!requirement}
          variant='contained'
          onClick={goToDepositFIrstLossCover}
        >
          DEPOSIT FIRST LOSS COVER
        </BottomButton>
      </WrapperModal>
    )
  }

  if (action === 'approveAllowance') {
    return (
      <ApproveAllowanceModalV2
        poolInfo={poolInfo}
        spender={poolInfo.firstLossCovers[FirstLossCoverIndex.borrower]}
        poolUnderlyingToken={poolUnderlyingToken}
        handleSuccess={handleApproveAllowanceSuccess}
      />
    )
  }

  if (action === 'depositCover') {
    return (
      <TxSendModalV2
        title='Deposit First Loss Cover'
        contract={firstLossCoverContract}
        method='depositCover'
        params={[minAmountToDeposit]}
        handleSuccess={handleDepositSuccess}
      />
    )
  }

  return null
}
