import {
  CHAINS,
  checkIsDev,
  configUtil,
  DocSignatureStatus,
  IdentityService,
  PoolInfoType,
  timeUtil,
  useAuthErrorHandling,
  useParamsSearch,
  VerificationStatusResult,
} from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useAppDispatch } from '../../../../hooks/useRedux'
import { setError } from '../../../../store/widgets.reducers'
import { BottomButton } from '../../../BottomButton'
import { HumaSnackBar } from '../../../HumaSnackBar'
import { ApproveLenderImg } from '../../../images'
import { LoadingModal } from '../../../LoadingModal'
import { WrapperModal } from '../../../WrapperModal'

const KYCProvider = 'Securitize'

type KYCCopy = {
  title: string
  description: string
  buttonText?: string
}

// TODO: Add copies for the other pools. Currently only the Jia pool is using the KYC process.
const JiaPoolCopies = {
  signInRequired: {
    title: 'Sign In',
    description:
      'Please sign in to verify that you are the owner of the wallet.',
  },
  verifyIdentity: {
    title: 'Verify Identity',
    description: `This pool is only available to accredited investors at the moment, with minimum investments of $10,000. Please complete identity verification and investor accreditation via ${KYCProvider}.`,
    buttonText: 'VERIFY MY IDENTITY',
  },
  emailSignatureLink: {
    title: 'Pool Documents',
    description: `By lending to this pool, you become a subscriber member of the Jia Pioneer Fund LLC. Please sign the LLC Agreement via DocuSign, securing your off-chain claim to the Fund's returns and collateral.`,
    buttonText: 'EMAIL DOCUSIGN LINK',
  },
  resendSignatureLink: {
    title: 'Resend Documents',
    description: `Please check your inbox for the LLC Agreement sent via DocuSign. If you haven't received it, check your spam folder or click below to resend.`,
    buttonText: 'RESEND DOCUSIGN LINK',
  },
  docUnderReview: {
    title: 'Under Review',
    description:
      'Your documents are being reviewed and you will be notified upon approval. Thank you for your patience. Any questions? Email invest@jia.xyz.',
    buttonText: 'THANK YOU',
  },
}

const LoadingCopiesByType: {
  [key: string]: {
    description: string
  }
} = {
  verificationStatus: {
    description: `Checking your verification status...`,
  },
  sendDocSignatureLink: {
    description: `Sending signature link...`,
  },
}

type Props = {
  poolInfo: PoolInfoType
  handleClose: () => void
}

