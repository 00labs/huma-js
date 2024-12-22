import {
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import { SorobanRpc, Address, xdr, scValToNative } from '@stellar/stellar-sdk'

const getDepositRecordKey = (contractId: string, address: string) => {
  const addressScVal = new Address(address).toScVal()
  return xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: new Address(contractId).toScAddress(),
      key: xdr.ScVal.scvVec([
        xdr.ScVal.scvSymbol('DepositRecord'),
        addressScVal,
      ]),
      durability: xdr.ContractDataDurability.persistent(),
    }),
  )
}

export type DepositRecord = {
  lastDepositTime: number
  principal: bigint
}

export async function fetchStellarDepositRecord(
  poolInfo: StellarPoolInfo,
  tranche: TrancheType,
  account: string,
): Promise<DepositRecord | null> {
  try {
    const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
    const server = new SorobanRpc.Server(chainMetadata.rpc)

    const key = getDepositRecordKey(
      tranche === 'senior' ? poolInfo.seniorTranche! : poolInfo.juniorTranche,
      account,
    )
    // Get the contract data with proper durability
    const response = await server.getLedgerEntries(key)

    const contractData = response.entries[0].val

    if (contractData.switch() === xdr.LedgerEntryType.contractData()) {
      const data = scValToNative(contractData.contractData().val())

      if (
        data.last_deposit_time === undefined ||
        data.principal === undefined
      ) {
        return null
      }

      return {
        lastDepositTime: Number(data.last_deposit_time),
        principal: BigInt(data.principal),
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching deposit record:', error)
    return null
  }
}
