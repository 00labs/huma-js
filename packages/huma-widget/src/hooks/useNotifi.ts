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
import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react'

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

// Check if user is authenticated
// If not authenticated or expired, have user login
// After login, check FTU stage
// If FTU stage is not Done, go to signup flow. Otherwise, skip to next step

export const useIsFirstTimeNotifiUser = (
  account: string | undefined,
  chainId: number | undefined,
) => {
  const [isFirstTimeNotifiUser, setIsFirstTimeNotifiUser] = useState(false)
  const {
    frontendClientStatus: { isInitialized, isAuthenticated, isExpired },
  } = useNotifiFrontendClientContext()
  const { ftuStage, isLoading: isLoadingFtu } = useNotifiUserSettingContext()
  const { notifiChainSupported } = useDoesChainSupportNotifi(chainId)

  useEffect(() => {
    const checkIsFirstTimeNotifiUser = async () => {
      if (isInitialized && notifiChainSupported) {
        // If the user is not authenticated or expired, they are possibly a first time user.
        if (!isAuthenticated || isExpired) {
          setIsFirstTimeNotifiUser(true)
        } else if (isAuthenticated) {
          // If a user is authenticated, check if they've completed all the FTU (First Time User) stages.
          if (ftuStage !== FtuStage.Done) {
            setIsFirstTimeNotifiUser(true)
          }
        }
      }
    }

    checkIsFirstTimeNotifiUser()
  }, [
    ftuStage,
    isAuthenticated,
    isExpired,
    isInitialized,
    isLoadingFtu,
    notifiChainSupported,
  ])

  return { isFirstTimeNotifiUser }
}
