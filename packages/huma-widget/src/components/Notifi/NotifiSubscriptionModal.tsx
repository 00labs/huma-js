import React, { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  NotifiFrontendClient,
  Uint8SignMessageFunction,
  SignMessageParams,
  CardConfigItemV1,
  DirectPushEventTypeItem,
  EventTypeItem,
  BroadcastEventTypeItem,
} from '@notifi-network/notifi-frontend-client'
import {
  checkIsDev,
  getBlockchainConfigFromChain,
  txAtom,
} from '@huma-finance/shared'
import { ethers } from 'ethers'
import {
  Box,
  Input,
  InputAdornment,
  Typography,
  css,
  useTheme,
} from '@mui/material'
import Email from '@mui/icons-material/Email'
import { useResetAtom } from 'jotai/utils'

import { WrapperModal } from '../WrapperModal'
import { BottomButton } from '../BottomButton'
import { LoadingModal } from '../LoadingModal'
import { CheckIcon } from '../icons'
import { resetState } from '../../store/widgets.reducers'
import { useAppDispatch } from '../../hooks/useRedux'
import { useNotifiClient } from '../../hooks/useNotifi'

type Props = {
  handleSuccess: () => void
}

function getIdFromEventType(eventType: EventTypeItem): string {
  if (eventType.type === 'directPush') {
    const directPushEventType = eventType as DirectPushEventTypeItem
    return (
      directPushEventType.directPushId as {
        value: string
      }
    ).value
  }
  if (eventType.type === 'broadcast') {
    const broadcastEventType = eventType as BroadcastEventTypeItem
    return (
      broadcastEventType.broadcastId as {
        value: string
      }
    ).value
  }

  return ''
}

async function fetchEventTypes(
  notifiClient: NotifiFrontendClient,
): Promise<(EventTypeItem & { enabled: boolean })[]> {
  const subscribedAlerts = await notifiClient.getAlerts()

  const subscriptionConfig = (await notifiClient.fetchSubscriptionCard({
    id: process.env.REACT_APP_NOTIFI_CONFIG_ID ?? '',
    type: 'SUBSCRIPTION_CARD',
  })) as CardConfigItemV1

  const eventTypes = subscriptionConfig?.eventTypes?.map(
    (eventType): EventTypeItem & { enabled: boolean } => {
      const eventTypeId = getIdFromEventType(eventType)
      let enabled = false
      // Check whether the user is subscribed to the event
      const subscribedAlert = subscribedAlerts?.find(
        (alert) => alert.filterOptions.indexOf(eventTypeId) >= 0,
      )

      if (subscribedAlert) {
        enabled = true
      }

      return {
        ...eventType,
        enabled,
      }
    },
  )

  return eventTypes
}

export function NotifiSubscriptionModal({
  handleSuccess,
}: Props): React.ReactElement {
  const theme = useTheme()
  const reset = useResetAtom(txAtom)
  const dispatch = useAppDispatch()
  const { account, chainId, provider } = useWeb3React()
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [emailValid, setEmailValid] = useState<boolean>()
  const { notifiClient } = useNotifiClient(account, chainId, checkIsDev())

  const signMessage: Uint8SignMessageFunction = async (
    message: Uint8Array,
  ): Promise<Uint8Array> => {
    const signer = provider!.getSigner()
    const signature = await signer.signMessage(Buffer.from(message))
    return ethers.utils.arrayify(signature)
  }

  const handleEmailAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(event.target.value ?? ''))
    setEmailAddress(event.target.value)
  }

  const logInAndSubscribe = async (): Promise<void> => {
    if (notifiClient != null && chainId != null) {
      setIsLoading(true)

      // Ask user to sign a message to authenticate
      try {
        await notifiClient.logIn({
          walletBlockchain: getBlockchainConfigFromChain(chainId),
          signMessage,
        } as SignMessageParams)
      } catch (e) {
        setIsLoading(false)
        return
      }

      // Fetch all event types
      const fetchedEventTypes = await fetchEventTypes(notifiClient)

      //   Authorize this email address for this wallet
      await notifiClient.ensureTargetGroup({
        name: 'Default',
        emailAddress: emailAddress!,
      })

      // Intentionally running this in serial because the Notifi ensureAlert can't handle
      // multiple calls. Notified their team to fix this.
      // eslint-disable-next-line no-restricted-syntax
      for (const eventType of fetchedEventTypes) {
        // eslint-disable-next-line no-await-in-loop
        await notifiClient.ensureAlert({
          eventType,
          inputs: {},
        })
      }

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
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      color: #a8a1b2;
      margin-top: ${theme.spacing(6)};
    `,
    inputField: css`
      width: 90%;
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
      <Typography variant='body2' margin={theme.spacing(1, 0)}>
        Connect your wallet to receive important emails about your account
      </Typography>
      <Box css={styles.inputWrapper}>
        <Input
          css={styles.inputField}
          type='email'
          value={emailAddress}
          onChange={handleEmailAddressChange}
          placeholder='youremail@example.com'
          startAdornment={
            <InputAdornment position='start'>
              <Email />
            </InputAdornment>
          }
        />
      </Box>
      <Box css={styles.disclaimer}>
        You can adjust these settings at any time by clicking the alert icon in
        the header
      </Box>
      <BottomButton
        variant='contained'
        onClick={logInAndSubscribe}
        disabled={!emailValid || isLoading}
      >
        CONNECT WALLET
      </BottomButton>
    </WrapperModal>
  )
}
