import { BN } from '@coral-xyz/anchor'
import {
  getSolanaNetworkType,
  PermissionlessDepositCommitment,
  PermissionlessDepositMode,
  PermissionlessRewardsMetadata,
  PermissionlessService,
  PermissionlessUserFeathersBoosters,
  SOLANA_BP_FACTOR_NUMBER,
  SOLANA_CHAINS,
  SOLANA_DECIMALS,
  SOLANA_SHARE_PRICE_SCALING_FACTOR_BN,
  SolanaChainEnum,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import {
  getAccount,
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getPermissonlessLpFeathersMultiplier,
  getPermissonlessLpFeathersPerMonth,
} from 'src/utils'
import { checkIsDev } from 'src/utils/checkIsDev'
import { tryGetPermissionlessVoter } from '../utils'
import {
  usePermissionlessProgram,
  usePermissionlessStakeProgram,
} from './useProgram'

export function usePermissionlessRewardsMetadata(chainId: SolanaChainEnum) {
  const [rewardsMetadata, setRewardsMetadata] = useState<
    PermissionlessRewardsMetadata | undefined
  >(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const isDev = checkIsDev()

  useEffect(() => {
    const fetchRewardsMetadata = async () => {
      const rewardsMetadata =
        await PermissionlessService.getPermissionlessRewardsMetadata(
          getSolanaNetworkType(chainId),
          isDev,
        )
      setRewardsMetadata(rewardsMetadata)
      setIsLoaded(true)
    }
    fetchRewardsMetadata()
  }, [chainId, isDev])

  return {
    rewardsMetadata,
    isLoaded,
  }
}

export function usePermissionlessFeathersBoosters(chainId: SolanaChainEnum) {
  const [feathersBoosters, setFeathersBoosters] = useState<
    PermissionlessUserFeathersBoosters | undefined
  >(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const isDev = checkIsDev()

  useEffect(() => {
    const fetchFeathersBoosters = async () => {
      const feathersBoosters =
        await PermissionlessService.getUserFeathersBoosters(
          getSolanaNetworkType(chainId),
          isDev,
        )
      setFeathersBoosters(feathersBoosters)
      setIsLoaded(true)
    }
    fetchFeathersBoosters()
  }, [chainId, isDev])

  return {
    feathersBoosters,
    isLoaded,
  }
}

export function usePermissionlessModeConfig(chainId: SolanaChainEnum) {
  const program = usePermissionlessProgram()
  const [classicTargetApyBps, setClassicTargetApyBps] = useState<
    number | undefined
  >(undefined)
  const [maxiTargetApyBps, setMaxiTargetApyBps] = useState<number | undefined>(
    undefined,
  )
  const [isLoaded, setIsLoaded] = useState(false)
  const solanaChainInfo = SOLANA_CHAINS[chainId]

  const getApy = useCallback((apyBps?: number) => {
    if (apyBps === undefined || apyBps === null) {
      return undefined
    }

    return apyBps / SOLANA_BP_FACTOR_NUMBER
  }, [])

  useEffect(() => {
    const fetchModeConfig = async () => {
      const [classicModeConfig, maxiModeConfig] =
        await program.account.modeConfig.fetchMultiple([
          new PublicKey(solanaChainInfo.classicModeConfig),
          new PublicKey(solanaChainInfo.maxiModeConfig),
        ])
      setClassicTargetApyBps(classicModeConfig?.targetApyBps)
      setMaxiTargetApyBps(maxiModeConfig?.targetApyBps)
      setIsLoaded(true)
    }
    fetchModeConfig()
  }, [program, solanaChainInfo])

  return {
    classicTargetApy: getApy(classicTargetApyBps),
    maxiTargetApy: getApy(maxiTargetApyBps),
    isLoaded,
  }
}

export function usePermissionlessVoter() {
  const program = usePermissionlessStakeProgram()
  const [permissionlessStakedHuma, setPermissionlessStakedHuma] = useState<
    BN | undefined
  >(undefined)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchVoter = async () => {
      const voter = await tryGetPermissionlessVoter(program.programId, program)
      const permissionlessStakedHuma = voter?.deposits.reduce(
        (acc, deposit) => acc.add(deposit.amountDepositedNative),
        new BN(0),
      )
      setPermissionlessStakedHuma(permissionlessStakedHuma)
      setIsLoaded(true)
    }
    fetchVoter()
  }, [program])

  return {
    permissionlessStakedHuma,
    isLoaded,
  }
}

export function usePermissionlessLenderInfo(chainId: SolanaChainEnum) {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const program = usePermissionlessStakeProgram()
  const [totalShares, setTotalShares] = useState<BN>(new BN(0))
  const [isLoaded, setIsLoaded] = useState(false)
  const solanaChainInfo = SOLANA_CHAINS[chainId]

  const getLenderModeTokenAccount = useCallback(
    async (lenderModeTokenATA: PublicKey, mode: string) => {
      try {
        const account = await getAccount(
          connection,
          lenderModeTokenATA,
          undefined,
          TOKEN_PROGRAM_ID,
        )
        return account
      } catch (error) {
        if (!(error instanceof TokenAccountNotFoundError)) {
          console.warn(`Error fetching ${mode} token account:`, error)
        }
        return undefined
      }
    },
    [connection],
  )

  useEffect(() => {
    if (!publicKey) {
      return
    }

    const lenderClassicModeTokenATA = getAssociatedTokenAddressSync(
      new PublicKey(solanaChainInfo.classicModeMint),
      publicKey,
      true,
      TOKEN_PROGRAM_ID,
    )

    const lenderMaxiModeTokenATA = getAssociatedTokenAddressSync(
      new PublicKey(solanaChainInfo.maxiModeMint),
      publicKey,
      true,
      TOKEN_PROGRAM_ID,
    )

    const fetchLenderInfo = async () => {
      const [lenderClassicModeTokenAccount, lenderMaxiModeTokenAccount] =
        await Promise.all([
          getLenderModeTokenAccount(lenderClassicModeTokenATA, 'Classic'),
          getLenderModeTokenAccount(lenderMaxiModeTokenATA, 'Maxi'),
        ])

      const lenderClassicModeTokenAmount = lenderClassicModeTokenAccount?.amount
        ? new BN(lenderClassicModeTokenAccount.amount.toString())
        : new BN(0)
      const lenderMaxiModeTokenAmount = lenderMaxiModeTokenAccount?.amount
        ? new BN(lenderMaxiModeTokenAccount.amount.toString())
        : new BN(0)
      setTotalShares(
        lenderClassicModeTokenAmount.add(lenderMaxiModeTokenAmount),
      )
      setIsLoaded(true)
    }
    fetchLenderInfo()
  }, [
    getLenderModeTokenAccount,
    program,
    publicKey,
    solanaChainInfo.classicModeMint,
    solanaChainInfo.maxiModeMint,
  ])

  return {
    totalShares,
    isLoaded,
  }
}

export const useModeSharePrice = (chainId: SolanaChainEnum) => {
  const { connection } = useConnection()
  const program = usePermissionlessProgram()
  const solanaChainInfo = SOLANA_CHAINS[chainId]
  const [classicModeAssets, setClassicModeAssets] = useState<number>()
  const [maxiModeAssets, setMaxiModeAssets] = useState<number>()
  const [classicTotalSupply, setClassicTotalSupply] = useState<bigint>()
  const [maxiTotalSupply, setMaxiTotalSupply] = useState<bigint>()
  const [classicSharePriceBN, setClassicSharePriceBN] = useState<BN>()
  const [maxiSharePriceBN, setApeSharePriceBN] = useState<BN>()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const getPerSharePriceBN = useCallback(
    (totalAssets: bigint, totalSupply: bigint): BN => {
      if (totalAssets && totalSupply && totalSupply > 0) {
        return new BN(totalAssets.toString())
          .mul(SOLANA_SHARE_PRICE_SCALING_FACTOR_BN)
          .div(new BN(totalSupply.toString()))
      }

      return SOLANA_SHARE_PRICE_SCALING_FACTOR_BN
    },
    [],
  )

  const amountToShares = useCallback(
    (amount: BN, selectedMode: PermissionlessDepositMode) => {
      const sharePriceBN =
        selectedMode === PermissionlessDepositMode.CLASSIC
          ? classicSharePriceBN
          : maxiSharePriceBN

      if (!sharePriceBN) {
        return new BN(0)
      }

      try {
        return amount
          .mul(SOLANA_SHARE_PRICE_SCALING_FACTOR_BN)
          .div(sharePriceBN)
      } catch (error) {
        console.error(amount.toString())
        console.error(error)
        return new BN(0)
      }
    },
    [classicSharePriceBN, maxiSharePriceBN],
  )

  useEffect(() => {
    const fetchPoolStateAccount = async () => {
      const poolStateAccount = await program.account.poolState.fetch(
        solanaChainInfo.poolState,
      )
      const { modeStates } = poolStateAccount
      const classicModeAssets = modeStates[0].assets.toNumber()
      const maxiModeAssets = modeStates[1].assets.toNumber()
      setClassicModeAssets(classicModeAssets)
      setMaxiModeAssets(maxiModeAssets)
    }
    fetchPoolStateAccount()
  }, [program.account.poolState, solanaChainInfo.poolState])

  useEffect(() => {
    const fetchModeMintAccount = async () => {
      const classicModeMintAccount = await getMint(
        connection,
        new PublicKey(solanaChainInfo.classicModeMint),
        undefined,
        TOKEN_PROGRAM_ID,
      )
      const maxiModeMintAccount = await getMint(
        connection,
        new PublicKey(solanaChainInfo.maxiModeMint),
        undefined,
        TOKEN_PROGRAM_ID,
      )
      setClassicTotalSupply(classicModeMintAccount.supply)
      setMaxiTotalSupply(maxiModeMintAccount.supply)
    }
    fetchModeMintAccount()
  }, [
    connection,
    solanaChainInfo.classicModeMint,
    solanaChainInfo.maxiModeMint,
  ])

  useEffect(() => {
    if (
      !classicModeAssets ||
      !maxiModeAssets ||
      !classicTotalSupply ||
      !maxiTotalSupply
    ) {
      return
    }

    const classicSharePriceBN = getPerSharePriceBN(
      BigInt(classicModeAssets),
      classicTotalSupply,
    )

    const maxiSharePriceBN = getPerSharePriceBN(
      BigInt(maxiModeAssets),
      maxiTotalSupply,
    )

    setClassicSharePriceBN(classicSharePriceBN)
    setApeSharePriceBN(maxiSharePriceBN)
    setIsLoaded(true)
  }, [
    classicModeAssets,
    classicTotalSupply,
    getPerSharePriceBN,
    maxiModeAssets,
    maxiTotalSupply,
  ])

  return {
    isLoaded,
    amountToShares,
    classicSharePriceBN,
    maxiSharePriceBN,
  }
}

export function usePermissionlessApy(
  chainId: SolanaChainEnum,
  selectedMode: PermissionlessDepositMode,
  depositCommitment: PermissionlessDepositCommitment,
  baseAmountBN: BN,
) {
  const { rewardsMetadata, isLoaded: isRewardsMetadataLoaded } =
    usePermissionlessRewardsMetadata(chainId)
  const { feathersBoosters, isLoaded: isFeathersBoostersLoaded } =
    usePermissionlessFeathersBoosters(chainId)
  const {
    classicTargetApy,
    maxiTargetApy,
    isLoaded: isModeConfigLoaded,
  } = usePermissionlessModeConfig(chainId)
  const { permissionlessStakedHuma, isLoaded: isVoterLoaded } =
    usePermissionlessVoter()
  const { totalShares, isLoaded: isLenderInfoLoaded } =
    usePermissionlessLenderInfo(chainId)
  const { amountToShares, isLoaded: isModeSharePriceLoaded } =
    useModeSharePrice(chainId)

  const isLoaded =
    isRewardsMetadataLoaded &&
    isFeathersBoostersLoaded &&
    isModeConfigLoaded &&
    isVoterLoaded &&
    isLenderInfoLoaded &&
    isModeSharePriceLoaded

  baseAmountBN = baseAmountBN.eq(new BN(0)) ? new BN(1000000) : baseAmountBN
  const modeTargetApy =
    selectedMode === PermissionlessDepositMode.CLASSIC
      ? classicTargetApy
      : maxiTargetApy
  const ogMultiplier = feathersBoosters?.og ? feathersBoosters.og : 1
  const vanguardMultiplier = feathersBoosters?.vanguard
    ? feathersBoosters.vanguard
    : 1
  const communityMultiplier = feathersBoosters?.community
    ? feathersBoosters.community
    : 1

  const humaRewardsApy = useMemo(() => {
    if (!isLoaded) {
      return undefined
    }

    const baseAmountShares = amountToShares(baseAmountBN, selectedMode)
    const humaAmountBN = permissionlessStakedHuma ?? new BN(0)
    const feathersMultiplier = getPermissonlessLpFeathersMultiplier(
      selectedMode,
      depositCommitment,
      {
        og: ogMultiplier,
        vanguard: vanguardMultiplier,
        community: communityMultiplier,
      },
      humaAmountBN,
      totalShares,
    )
    const feathersPerYear =
      getPermissonlessLpFeathersPerMonth(
        Number(SolanaTokenUtils.formatUnits(baseAmountShares, SOLANA_DECIMALS)),
        Number(feathersMultiplier),
      ) * 12
    const baseAmount = SolanaTokenUtils.formatUnits(
      baseAmountBN,
      SOLANA_DECIMALS,
    )
    const usdcRewardsPerYear =
      feathersPerYear * Number(rewardsMetadata!.usdPerFeather)
    const humaRewardsApy = usdcRewardsPerYear / Number(baseAmount)

    return humaRewardsApy
  }, [
    amountToShares,
    baseAmountBN,
    communityMultiplier,
    depositCommitment,
    isLoaded,
    ogMultiplier,
    permissionlessStakedHuma,
    rewardsMetadata,
    selectedMode,
    totalShares,
    vanguardMultiplier,
  ])

  return {
    modeTargetApy,
    humaRewardsApy,
    isLoaded,
  }
}
