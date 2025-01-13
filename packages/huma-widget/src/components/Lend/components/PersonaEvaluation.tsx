import {
  CHAIN_TYPE,
  checkIsDev,
  CloseModalOptions,
  IdentityServiceV2,
  IdentityVerificationStatusV2,
  KYCCopy,
  KYCType,
  NETWORK_TYPE,
  VerificationStatusResultV2,
} from '@huma-finance/shared'
import { useAuthErrorHandling } from '@huma-finance/web-shared'
import { Box, css, useTheme } from '@mui/material'
import Persona, { Client } from 'persona'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setError, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { BottomButton } from '../../BottomButton'
import { ApproveLenderImg } from '../../images'
import { LoadingModal } from '../../LoadingModal'
import { WrapperModal } from '../../WrapperModal'
import { Campaign } from '../supplyV2'

type LoadingType = 'verificationStatus' | 'startKYC' | 'approveLender'

type Props = {
  poolInfo: {
    KYC?: KYCType
    juniorTrancheVault: string
    seniorTrancheVault: string
  }
  networkType: NETWORK_TYPE
  chainType: CHAIN_TYPE
  documentHash?: string
  campaign?: Campaign
  handleClose: (options?: CloseModalOptions) => void
}

export function PersonaEvaluation({
  poolInfo,
  campaign,
  networkType,
  chainType,
  documentHash,
  handleClose,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const isDev = checkIsDev()
  const dispatch = useAppDispatch()
  const {
    errorType,
    setError: setAuthError,
    isWalletOwnershipVerified,
    isWalletOwnershipVerificationRequired,
  } = useAuthErrorHandling(isDev, chainType)
  const KYCCopies = poolInfo.KYC!.Persona!
  const [loadingType, setLoadingType] = useState<LoadingType>()
  const [kycCopy, setKYCCopy] = useState<KYCCopy>(KYCCopies.verifyIdentity)
  const [inquiryId, setInquiryId] = useState<string>()
  const [sessionToken, setSessionToken] = useState<string>()
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatusResultV2>()
  const [showPersonaClient, setShowPersonaClient] = useState<boolean>(false)
  const [KYCAutoStarted, setKYCAutoStarted] = useState<boolean>(false)
  const isKYCCompletedRef = useRef<boolean>(false)
  const isActionOngoingRef = useRef<boolean>(false)
  const isKYCResumedRef = useRef<boolean>(false)

  const checkVerificationStatus = useCallback(async () => {
    if (isActionOngoingRef.current || isKYCResumedRef.current) {
      return
    }
    try {
      isActionOngoingRef.current = true
      setLoadingType('verificationStatus')
      const verificationStatus =
        await IdentityServiceV2.getVerificationStatusV2(
          networkType,
          documentHash,
          isDev,
        )
      setVerificationStatus(verificationStatus)
      setInquiryId(verificationStatus.personaInquiryId)

      switch (verificationStatus.status) {
        case IdentityVerificationStatusV2.ACCREDITED: {
          const startVerificationResult =
            await IdentityServiceV2.startVerification(networkType, isDev)
          setInquiryId(startVerificationResult.personaInquiryId)
          setKYCCopy(KYCCopies.verifyIdentity)
          setLoadingType(undefined)
          if (
            startVerificationResult.status ===
            IdentityVerificationStatusV2.BYPASSED
          ) {
            setVerificationStatus(startVerificationResult)
            setKYCCopy(KYCCopies.verificationBypassed)
          }

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
              await IdentityServiceV2.resumeVerification(networkType, isDev)
            verificationStatus.status = resumeVerificationResult.status
            setVerificationStatus(verificationStatus)
            setSessionToken(resumeVerificationResult.sessionToken)
            setLoadingType(undefined)
            isKYCResumedRef.current = true
          } else {
            setLoadingType('verificationStatus')
          }
          setKYCCopy(KYCCopies.verifyIdentity)
          break
        }

        case IdentityVerificationStatusV2.EXPIRED: {
          const resumeVerificationResult =
            await IdentityServiceV2.resumeVerification(networkType, isDev)
          verificationStatus.status = resumeVerificationResult.status
          setVerificationStatus(verificationStatus)
          setSessionToken(resumeVerificationResult.sessionToken)
          setKYCCopy(KYCCopies.verifyIdentity)
          setLoadingType(undefined)
          isKYCResumedRef.current = true
          break
        }

        case IdentityVerificationStatusV2.BYPASSED: {
          setKYCCopy(KYCCopies.verificationBypassed)
          setLoadingType(undefined)

          break
        }

        case IdentityVerificationStatusV2.APPROVED: {
          setKYCCopy(KYCCopies.verificationApproved)
          setLoadingType(undefined)
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

        case IdentityVerificationStatusV2.CONSENTED_TO_SUBSCRIPTION: {
          dispatch(setStep(WIDGET_STEP.ApproveLender))
          break
        }

        default:
          break
      }
    } catch (e: unknown) {
      setAuthError(e)
    } finally {
      isActionOngoingRef.current = false
    }
  }, [KYCCopies, dispatch, isDev, networkType, documentHash, setAuthError])

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
    const interval = setInterval(() => {
      if (
        verificationStatus?.status &&
        [
          IdentityVerificationStatusV2.CREATED,
          IdentityVerificationStatusV2.PENDING,
        ].includes(verificationStatus.status)
      ) {
        checkVerificationStatus()
      }
    }, 3 * 1000)
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval)
  }, [checkVerificationStatus, verificationStatus?.status])

  useEffect(() => {
    if (errorType === 'NotSignedIn') {
      setLoadingType(undefined)
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
          errorMessage: 'Something went wrong. Please try again later.',
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

  const startKYC = useCallback(async () => {
    isActionOngoingRef.current = true
    isKYCResumedRef.current = false
    setLoadingType('startKYC')
    const client: Client = new Persona.Client({
      inquiryId,
      sessionToken,
      frameWidth: '480px',
      onReady: () => {
        client.open()
        setShowPersonaClient(true)
      },
      onComplete: () => {
        isKYCCompletedRef.current = true
        isActionOngoingRef.current = false
        setShowPersonaClient(false)
        checkVerificationStatus()
      },
      onCancel: () => {
        isActionOngoingRef.current = false
        setShowPersonaClient(false)
        setLoadingType(undefined)
        handleClose()
      },
      onError: () => {
        isActionOngoingRef.current = false
        setShowPersonaClient(false)
        setLoadingType(undefined)
      },
    })
  }, [checkVerificationStatus, handleClose, inquiryId, sessionToken])

  // Start KYC flow directly for the first time
  useEffect(() => {
    if (isActionOngoingRef.current || isKYCResumedRef.current) {
      return
    }
    if (verificationStatus && !KYCAutoStarted) {
      switch (verificationStatus.status) {
        case IdentityVerificationStatusV2.ACCREDITED:
        case IdentityVerificationStatusV2.CREATED:
        case IdentityVerificationStatusV2.PENDING:
        case IdentityVerificationStatusV2.EXPIRED: {
          startKYC()
          setKYCAutoStarted(true)
          break
        }

        default:
          break
      }
    }
  }, [KYCAutoStarted, startKYC, verificationStatus])

  const handleAction = useCallback(() => {
    if (verificationStatus) {
      switch (verificationStatus.status) {
        case IdentityVerificationStatusV2.ACCREDITED:
        case IdentityVerificationStatusV2.CREATED:
        case IdentityVerificationStatusV2.PENDING:
        case IdentityVerificationStatusV2.EXPIRED:
          startKYC()
          break

        case IdentityVerificationStatusV2.DECLINED:
        case IdentityVerificationStatusV2.NEEDS_REVIEW:
        case IdentityVerificationStatusV2.APPROVED:
          handleClose({ identityStatus: verificationStatus.status })
          break

        case IdentityVerificationStatusV2.BYPASSED:
          handleClose({ identityStatus: IdentityVerificationStatusV2.APPROVED })
          break

        default:
          break
      }
    }
  }, [handleClose, startKYC, verificationStatus])

  const styles = {
    iconWrapper: css`
      ${theme.cssMixins.rowCentered};
      margin-top: ${theme.spacing(8)};
      & > img {
        width: 144px;
      }
    `,
    description: css`
      margin-top: ${theme.spacing(10)};
      padding: ${theme.spacing(0, 2)};
      font-weight: 400;
      font-size: 16px;
      color: ${theme.palette.text.primary};
    `,
    points: css`
      color: ${theme.palette.primary.main};
      font-weight: 700;
    `,
  }

  if (!loadingType) {
    return (
      <WrapperModal title={kycCopy.title}>
        <Box css={styles.iconWrapper}>
          <img src={ApproveLenderImg} alt='approve-lender' />
        </Box>
        {campaign && kycCopy === KYCCopies.verifyIdentity ? (
          <Box css={styles.description}>
            <span>
              You'll be rewarded with Huma points after completing KYC/KYB and
              your first investment.
            </span>
          </Box>
        ) : (
          <Box css={styles.description}>{kycCopy.description}</Box>
        )}

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
      description='Checking your verification status...'
    />
  )
}
