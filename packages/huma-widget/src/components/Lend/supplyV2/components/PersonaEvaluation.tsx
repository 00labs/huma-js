import {
  checkIsDev,
  IdentityServiceV2,
  IdentityVerificationStatusV2,
  KYCCopy,
  PoolInfoV2,
  TrancheType,
  useAuthErrorHandling,
  VerificationStatusResultV2,
} from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import Persona, { Client } from 'persona'
import { useAppDispatch } from '../../../../hooks/useRedux'
import { setError, setStep } from '../../../../store/widgets.reducers'
import { BottomButton } from '../../../BottomButton'
import { ApproveLenderImg } from '../../../images'
import { LoadingModal } from '../../../LoadingModal'
import { WrapperModal } from '../../../WrapperModal'
import { WIDGET_STEP } from '../../../../store/widgets.store'

const INQUIRY_ID = 'INQUIRY_ID'

const LoadingCopiesByType: {
  [key: string]: {
    description: string
  }
} = {
  verificationStatus: {
    description: `Checking your verification status...`,
  },
  startKYC: {
    description: `Starting KYC...`,
  },
  approveLender: {
    description: `Approving as lender...`,
  },
}

type Props = {
  poolInfo: PoolInfoV2
  isUniTranche: boolean
  changeTranche: (tranche: TrancheType) => void
  handleClose: () => void
}

