import {
  checkIsDev,
  IdentityServiceV2,
  SolanaPoolInfo,
} from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import React, { useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setError, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { CustomError } from '../../../utilTypes'
import { BottomButton } from '../../BottomButton'
import { ApproveLenderImg } from '../../images'
import { LoadingModal } from '../../LoadingModal'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolInfo: SolanaPoolInfo
  isUniTranche?: boolean
  handleApproveSuccess: () => void
}

export function Evaluation({
  poolInfo,
  isUniTranche,
  handleApproveSuccess,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const isDev = checkIsDev()
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
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
    if (publicKey) {
      try {
        await IdentityServiceV2.approveSolanaLender(
          publicKey.toString(),
          poolInfo.chainId,
          poolInfo.juniorTrancheMint,
          isDev,
        )
        if (!isUniTranche) {
          await IdentityServiceV2.approveSolanaLender(
            publicKey.toString(),
            poolInfo.chainId,
            poolInfo.seniorTrancheMint,
            isDev,
          )
        }
        handleApproveSuccess()
        setLoading(false)
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
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
