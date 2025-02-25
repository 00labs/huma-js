import {
  downScale,
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
} from '@huma-finance/shared'
import {
  CreditConfig,
  CreditRecord,
  Client as CreditStorageClient,
  DueDetail,
} from '@huma-finance/soroban-credit-storage'
import { Client as PoolCreditClient } from '@huma-finance/soroban-pool-credit'
import { useEffect, useState } from 'react'
import { useForceRefresh } from '../../hooks'

export const useStellarBorrower = (
  stellarAddress: string | null,
  poolInfo: StellarPoolInfo,
): {
  isLoadingStellarBorrower: boolean
  creditRecord: CreditRecord | null
  creditConfig: CreditConfig | null
  dueDetail: DueDetail | null
  creditAvailable: number
  principal: number
  totalDue: number
  refresh: () => void
} => {
  const [isLoadingStellarBorrower, setIsLoadingStellarBorrower] = useState(true)
  const [creditRecord, setCreditRecord] = useState<CreditRecord | null>(null)
  const [creditConfig, setCreditConfig] = useState<CreditConfig | null>(null)
  const [dueDetail, setDueDetail] = useState<DueDetail | null>(null)
  const [creditAvailable, setCreditAvailable] = useState<bigint>(BigInt(0))
  const [principal, setPrincipal] = useState<bigint>(BigInt(0))
  const [totalDue, setTotalDue] = useState<bigint>(BigInt(0))
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (!stellarAddress) {
        return
      }

      setIsLoadingStellarBorrower(true)
      try {
        const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
        const creditStorageClient = new CreditStorageClient({
          publicKey: stellarAddress,
          networkPassphrase: chainMetadata.networkPassphrase,
          contractId: poolInfo.creditStorage,
          rpcUrl: chainMetadata.rpc,
        })
        const poolCreditClient = new PoolCreditClient({
          publicKey: stellarAddress,
          networkPassphrase: chainMetadata.networkPassphrase,
          contractId: poolInfo.poolCredit,
          rpcUrl: chainMetadata.rpc,
        })
        const creditHashPromise = creditStorageClient.get_credit_hash({
          borrower: stellarAddress,
        })
        const [creditRecord, creditConfig, dueDetail, availableForDrawdown] =
          await Promise.all([
            creditHashPromise.then((creditHash) =>
              creditStorageClient.get_credit_record({
                credit_hash: Buffer.from(creditHash.result),
              }),
            ),
            creditHashPromise.then((creditHash) =>
              creditStorageClient.get_credit_config({
                credit_hash: Buffer.from(creditHash.result),
              }),
            ),
            creditHashPromise.then((creditHash) =>
              creditStorageClient.get_due_detail({
                credit_hash: Buffer.from(creditHash.result),
              }),
            ),
            poolCreditClient.get_amt_available_for_drawdown({
              borrower: stellarAddress,
            }),
          ])
        const creditRecordVal = creditRecord.result
        const creditConfigVal = creditConfig.result
        const dueDetailVal = dueDetail.result
        const availableForDrawdownVal = availableForDrawdown.result
        setCreditRecord(creditRecordVal)
        setCreditConfig(creditConfigVal)
        setDueDetail(dueDetailVal)

        const unbilledPrincipalBN = BigInt(creditRecordVal.unbilled_principal)
        const nextDueBN = BigInt(creditRecordVal.next_due)
        const yieldDueBN = BigInt(creditRecordVal.yield_due)
        const totalPastDueBN = BigInt(creditRecordVal.total_past_due)
        const principalAmountBN =
          unbilledPrincipalBN + nextDueBN - yieldDueBN + totalPastDueBN
        setCreditAvailable(availableForDrawdownVal)
        setPrincipal(principalAmountBN)
        setTotalDue(
          BigInt(creditRecordVal.next_due) +
            BigInt(creditRecordVal.total_past_due),
        )
      } catch (error) {
        console.error('Error fetching Stellar borrower data:', error)
      } finally {
        setIsLoadingStellarBorrower(false)
      }
    }

    fetchData()
  }, [stellarAddress, poolInfo, refreshCount])

  return {
    isLoadingStellarBorrower,
    creditRecord,
    creditConfig,
    dueDetail,
    principal: downScale<number>(principal, poolInfo.underlyingToken.decimals),
    creditAvailable: downScale<number>(
      creditAvailable,
      poolInfo.underlyingToken.decimals,
    ),
    totalDue: downScale<number>(totalDue, poolInfo.underlyingToken.decimals),
    refresh,
  }
}