export function PersonaEvaluation({
  poolInfo,
  isUniTranche,
  changeTranche,
  handleClose,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const isDev = checkIsDev()
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React()
  const {
    errorType,
    setError: setAuthError,
    isWalletOwnershipVerified,
    isWalletOwnershipVerificationRequired,
  } = useAuthErrorHandling(isDev)
  const KYCCopies = poolInfo.KYC!.Persona!
  const [loadingType, setLoadingType] = useState<
    'verificationStatus' | 'startKYC' | 'approveLender'
  >()
  const [kycCopy, setKYCCopy] = useState<KYCCopy>(KYCCopies.verifyIdentity)
  const [inquiryId, setInquiryId] = useState<string | undefined>(
    localStorage.getItem(INQUIRY_ID) ?? undefined,
  )
  const [sessionToken, setSessionToken] = useState<string | undefined>()
  const [verificationStatus, setVerificationStatus] = useState<
    VerificationStatusResultV2 | undefined
  >()
  const [showPersonaClient, setShowPersonaClient] = useState<boolean>(false)
  const isKYCCompletedRef = useRef<boolean>(false)
  const isActionOnGoingRef = useRef<boolean>(false)

  const approveLender = useCallback(async () => {
    try {
      isActionOnGoingRef.current = true
      setLoadingType('approveLender')
      await IdentityServiceV2.approveLender(
        account!,
        chainId!,
        poolInfo.juniorTrancheVault,
        isDev,
      )
      if (!isUniTranche) {
        await IdentityServiceV2.approveLender(
          account!,
          chainId!,
          poolInfo.seniorTrancheVault,
          isDev,
        )
      }
      if (isUniTranche) {
        changeTranche('junior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
      } else {
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
      }
    } finally {
      isActionOnGoingRef.current = false
      setLoadingType(undefined)
    }
  }, [
    account,
    chainId,
    changeTranche,
    dispatch,
    isDev,
    isUniTranche,
    poolInfo.juniorTrancheVault,
    poolInfo.seniorTrancheVault,
  ])

  const checkVerificationStatus = useCallback(async () => {
    if (isActionOnGoingRef.current === true) {
      return
    }
    try {
      if (account && chainId) {
        isActionOnGoingRef.current = true
        setLoadingType('verificationStatus')
        const verificationStatus =
          await IdentityServiceV2.getVerificationStatusV2(
            account,
            chainId,
            isDev,
          )
        setVerificationStatus(verificationStatus)
        setInquiryId(verificationStatus.personaInquiryId)

        switch (verificationStatus.status) {
          case IdentityVerificationStatusV2.NOT_STARTED: {
            const startVerificationResult =
              await IdentityServiceV2.startVerification(account, chainId, isDev)
            localStorage.setItem(
              INQUIRY_ID,
              startVerificationResult.personaInquiryId,
            )
            setInquiryId(startVerificationResult.personaInquiryId)
            setKYCCopy(KYCCopies.verifyIdentity)
            setLoadingType(undefined)
            break
          }

          case IdentityVerificationStatusV2.CREATED: {
            setKYCCopy(KYCCopies.verifyIdentity)
            setLoadingType(undefined)
            break
          }

          case IdentityVerificationStatusV2.PENDING: {
            if (!isKYCCompletedRef.current) {
              const resumeVerificationResult =
                await IdentityServiceV2.resumeVerification(
                  account,
                  chainId,
                  isDev,
                )
              verificationStatus.status = resumeVerificationResult.status
              setVerificationStatus(verificationStatus)
              setSessionToken(resumeVerificationResult.sessionToken)
            }
            setKYCCopy(KYCCopies.verifyIdentity)
            break
          }

          case IdentityVerificationStatusV2.EXPIRED: {
            const resumeVerificationResult =
              await IdentityServiceV2.resumeVerification(
                account,
                chainId,
                isDev,
              )
            verificationStatus.status = resumeVerificationResult.status
            setVerificationStatus(verificationStatus)
            setSessionToken(resumeVerificationResult.sessionToken)
            setKYCCopy(KYCCopies.verifyIdentity)
            setLoadingType(undefined)
            break
          }

          case IdentityVerificationStatusV2.APPROVED: {
            await approveLender()
            break
          }

          case IdentityVerificationStatusV2.DECLINED: {
            setKYCCopy(KYCCopies.verificationDeclined)
            setLoadingType(undefined)
            break
          }

          case IdentityVerificationStatusV2.NEEDS_REVIEW: {
            setKYCCopy(KYCCopies.verificationNeedsReview)
            setLoadingType(undefined)
            break
          }

          default:
            break
        }
      }
    } catch (e: unknown) {
      setAuthError(e)
    } finally {
      isActionOnGoingRef.current = false
    }
  }, [KYCCopies, account, approveLender, chainId, isDev, setAuthError])

  useEffect(() => {
    checkVerificationStatus()
  }, [checkVerificationStatus])

  useEffect(() => {
    if (isWalletOwnershipVerificationRequired && isWalletOwnershipVerified) {
      checkVerificationStatus()
    }
  }, [
    checkVerificationStatus,
    isWalletOwnershipVerificationRequired,
    isWalletOwnershipVerified,
  ])

  useEffect(() => {
    const interval = setTimeout(() => {
      if (
        verificationStatus?.status &&
        [
          IdentityVerificationStatusV2.CREATED,
          IdentityVerificationStatusV2.PENDING,
        ].includes(verificationStatus.status)
      ) {
        checkVerificationStatus()
      }
    }, 10 * 1000)
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(interval)
  }, [checkVerificationStatus, verificationStatus?.status])

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

  useEffect(() => {
    const modalElement = document.getElementById('huma-modal')
    if (modalElement) {
      modalElement.style.visibility = showPersonaClient ? 'hidden' : 'visible'
    }
  }, [showPersonaClient])

  const startKYC = async () => {
    isActionOnGoingRef.current = true
    setLoadingType('startKYC')
    const client: Client = new Persona.Client({
      inquiryId,
      sessionToken,
      onReady: () => {
        client.open()
        setShowPersonaClient(true)
      },
      onComplete: () => {
        isKYCCompletedRef.current = true
        isActionOnGoingRef.current = false
        setShowPersonaClient(false)
        checkVerificationStatus()
      },
      onCancel: () => {
        isActionOnGoingRef.current = false
        setShowPersonaClient(false)
      },
      onError: () => {
        isActionOnGoingRef.current = false
        setShowPersonaClient(false)
      },
    })
  }

  const handleAction = () => {
    if (verificationStatus) {
      switch (verificationStatus.status) {
        case IdentityVerificationStatusV2.NOT_STARTED:
        case IdentityVerificationStatusV2.CREATED:
        case IdentityVerificationStatusV2.PENDING:
        case IdentityVerificationStatusV2.EXPIRED:
          startKYC()
          break

        case IdentityVerificationStatusV2.DECLINED:
        case IdentityVerificationStatusV2.NEEDS_REVIEW:
          handleClose()
          break

        default:
          break
      }
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
          <BottomButton variant='contained' onClick={handleAction}>
            {kycCopy.buttonText}
          </BottomButton>
        )}
      </WrapperModal>
    )
  }

  return (
    <LoadingModal
      title='Lender Approval'
      description={LoadingCopiesByType[loadingType].description}
    />
  )
}
