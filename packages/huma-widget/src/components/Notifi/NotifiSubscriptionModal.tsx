import { txAtom } from '@huma-finance/web-shared'
import { Box, css, TextField, Typography, useTheme } from '@mui/material'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useEffect, useState } from 'react'

import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react'
import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client'
import { useAppDispatch } from '../../hooks/useRedux'
import { resetState } from '../../store/widgets.reducers'
import { BottomButton } from '../BottomButton'
import { CheckIcon } from '../icons'
import { LoadingModal } from '../LoadingModal'
import { WrapperModal } from '../WrapperModal'

type Props = {
  successText?: string
  handleSuccess: () => void
}

const validateDefaultTargetGroup = async (
  frontendClient: NotifiFrontendClient,
) => {
  // NOTE: this extra request is necessary as the targetGroupId state in NotifiTargetContext will not be updated constantly right after login
  const targetGroup = (
    await frontendClient?.fetchFusionData()
  )?.targetGroup?.find((group) => group?.name === 'Default')
  return !!targetGroup
}

export function NotifiSubscriptionModal({
  successText,
  handleSuccess,
}: Props): React.ReactElement {
  const theme = useTheme()
  const reset = useResetAtom(txAtom)
  const dispatch = useAppDispatch()
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [emailValid, setEmailValid] = useState<boolean>()
  const {
    frontendClientStatus: { isInitialized, isAuthenticated, isExpired },
    frontendClient,
    login,
  } = useNotifiFrontendClientContext()
  const { fusionEventTopics } = useNotifiTenantConfigContext()
  const { subscribeAlertsDefault } = useNotifiTopicContext()
  const {
    targetDocument: { targetGroupId },
    updateTargetInputs,
    renewTargetGroup,
  } = useNotifiTargetContext()
  const {
    ftuStage,
    isLoading: isLoadingFtuStage,
    updateFtuStage,
  } = useNotifiUserSettingContext()

  const handleEmailAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(event.target.value ?? ''))
    setEmailAddress(event.target.value)
  }

  useEffect(() => {
    async function subscribe() {
      if (
        !isInitialized ||
        !isAuthenticated ||
        !targetGroupId ||
        isLoadingFtuStage
      ) {
        return
      }

      // If a user is authenticated but already finished with the FTU (First Time User) setup
      // (AKA their login expired and they logged back in), then we can skip the subscription step.
      if (ftuStage !== FtuStage.Done) {
        await updateTargetInputs('email', { value: emailAddress! })
        // Authorize this email address for this wallet

        if (!targetGroupId) {
          setIsLoading(false)
          return
        }

        await subscribeAlertsDefault(fusionEventTopics, targetGroupId)
        await updateFtuStage(FtuStage.Done)

        const targetGroup = (
          await frontendClient?.fetchFusionData()
        )?.targetGroup?.find((group) => group?.name === 'Default')
        const emailTarget = targetGroup?.emailTargets?.[0]
        if (emailTarget && !emailTarget.isConfirmed) {
          await frontendClient.sendEmailTargetVerification({
            targetId: emailTarget.id,
          })
        }
      }

      setShowSuccessScreen(true)
      setIsLoading(false)
    }

    subscribe()
  }, [
    isInitialized,
    isAuthenticated,
    targetGroupId,
    updateTargetInputs,
    emailAddress,
    subscribeAlertsDefault,
    fusionEventTopics,
    updateFtuStage,
    isLoadingFtuStage,
    ftuStage,
    frontendClient,
  ])

  useEffect(() => {
    const loginIfExpired = async () => {
      if (isExpired) {
        await login()
      }
    }

    loginIfExpired()
  }, [isExpired, login])

  const logInAndSubscribe = async (): Promise<void> => {
    if (!isAuthenticated) {
      setIsLoading(true)

      // Ask user to sign a message to authenticate
      try {
        await login()

        const isDefaultTargetExist =
          await validateDefaultTargetGroup(frontendClient)

        if (!isDefaultTargetExist) {
          await renewTargetGroup()
        }
      } catch (e) {
        setIsLoading(false)
      }
    }
  }

  const handleCloseModal = useCallback(() => {
    reset()
    dispatch(resetState())
    handleSuccess()
  }, [dispatch, handleSuccess, reset])

  const styles = {
    disclaimer: css`
      ${theme.cssMixins.rowCentered};
      font-weight: 400;
      font-size: 16px;
      color: ${theme.palette.text.secondary};
      margin-top: ${theme.spacing(6)};
    `,
    inputField: css`
      width: 100%;
      font-size: 16px;
    `,
    inputWrapper: css`
      width: 100%;
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(-0.5)};
    `,
    check: css`
      width: 100%;
      ${theme.cssMixins.rowHCentered};
      margin-top: ${theme.spacing(10)};
    `,
  }

  if (isLoading) {
    return <LoadingModal title='Notifications' />
  }

  if (showSuccessScreen) {
    return (
      <WrapperModal
        title='Success'
        subTitle='You successfully connected your email'
      >
        <Box css={styles.check}>
          <CheckIcon />
        </Box>
        <BottomButton variant='contained' onClick={handleCloseModal}>
          {successText ?? 'DONE'}
        </BottomButton>
      </WrapperModal>
    )
  }

  return (
    <WrapperModal title='Connect Your Email'>
      <Typography variant='body2' margin={theme.spacing(6, 0, 4, 0)}>
        Connect your emails to receive important update about your account.
      </Typography>
      <Box css={styles.inputWrapper}>
        <TextField
          css={styles.inputField}
          label='Your Email'
          type='email'
          value={emailAddress}
          onChange={handleEmailAddressChange}
          variant='outlined'
          color='primary'
          focused
        />
      </Box>
      <Box css={styles.disclaimer}>
        You can adjust these settings at any time by clicking the alert icon in
        the header.
      </Box>
      <BottomButton
        variant='contained'
        onClick={logInAndSubscribe}
        disabled={!emailValid || isLoading || !isInitialized}
      >
        CONNECT EMAIL
      </BottomButton>
    </WrapperModal>
  )
}
