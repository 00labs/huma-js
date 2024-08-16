import { txAtom } from '@huma-finance/web-shared'
import { Box, css, TextField, Typography, useTheme } from '@mui/material'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useState } from 'react'

import {
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react'
import { useAppDispatch } from '../../hooks/useRedux'
import { resetState } from '../../store/widgets.reducers'
import { BottomButton } from '../BottomButton'
import { CheckIcon } from '../icons'
import { LoadingModal } from '../LoadingModal'
import { WrapperModal } from '../WrapperModal'

type Props = {
  handleSuccess: () => void
}

export function NotifiSubscriptionModal({
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
    frontendClientStatus: { isInitialized, isAuthenticated },
    frontendClient,
    login,
  } = useNotifiFrontendClientContext()
  const { fusionEventTopics } = useNotifiTenantConfigContext()
  const { subscribeAlertsDefault } = useNotifiTopicContext()
  const { renewTargetGroup } = useNotifiTargetContext()

  const handleEmailAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(event.target.value ?? ''))
    setEmailAddress(event.target.value)
  }

  const logInAndSubscribe = async (): Promise<void> => {
    if (!isAuthenticated) {
      setIsLoading(true)

      // Ask user to sign a message to authenticate
      try {
        await login()
      } catch (e) {
        setIsLoading(false)
        return
      }

      // Authorize this email address for this wallet
      await frontendClient.ensureTargetGroup({
        name: 'Default',
        emailAddress: emailAddress!,
      })

      await renewTargetGroup()
      const targetGroups = await frontendClient.getTargetGroups()
      const targetGroupId = targetGroups.find(
        (targetGroup) => targetGroup.name === 'Default',
      )?.id

      if (!targetGroupId) {
        console.error("Could not find targetGroupId for 'Default' target group")
        setIsLoading(false)
        return
      }

      await subscribeAlertsDefault(fusionEventTopics, targetGroupId)

      setShowSuccessScreen(true)
      setIsLoading(false)
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
          DONE
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