export function EvaluationKYC({
  poolInfo,
  handleClose,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isDev = checkIsDev()
  const { account, chainId } = useWeb3React()
  const { kycProvider, code, kycPool } = useParamsSearch()
  const {
    isWalletOwnershipVerified,
    setError: setAuthError,
    error: authError,
  } = useAuthErrorHandling(isDev)
  const [loadingType, setLoadingType] = useState<
    'verificationStatus' | 'sendDocSignatureLink'
  >()
  const [kycCopy, setKYCCopy] = useState<KYCCopy>(JiaPoolCopies.verifyIdentity)
  const [KYCVerifyStatus, setKYCVerifyStatus] =
    useState<VerificationStatusResult>()
  const [docSignatureStatus, setDocSignatureStatus] =
    useState<DocSignatureStatus['status']>()
  const docSignatureCompleted = docSignatureStatus === 'completed'
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false)

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

  const { envelopeKey, envelopeLastQueryTimeKey, envelopeDocuSignStatusKey } =
    useMemo(() => {
      const envelopeKey = `${poolInfo.pool.toLowerCase()}-${account?.toLowerCase()}`
      const envelopeLastQueryTimeKey = `${envelopeKey}-last-query-time`
      const envelopeDocuSignStatusKey = `${envelopeKey}-docuSign-status`
      return {
        envelopeKey,
        envelopeLastQueryTimeKey,
        envelopeDocuSignStatusKey,
      }
    }, [account, poolInfo.pool])

  // DocuSign GET requests to any specific URL can be called not more often than once every 15 minutes.
  // https://developers.docusign.com/platform/api-guidelines/#:~:text=Polling,not%20once%20every%2010%20minutes
  const checkGetDocSignatureStatusIsAvailable = useCallback(() => {
    const lastQueryTime = localStorage.getItem(envelopeLastQueryTimeKey)
    if (!lastQueryTime) {
      return true
    }
    const lastQueryTimeNumber = Number(lastQueryTime)
    const now = timeUtil.getUnixTimestamp()
    const diff = now - lastQueryTimeNumber
    const fifteenMinutes = 15 * 60
    return diff > fifteenMinutes
  }, [envelopeLastQueryTimeKey])

  useEffect(() => {
    setKYCCopy(JiaPoolCopies.verifyIdentity)
    const docuSignStatus = localStorage.getItem(envelopeDocuSignStatusKey)
    setDocSignatureStatus(docuSignStatus as DocSignatureStatus['status'])
    if (docuSignStatus === 'completed') {
      setKYCCopy(JiaPoolCopies.docUnderReview)
      return
    }

    const fetchData = async () => {
      try {
        if (kycProvider && kycPool && account && chainId) {
          setLoadingType('verificationStatus')
          await IdentityService.onboard(
            account,
            code as string,
            kycPool as string,
            chainId,
            isDev,
          )
        }
      } catch (e) {
        try {
          setAuthError(e)
          setKYCCopy(JiaPoolCopies.signInRequired)
        } catch (e) {
          // The repeated call will throw an error of 401, so we can ignore it.
          console.log(e)
        }
      }

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
          if (verificationStatus.isVerified) {
            const envelopeId = localStorage.getItem(envelopeKey)
            if (!envelopeId) {
              setKYCCopy(JiaPoolCopies.emailSignatureLink)
            } else if (!checkGetDocSignatureStatusIsAvailable()) {
              setKYCCopy(JiaPoolCopies.resendSignatureLink)
            } else {
              const { status } = await IdentityService.getDocSignatureStatus(
                envelopeId,
                chainId,
                isDev,
              )
              localStorage.setItem(
                envelopeLastQueryTimeKey,
                String(timeUtil.getUnixTimestamp()),
              )
              localStorage.setItem(envelopeDocuSignStatusKey, status)
              setDocSignatureStatus(status)
              if (status === 'completed') {
                setKYCCopy(JiaPoolCopies.docUnderReview)
                // For voided and declined status, we need to send a new link
              } else if (['voided', 'declined'].includes(status)) {
                localStorage.removeItem(envelopeKey)
                localStorage.removeItem(envelopeLastQueryTimeKey)
                setKYCCopy(JiaPoolCopies.emailSignatureLink)
              } else {
                setKYCCopy(JiaPoolCopies.resendSignatureLink)
              }
            }
          }
        }
      } catch (e: unknown) {
        try {
          setAuthError(e)
          setKYCCopy(JiaPoolCopies.signInRequired)
        } catch (e) {
          console.error(e)
          dispatch(
            setError({
              errorMessage: 'Something went wrong, please try again later.',
            }),
          )
        }
      } finally {
        setLoadingType(undefined)
      }
    }
    fetchData()
  }, [
    account,
    chainId,
    checkGetDocSignatureStatusIsAvailable,
    code,
    dispatch,
    envelopeDocuSignStatusKey,
    envelopeKey,
    envelopeLastQueryTimeKey,
    isDev,
    kycPool,
    kycProvider,
    poolInfo.pool,
    setAuthError,
    isWalletOwnershipVerified,
  ])

  useEffect(() => {
    if (
      authError &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [4001, 'ACTION_REJECTED'].includes((authError as any).code)
    ) {
      dispatch(
        setError({
          errorMessage: 'User has rejected the transaction.',
        }),
      )
    }
  }, [authError, dispatch])

  const approveLender = async () => {
    if (docSignatureCompleted) {
      handleClose()
      return
    }

    const { isNotOnboarded, isVerified } = KYCVerifyStatus || {}

    if (!isVerified) {
      const issuerId = CHAINS[chainId!].isTestnet
        ? '53a66b32-583e-40e7-ba90-baf516d2cadd'
        : '5557baf5-d3c2-4c80-b522-c05a11c6e586'
      const baseUrl = configUtil.getKYCProviderBaseUrl(KYCProvider, chainId!)
      const originUrl = window.location.href.split('?')[0]
      const redirectUrl = `${originUrl}?poolName=${poolInfo.poolName}&chainId=${poolInfo.chainId}&poolType=${poolInfo.poolType}&kycProvider=${KYCProvider}&kycPool=${poolInfo.pool}`
      const providerAuthorizeUrl = `${baseUrl}/#/authorize?issuerId=${issuerId}&scope=details&details=verification&redirectUrl=${redirectUrl}`
      window.location.href = isNotOnboarded ? providerAuthorizeUrl : baseUrl
    } else {
      const envelopeId = localStorage.getItem(envelopeKey)
      try {
        setLoadingType('sendDocSignatureLink')
        if (!envelopeId) {
          const { envelopeId } = await IdentityService.requestDocSignature(
            account!,
            chainId!,
            isDev,
          )
          localStorage.setItem(envelopeKey, envelopeId)
          localStorage.setItem(
            envelopeLastQueryTimeKey,
            String(timeUtil.getUnixTimestamp()),
          )
          setOpenSnackBar(true)
          setKYCCopy(JiaPoolCopies.resendSignatureLink)
        } else {
          await IdentityService.resendDocSignatureLink(
            envelopeId,
            chainId!,
            isDev,
          )
          setOpenSnackBar(true)
        }
      } catch (e: unknown) {
        try {
          const { envelopeId } = await IdentityService.requestDocSignature(
            account!,
            chainId!,
            isDev,
          )
          localStorage.setItem(envelopeKey, envelopeId)
          localStorage.setItem(
            envelopeLastQueryTimeKey,
            String(timeUtil.getUnixTimestamp()),
          )
          setOpenSnackBar(true)
          setKYCCopy(JiaPoolCopies.resendSignatureLink)
        } catch (e) {
          setAuthError(e)
          setKYCCopy(JiaPoolCopies.signInRequired)
        }
      } finally {
        setLoadingType(undefined)
      }
    }
  }

  const getEmailLinkSentSnackbar = () => (
    <HumaSnackBar
      open={openSnackBar}
      title='Signature Link Sent'
      message='The secure signature session link has been sent to you via email.'
      severity='success'
      onClose={() => setOpenSnackBar(false)}
    />
  )

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
        {getEmailLinkSentSnackbar()}
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
