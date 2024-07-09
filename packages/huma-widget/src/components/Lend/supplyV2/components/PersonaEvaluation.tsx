import {
  CampaignService,
  checkIsDev,
  formatNumber,
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
import { BigNumber, ethers } from 'ethers'
import Persona, { Client } from 'persona'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Campaign } from '..'
import { useAppDispatch } from '../../../../hooks/useRedux'
import { setError, setStep } from '../../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../../store/widgets.store'
import { BottomButton } from '../../../BottomButton'
import { ApproveLenderImg } from '../../../images'
import { LoadingModal } from '../../../LoadingModal'
import { WrapperModal } from '../../../WrapperModal'

type LoadingType = 'verificationStatus' | 'startKYC' | 'approveLender'

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
  minDepositAmount: BigNumber
  campaign?: Campaign
  changeTranche: (tranche: TrancheType) => void
  handleClose: () => void
}

export function PersonaEvaluation({
  poolInfo,
  isUniTranche,
  minDepositAmount: minDepositAmountBN,
  campaign,
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
  const [loadingType, setLoadingType] = useState<LoadingType>()
  const [kycCopy, setKYCCopy] = useState<KYCCopy>(KYCCopies.verifyIdentity)
  const isVerifyIdentity = kycCopy === KYCCopies.verifyIdentity
  const [inquiryId, setInquiryId] = useState<string>()
  const [sessionToken, setSessionToken] = useState<string>()
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatusResultV2>()
  const [showPersonaClient, setShowPersonaClient] = useState<boolean>(false)
  const [campaignBasePoints, setCampaignBasePoints] = useState<number>(0)
  const isKYCCompletedRef = useRef<boolean>(false)
  const isActionOngoingRef = useRef<boolean>(false)
  const isKYCResumedRef = useRef<boolean>(false)

  useEffect(() => {
    const getBasePoints = async () => {
      if (campaign) {
        const minDepositAmount = ethers.utils.formatUnits(
          minDepositAmountBN,
          poolInfo.poolUnderlyingToken.decimals,
        )
        const estimatedPoints = await CampaignService.getEstimatedPoints(
          campaign.campaignGroupId,
          minDepositAmount,
        )
        const campaignPoints = estimatedPoints.find(
          (item) => item.campaignId === campaign.id,
        )
        if (campaignPoints) {
          const { juniorTranchePoints, seniorTranchePoints } = campaignPoints
          if (isUniTranche) {
            setCampaignBasePoints(juniorTranchePoints ?? 0)
          } else {
            setCampaignBasePoints(
              juniorTranchePoints < seniorTranchePoints
                ? juniorTranchePoints
                : seniorTranchePoints,
            )
          }
        }
      }
    }
    getBasePoints()
  }, [
    campaign,
    isUniTranche,
    minDepositAmountBN,
    poolInfo.poolUnderlyingToken.decimals,
  ])

  const approveLender = useCallback(async () => {
    try {
      isActionOngoingRef.current = true
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
      isActionOngoingRef.current = false
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
    if (isActionOngoingRef.current || isKYCResumedRef.current) {
      return
    }
    try {
      if (account && chainId) {
        isActionOngoingRef.current = true
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
            isKYCResumedRef.current = true
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
      isActionOngoingRef.current = false
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
    }, 10 * 1000)
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

  const startKYC = async () => {
    isActionOngoingRef.current = true
    isKYCResumedRef.current = false
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
        isActionOngoingRef.current = false
        setShowPersonaClient(false)
        checkVerificationStatus()
      },
      onCancel: () => {
        isActionOngoingRef.current = false
        setShowPersonaClient(false)
        setLoadingType(undefined)
      },
      onError: () => {
        isActionOngoingRef.current = false
        setShowPersonaClient(false)
        setLoadingType(undefined)
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
      text-align: justify;
      margin-top: ${theme.spacing(10)};
      padding: ${theme.spacing(0, 2)};
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      color: #a8a1b2;
    `,
    points: css`
      color: #b246ff;
      font-family: 'Uni-Neue-Bold';
    `,
  }

  if (!loadingType) {
    return (
      <WrapperModal title={kycCopy.title}>
        <Box css={styles.iconWrapper}>
          <img src={ApproveLenderImg} alt='approve-lender' />
        </Box>
        {campaign && isVerifyIdentity ? (
          <Box css={styles.description}>
            <span>You’ll be rewarded with a minimum of</span>
            <span css={styles.points}>
              {' '}
              {formatNumber(campaignBasePoints)} Huma points{' '}
            </span>
            <span>after completing KYC and your first investment.</span>
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
      description={LoadingCopiesByType[loadingType].description}
    />
  )
}
