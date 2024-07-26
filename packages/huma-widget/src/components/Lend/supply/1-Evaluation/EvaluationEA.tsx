import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { EAService, PoolInfoType } from '@huma-finance/shared'
import React, { useState } from 'react'

import { useAppDispatch } from '../../../../hooks/useRedux'
import { setError, setStep } from '../../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../../store/widgets.store'
import { CustomError } from '../../../../utilTypes'
import { BottomButton } from '../../../BottomButton'
import { ApproveLenderImg } from '../../../images'
import { LoadingModal } from '../../../LoadingModal'
import { WrapperModal } from '../../../WrapperModal'

type Props = {
  poolInfo: PoolInfoType
  handleApproveSuccess: () => void
}

export function EvaluationEA({
  poolInfo,
  handleApproveSuccess,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React()
  const [loading, setLoading] = useState(false)

  const styles = {
    iconWrapper: css`
      ${theme.cssMixins.rowCentered};
      margin-top: ${theme.spacing(8)};
      & > img {
        width: 144px;
      }
    `,
    description: css`
      ${theme.cssMixins.rowCentered};
      margin-top: ${theme.spacing(10)};
      padding: ${theme.spacing(0, 2)};
      font-weight: 400;
      font-size: 16px;
      color: ${theme.palette.text.secondary};
    `,
  }

  const approveLender = async () => {
    if (account) {
      try {
        setLoading(true)
        const payload = {
          poolAddress: poolInfo.pool,
          lenderWalletAddress: account,
        }
        await EAService.approveLender(payload, chainId!)
        handleApproveSuccess()
        setLoading(false)
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
      } catch (e: unknown) {
        const error = e as CustomError
        setLoading(false)
        dispatch(setError({ errorMessage: error.message }))
      }
    }
  }

  if (!loading) {
    return (
      <WrapperModal
        title='Lender Approval'
        subTitle='This pool requires lender approval'
      >
        <Box css={styles.iconWrapper}>
          <img src={ApproveLenderImg} alt='approve-lender' />
        </Box>
        <Box css={styles.description} />
        <BottomButton variant='contained' onClick={approveLender}>
          GET APPROVED
        </BottomButton>
      </WrapperModal>
    )
  }

  return (
    <LoadingModal
      title='Approval Pending'
      description='Waiting for approval confirmation...'
    />
  )
}
