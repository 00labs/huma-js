import {
  checkIsDev,
  IdentityService,
  IdentityVerificationStatus,
  KYCCopy,
  PoolInfoV2,
  useAuthErrorHandling,
  VerificationStatusResult,
} from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'

import Persona, { Client } from 'persona'
import { useAppDispatch } from '../../../../hooks/useRedux'
import { setError } from '../../../../store/widgets.reducers'
import { BottomButton } from '../../../BottomButton'
import { ApproveLenderImg } from '../../../images'
import { LoadingModal } from '../../../LoadingModal'
import { WrapperModal } from '../../../WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  handleClose: () => void
}

export function PersonaEvaluation({
  poolInfo,
  handleClose,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const isDev = checkIsDev()
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React()
  const {
    isWalletOwnershipVerified,
    errorType,
    setError: setAuthError,
  } = useAuthErrorHandling(isDev)
  const KYCCopies = poolInfo.KYC!.Persona!
  const [loadingType, setLoadingType] = useState<'verificationStatus'>()
  const [kycCopy, setKYCCopy] = useState<KYCCopy>(KYCCopies.verifyIdentity)
  const [KYCVerifyStatus, setKYCVerifyStatus] =
    useState<VerificationStatusResult>()

  useEffect(() => {
    setKYCCopy(KYCCopies.verifyIdentity)

    const fetchData = async () => {
      try {
        if (account && chainId) {
          setLoadingType('verificationStatus')
          const verificationStatus =
            await IdentityService.getVerificationStatus(
              account,
              poolInfo.pool,
              chainId,
              isDev,
            )
          setKYCVerifyStatus(verificationStatus)
          if (verificationStatus.isNotOnboarded) {
            const verificationResult = await IdentityService.startVerification(
              account,
              chainId,
              isDev,
            )
            console.log('verificationResult', verificationResult)
          }
        }
      } catch (e: unknown) {
        setAuthError(e)
      } finally {
        setLoadingType(undefined)
      }
    }
    fetchData()
  }, [
    KYCCopies.signInRequired,
    KYCCopies.verifyIdentity,
    account,
    chainId,
    isDev,
    poolInfo.pool,
    setAuthError,
    isWalletOwnershipVerified,
    dispatch,
  ])

  useEffect(() => {
    if (errorType === 'NotSignIn') {
      setKYCCopy(KYCCopies.signInRequired)
    } else if (errorType === 'UserRejected') {
      dispatch(
        setError({
          errorMessage: 'User has rejected the transaction.',
        }),
      )
    } else if (errorType === 'Other') {
      dispatch(
        setError({
          errorMessage: 'Something went wrong, please try again later.',
        }),
      )
    }
  }, [KYCCopies.signInRequired, dispatch, errorType])

  const approveLender = async () => {
    const { isVerified } = KYCVerifyStatus || {}

    console.log('isVerified', isVerified)

    if (!isVerified) {
      const client: Client = new Persona.Client({
        templateId: 'itmpl_8vesaKV8ZTLo9UYhTeCeqjGdrggR',
        environmentId: 'env_DtTmNi65FwmJttCYyHEWwuqqAY7v',
        onReady: () => client.open(),
        onComplete: ({ inquiryId, status, fields }) => {
          if (status === 'completed' || status === 'approved') {
            setKYCVerifyStatus({
              walletAddress: account!,
              verificationStatus: IdentityVerificationStatus.ACCREDITED,
              isVerified: true,
              isNotOnboarded: false,
            })
          } else {
            setKYCVerifyStatus({
              walletAddress: account!,
              verificationStatus:
                IdentityVerificationStatus.IDENTITY_VERIFICATION_FAILED,
              isVerified: false,
              isNotOnboarded: false,
            })
          }
        },
      })
    }
  }

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
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      color: #a8a1b2;
    `,
  }

  if (!loadingType) {
    return (
      <WrapperModal title={kycCopy.title}>
        <Box css={styles.iconWrapper}>
          <img src={ApproveLenderImg} alt='approve-lender' />
        </Box>
        <Box css={styles.description}>{kycCopy.description}</Box>
        {Boolean(kycCopy.buttonText) && (
          <BottomButton variant='contained' onClick={approveLender}>
            {kycCopy.buttonText}
          </BottomButton>
        )}
      </WrapperModal>
    )
  }

  return (
    <LoadingModal
      title='Lender Approval'
      description='Checking your verification status...'
    />
  )
}
