import { ChainEnum, getBlockchainConfigFromChain } from '@huma-finance/shared'
import { txAtom } from '@huma-finance/web-shared'
import { Box, css, TextField, Typography, useTheme } from '@mui/material'
import {
  EventTypeItem,
  NotifiFrontendClient,
  SignMessageParams,
  Uint8SignMessageFunction,
} from '@notifi-network/notifi-frontend-client'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useState } from 'react'

import { useNotifiClient } from '../../hooks/useNotifi'
import { useAppDispatch } from '../../hooks/useRedux'
import { resetState } from '../../store/widgets.reducers'
import { BottomButton } from '../BottomButton'
import { CheckIcon } from '../icons'
import { LoadingModal } from '../LoadingModal'
import { WrapperModal } from '../WrapperModal'

type Props = {
  handleSuccess: () => void
}

async function fetchEventTypes(
  notifiClient: NotifiFrontendClient,
  chainId: number | undefined,
): Promise<EventTypeItem[]> {
  let cardId = ''
  if (chainId === ChainEnum.Celo || chainId === ChainEnum.Alfajores) {
    cardId = process.env.REACT_APP_NOTIFI_CONFIG_ID_CELO ?? ''
  } else if (chainId === ChainEnum.Polygon || chainId === ChainEnum.Amoy) {
    cardId = process.env.REACT_APP_NOTIFI_CONFIG_ID_POLYGON ?? ''
  }

  const subscriptionConfig = await notifiClient.fetchTenantConfig({
    id: cardId ?? '',
    type: 'SUBSCRIPTION_CARD',
  })

  return subscriptionConfig.cardConfig.eventTypes as EventTypeItem[]
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
  const { notifiClient } = useNotifiClient(account, chainId)

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
      const fetchedEventTypes = await fetchEventTypes(notifiClient, chainId)

      // Authorize this email address for this wallet
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
        disabled={!emailValid || isLoading}
      >
        CONNECT EMAIL
      </BottomButton>
    </WrapperModal>
  )
}
