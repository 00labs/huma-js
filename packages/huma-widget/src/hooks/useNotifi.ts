import { useEffect, useState } from 'react'
import {
  doesChainSupportNotifi,
  getBlockchainConfigFromChain,
} from '@huma-finance/shared'
import { newFrontendClient } from '@notifi-network/notifi-frontend-client'
import { envUtil } from '../utils/env'

export const useIsFirstTimeNotifiUser = (
  account: string | undefined,
  chainId: number | undefined,
) => {
  const [isFirstTimeNotifiUser, setIsFirstTimeNotifiUser] = useState(false)

  useEffect(() => {
    const checkIsFirstTimeNotifiUser = async () => {
      if (account != null && chainId != null) {
        const client = newFrontendClient({
          account: { publicKey: account },
          tenantId: 'humadapp',
          env: envUtil.checkIsDev() ? 'Development' : 'Production',
          walletBlockchain: getBlockchainConfigFromChain(chainId),
        })

        const userState = await client.initialize()

        // If the user is not authenticated or expired, they are a first time user
        if (
          userState.status !== 'authenticated' &&
          userState.status !== 'expired'
        ) {
          setIsFirstTimeNotifiUser(true)
        } else if (userState.status === 'authenticated') {
          // If a user is authenticated, check if they have a target group (AKA email)
          // associated with their wallet. If they do not, show them the notifi onboarding flow.
          const targetGroups = await client.getTargetGroups()
          const emailTargets = targetGroups[0]?.emailTargets?.[0]

          if (emailTargets == null || emailTargets.emailAddress == null) {
            setIsFirstTimeNotifiUser(true)
          }
        }
      }
    }

    checkIsFirstTimeNotifiUser()
  }, [account, chainId])

  return { isFirstTimeNotifiUser }
}

export const useDoesChainSupportNotifi = (
  account: string | undefined,
  chainId: number | undefined,
) => {
  const [notifiChainSupported, setNotifiChainSupported] = useState(false)

  useEffect(() => {
    const checkNotifiChainSupported = async () => {
      if (account != null && chainId != null) {
        setNotifiChainSupported(
          doesChainSupportNotifi(chainId, envUtil.checkIsDev(), account),
        )
      }
    }

    checkNotifiChainSupported()
  }, [account, chainId])

  return { notifiChainSupported }
}
