import {
  getPoolUnderlyingTokenInfoV2,
  POOL_NAME,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

export const usePoolUnderlyingTokenInfo = (
  poolName: POOL_NAME,
  defaultPoolUnderlyingTokenInfo: UnderlyingTokenInfo | undefined,
) => {
  const { chainId, provider } = useWeb3React()
  const [poolUnderlyingToken, setPoolUnderlyingToken] = useState<
    UnderlyingTokenInfo | null | undefined
  >(defaultPoolUnderlyingTokenInfo)

  useEffect(() => {
    if (!poolUnderlyingToken && chainId && provider) {
      const fetchUnderlyingTokenInfo = async () => {
        const underlyingTokenInfo = await getPoolUnderlyingTokenInfoV2(
          poolName,
          provider,
        )
        setPoolUnderlyingToken(underlyingTokenInfo)
      }
      fetchUnderlyingTokenInfo()
    }
  }, [chainId, poolName, provider, poolUnderlyingToken])

  return poolUnderlyingToken
}
