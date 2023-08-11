import { Box } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import {
  CreditEvent,
  POOL_NAME,
  POOL_TYPE,
  PoolMap,
  PoolSubgraphMap,
  useFactoring,
} from '@huma-finance/shared'
import React from 'react'

import { Activity } from '../Activity'
import { ApolloWrapper } from '../ApolloWrapper'
import { StreamFactoringBorrow } from '../StreamFactoring/borrow'
import { SuperfluidFactoredList } from './SuperfluidFactoredList'
import { StreamItem, SuperfluidUpcomingList } from './SuperfluidUpcomingList'

export function SuperfluidFactoring(): React.ReactElement {
  const poolName = POOL_NAME.Superfluid
  const { chainId } = useWeb3React()
  const {
    accountStats,
    accountHasActiveLoan,
    actionType,
    loading,
    poolInfo,
    modalIsOpen,
    selectedItem,
    styles,
    handleGetPaid,
    handleGetPaidSuccess,
    handlePayManually,
    handleClose,
  } = useFactoring<StreamItem>(poolName, POOL_TYPE.Stream)

  return (
    <Box css={styles.wrapper}>
      <Box css={styles.title}>Stream Factoring</Box>
      <Box css={styles.description} marginBottom='47px'>
        {PoolMap.Stream[poolName]?.borrowDesc}
      </Box>
      {poolInfo && (
        <SuperfluidFactoredList
          poolInfo={poolInfo}
          handlePayManually={handlePayManually}
          loading={loading && actionType === 'payment'}
          accountStats={accountStats}
        />
      )}
      <ApolloWrapper uri={poolInfo?.extra?.subgraph!}>
        <SuperfluidUpcomingList
          poolInfo={poolInfo}
          handleGetPaid={handleGetPaid}
          hasActiveLoan={accountHasActiveLoan}
          loading={loading && actionType === 'borrow'}
        />
      </ApolloWrapper>
      <ApolloWrapper uri={PoolSubgraphMap[chainId!]?.subgraph}>
        {poolInfo && (
          <Activity
            poolInfo={poolInfo}
            targetEvents={[
              CreditEvent.DrawdownMadeWithReceivable,
              CreditEvent.PaymentMade,
              CreditEvent.ReceivedPaymentProcessed,
            ]}
          />
        )}
      </ApolloWrapper>
      {poolInfo && selectedItem && actionType === 'borrow' && (
        <StreamFactoringBorrow
          poolName={POOL_NAME.Superfluid}
          poolType={POOL_TYPE.Stream}
          payerAddress={selectedItem.payer}
          superToken={selectedItem.tokenId}
          currentFlowRate={selectedItem.flowrate}
          isOpen={modalIsOpen}
          handleClose={handleClose}
          handleSuccess={handleGetPaidSuccess}
        />
      )}
    </Box>
  )
}
