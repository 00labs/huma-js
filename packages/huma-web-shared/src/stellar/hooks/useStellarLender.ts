import { STELLAR_CHAINS_INFO, StellarPoolInfo } from '@huma-finance/shared'
import {
  Client as TrancheVaultClient,
  DepositRecord,
  LenderRedemptionRecord,
} from '@huma-finance/soroban-tranche-vault'
import { useEffect, useState } from 'react'
import { stellarTryFn } from '../utils'

export const useStellarLender = (
  stellarAddress: string,
  poolInfo: StellarPoolInfo,
): {
  isLoadingStellarLender: boolean
  isJuniorApprovedLender: boolean
  juniorDepositRecord: DepositRecord | null
  juniorRedemptionRecord: LenderRedemptionRecord | null
  isSeniorApprovedLender: boolean
  seniorDepositRecord: DepositRecord | null
  seniorRedemptionRecord: LenderRedemptionRecord | null
} => {
  const [isLoadingStellarLender, setIsLoadingStellarLender] = useState(true)
  const [isJuniorApprovedLender, setIsJuniorApprovedLender] = useState(false)
  const [juniorDepositRecord, setJuniorDepositRecord] =
    useState<DepositRecord | null>(null)
  const [juniorRedemptionRecord, setJuniorRedemptionRecord] =
    useState<LenderRedemptionRecord | null>(null)
  const [isSeniorApprovedLender, setIsSeniorApprovedLender] = useState(false)
  const [seniorDepositRecord, setSeniorDepositRecord] =
    useState<DepositRecord | null>(null)
  const [seniorRedemptionRecord, setSeniorRedemptionRecord] =
    useState<LenderRedemptionRecord | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingStellarLender(true)
      try {
        const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
        const juniorTrancheVaultClient = new TrancheVaultClient({
          publicKey: stellarAddress,
          networkPassphrase: chainMetadata.networkPassphrase,
          contractId: poolInfo.juniorTranche,
          rpcUrl: chainMetadata.rpc,
        })
        const [isJuniorApproveLenderRes, juniorRedemptionRecordRes] =
          await Promise.all([
            juniorTrancheVaultClient.is_approved_lender({
              account: stellarAddress,
            }),
            juniorTrancheVaultClient.get_latest_redemption_record({
              lender: stellarAddress,
            }),
          ])
        const isJuniorApprovedLenderVal = isJuniorApproveLenderRes.result
        const juniorRedemptionRecordVal = juniorRedemptionRecordRes.result

        let isSeniorApprovedLenderVal = false
        let seniorDepositRecordVal = null
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
            seniorDepositRecordRes,
            seniorRedemptionRecordRes,
          ] = await Promise.all([
            seniorTrancheVaultClient.is_approved_lender({
              account: stellarAddress,
            }),
            seniorTrancheVaultClient.get_latest_redemption_record({
              lender: stellarAddress,
            }),
          ])
          isSeniorApprovedLenderVal = isSeniorApproveLenderRes.result
          seniorDepositRecordVal = seniorDepositRecordRes.result
          seniorRedemptionRecordVal = seniorRedemptionRecordRes.result
        }

        setIsJuniorApprovedLender(isJuniorApprovedLenderVal)
        setJuniorRedemptionRecord(juniorRedemptionRecordVal)
        setIsSeniorApprovedLender(isSeniorApprovedLenderVal)
        setSeniorDepositRecord(seniorDepositRecordVal)
        setSeniorRedemptionRecord(seniorRedemptionRecordVal)
      } catch (error) {
        console.error('Error fetching Stellar lender data:', error)
      } finally {
        setIsLoadingStellarLender(false)
      }
    }

    fetchData()
  }, [stellarAddress, poolInfo, juniorDepositRecord])

  return {
    isLoadingStellarLender,
    isJuniorApprovedLender,
    juniorDepositRecord,
    juniorRedemptionRecord,
    isSeniorApprovedLender,
    seniorDepositRecord,
    seniorRedemptionRecord,
  }
}
