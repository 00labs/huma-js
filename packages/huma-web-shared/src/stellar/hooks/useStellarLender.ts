import { STELLAR_CHAINS_INFO, StellarPoolInfo } from '@huma-finance/shared'
import {
  Client as TrancheVaultClient,
  LenderRedemptionRecord,
} from '@huma-finance/soroban-tranche-vault'
import { useEffect, useState } from 'react'
import { useForceRefresh } from '../../hooks'
import { DepositRecord, fetchStellarDepositRecord } from '../utils'

export const useStellarLender = (
  stellarAddress: string | null,
  poolInfo: StellarPoolInfo,
): {
  isLoadingStellarLender: boolean
  isJuniorApprovedLender: boolean
  juniorRedemptionRecord: LenderRedemptionRecord | null
  juniorDepositRecord: DepositRecord | null
  juniorTrancheWithdrawable: bigint
  juniorTrancheShares: bigint
  isSeniorApprovedLender: boolean
  seniorRedemptionRecord: LenderRedemptionRecord | null
  seniorDepositRecord: DepositRecord | null
  seniorTrancheWithdrawable: bigint
  seniorTrancheShares: bigint
  refresh: () => void
} => {
  const [isLoadingStellarLender, setIsLoadingStellarLender] = useState(true)
  const [isJuniorApprovedLender, setIsJuniorApprovedLender] = useState(false)
  const [juniorRedemptionRecord, setJuniorRedemptionRecord] =
    useState<LenderRedemptionRecord | null>(null)
  const [juniorDepositRecord, setJuniorDepositRecord] =
    useState<DepositRecord | null>(null)
  const [juniorTrancheWithdrawable, setJuniorTrancheWithdrawable] =
    useState<bigint>(BigInt(0))
  const [juniorTrancheShares, setJuniorTrancheShares] = useState<bigint>(
    BigInt(0),
  )
  const [isSeniorApprovedLender, setIsSeniorApprovedLender] = useState(false)
  const [seniorRedemptionRecord, setSeniorRedemptionRecord] =
    useState<LenderRedemptionRecord | null>(null)
  const [seniorDepositRecord, setSeniorDepositRecord] =
    useState<DepositRecord | null>(null)
  const [seniorTrancheWithdrawable, setSeniorTrancheWithdrawable] =
    useState<bigint>(BigInt(0))
  const [seniorTrancheShares, setSeniorTrancheShares] = useState<bigint>(
    BigInt(0),
  )
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (!stellarAddress) {
        return
      }

      setIsLoadingStellarLender(true)
      try {
        const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
        const juniorTrancheVaultClient = new TrancheVaultClient({
          publicKey: stellarAddress,
          networkPassphrase: chainMetadata.networkPassphrase,
          contractId: poolInfo.juniorTranche,
          rpcUrl: chainMetadata.rpc,
        })
        const [
          isJuniorApproveLenderRes,
          juniorRedemptionRecordRes,
          juniorDepositRecordRes,
          juniorTrancheSharesRes,
        ] = await Promise.all([
          juniorTrancheVaultClient.is_approved_lender({
            account: stellarAddress,
          }),
          juniorTrancheVaultClient.get_latest_redemption_record({
            lender: stellarAddress,
          }),
          fetchStellarDepositRecord(poolInfo, 'junior', stellarAddress),
          juniorTrancheVaultClient.balance({ id: stellarAddress }),
        ])
        const isJuniorApprovedLenderVal = isJuniorApproveLenderRes.result
        const juniorRedemptionRecordVal = juniorRedemptionRecordRes.result
        setIsJuniorApprovedLender(isJuniorApprovedLenderVal)
        setJuniorRedemptionRecord(juniorRedemptionRecordVal)
        setJuniorDepositRecord(juniorDepositRecordRes)
        setJuniorTrancheWithdrawable(
          BigInt(
            juniorRedemptionRecordVal.total_amount_processed -
              juniorRedemptionRecordVal.total_amount_withdrawn,
          ),
        )
        setJuniorTrancheShares(juniorTrancheSharesRes.result)

        let isSeniorApprovedLenderVal = false
        let seniorRedemptionRecordVal = null
        if (poolInfo.seniorTranche) {
          const seniorTrancheVaultClient = new TrancheVaultClient({
            publicKey: stellarAddress,
            networkPassphrase: chainMetadata.networkPassphrase,
            contractId: poolInfo.seniorTranche,
            rpcUrl: chainMetadata.rpc,
          })
          const [
            isSeniorApproveLenderRes,
            seniorRedemptionRecordRes,
            seniorDepositRecordRes,
            seniorTrancheSharesRes,
          ] = await Promise.all([
            seniorTrancheVaultClient.is_approved_lender({
              account: stellarAddress,
            }),
            seniorTrancheVaultClient.get_latest_redemption_record({
              lender: stellarAddress,
            }),
            fetchStellarDepositRecord(poolInfo, 'senior', stellarAddress),
            seniorTrancheVaultClient.balance({ id: stellarAddress }),
          ])
          isSeniorApprovedLenderVal = isSeniorApproveLenderRes.result
          seniorRedemptionRecordVal = seniorRedemptionRecordRes.result

          setSeniorDepositRecord(seniorDepositRecordRes)
          setIsSeniorApprovedLender(isSeniorApprovedLenderVal)
          setSeniorRedemptionRecord(seniorRedemptionRecordVal)
          setSeniorTrancheWithdrawable(
            BigInt(
              seniorRedemptionRecordVal.total_amount_processed -
                seniorRedemptionRecordVal.total_amount_withdrawn,
            ),
          )
          setSeniorTrancheShares(seniorTrancheSharesRes.result)
        }
      } catch (error) {
        console.error('Error fetching Stellar lender data:', error)
      } finally {
        setIsLoadingStellarLender(false)
      }
    }

    fetchData()
  }, [stellarAddress, poolInfo, refreshCount])

  return {
    isLoadingStellarLender,
    isJuniorApprovedLender,
    juniorRedemptionRecord,
    juniorDepositRecord,
    juniorTrancheWithdrawable,
    juniorTrancheShares,
    isSeniorApprovedLender,
    seniorRedemptionRecord,
    seniorDepositRecord,
    seniorTrancheWithdrawable,
    seniorTrancheShares,
    refresh,
  }
}
