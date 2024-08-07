import { SubgraphService } from '@huma-shan/sdk'
import { CreditEvent, POOL_NAME, POOL_TYPE, PoolMap } from '@huma-shan/core'
import { useFactoring } from '@huma-shan/web-core'
import { Box, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React from 'react'

import { Activity } from '../Activity'
import { ApolloWrapper } from '../ApolloWrapper'
import { StreamFactoringBorrow } from '../StreamFactoring/borrow'
import { SuperfluidFactoredList } from './SuperfluidFactoredList'
import { StreamItem, SuperfluidUpcomingList } from './SuperfluidUpcomingList'

export function SuperfluidFactoring(): React.ReactElement {
  const theme = useTheme()
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
      <Box css={styles.description} marginBottom={theme.spacing(6)}>
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
      <ApolloWrapper uri={SubgraphService.getSubgraphUrlForChainId(chainId!)}>
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
