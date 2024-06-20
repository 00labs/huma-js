import { useEffect, useState } from 'react'
import {
  checkIsDev,
  doesChainSupportNotifi,
  getBlockchainConfigFromChain,
} from '@huma-finance/shared'
import {
  NotifiFrontendClient,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client'

export const useDoesChainSupportNotifi = (chainId: number | undefined) => {
  const [notifiChainSupported, setNotifiChainSupported] = useState(false)

  useEffect(() => {
    const checkNotifiChainSupported = async () => {
      if (chainId != null) {
        setNotifiChainSupported(doesChainSupportNotifi(chainId, checkIsDev()))
      }
    }

    checkNotifiChainSupported()
  }, [chainId])

  return { notifiChainSupported }
}

export const useNotifiClient = (
  account: string | undefined,
  chainId: number | undefined,
) => {
  const [notifiClient, setNotifiClient] = useState<NotifiFrontendClient | null>(
    null,
  )
  const { notifiChainSupported } = useDoesChainSupportNotifi(chainId)

  useEffect(() => {
    const createNotifiClient = async () => {
      if (account != null && chainId != null && notifiChainSupported) {
        const client = newFrontendClient({
          account: { publicKey: account },
          tenantId: 'humafinanceprod',
          env: 'Production',
          walletBlockchain: getBlockchainConfigFromChain(chainId),
        })
        await client.initialize()
        setNotifiClient(client)
      }
    }

    createNotifiClient()
  }, [account, chainId, notifiChainSupported])

  return { notifiClient }
}

export const useIsFirstTimeNotifiUser = (
  account: string | undefined,
  chainId: number | undefined,
) => {
  const [isFirstTimeNotifiUser, setIsFirstTimeNotifiUser] = useState(false)
  const { notifiClient } = useNotifiClient(account, chainId)
  const { notifiChainSupported } = useDoesChainSupportNotifi(chainId)

  useEffect(() => {
    const checkIsFirstTimeNotifiUser = async () => {
      if (notifiClient != null && notifiChainSupported) {
        const { userState } = notifiClient
        // If the user is not authenticated or expired, they are a first time user
        if (
          userState == null ||
          (userState.status !== 'authenticated' &&
            userState.status !== 'expired')
        ) {
          setIsFirstTimeNotifiUser(true)
        } else if (userState.status === 'authenticated') {
          // If a user is authenticated, check if they have a target group (AKA email)
          // associated with their wallet. If they do not, show them the notifi onboarding flow.
          const targetGroups = await notifiClient.getTargetGroups()
          const emailTargets = targetGroups[0]?.emailTargets?.[0]

          if (emailTargets == null || emailTargets.emailAddress == null) {
            setIsFirstTimeNotifiUser(true)
          }
        }
      }
    }

    checkIsFirstTimeNotifiUser()
  }, [notifiChainSupported, notifiClient])

  return { isFirstTimeNotifiUser }
}
