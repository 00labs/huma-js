import { gql, useQuery } from '@apollo/client'
import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import {
  downScale,
  getWalletAddressAbbr,
  PoolInfoType,
  toBigNumber,
} from '@huma-finance/shared'
import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect, useState } from 'react'

import { ColumnType } from '../../utilTypes'
import { TableActionButton } from '../buttons'
import { UpcomingList } from '../Factoring'
import { ReceiptIcon } from '../icons'

const GET_RECEIVED_STREAMS = gql`
  query GetReceivedStreams($receiver: String!, $tokenIds: [String]!) {
    streams(
      where: { receiver: $receiver, token_in: $tokenIds, currentFlowRate_gt: 0 }
      orderBy: updatedAtTimestamp
      orderDirection: desc
    ) {
      id
      currentFlowRate
      sender {
        id
      }
      token {
        id
        symbol
        decimals
      }
    }
  }
`

export type StreamItem = {
  id: string
  icon: EmotionJSX.Element
  token: string
  tokenId: string
  payer: string
  flowrate: string
  flowrateMonth: string
}

type Stream = {
  id: string
  currentFlowRate: string
  sender: {
    id: string
  }
  token: {
    id: string
    symbol: string
    decimals: number
  }
}

type Props = {
  hasActiveLoan: boolean
  poolInfo?: PoolInfoType
  loading: boolean
  handleGetPaid: (item: StreamItem) => void
}

const getUpcomingColumns = (
  userHasActiveLoan: boolean,
  handleGetPaid: (id: StreamItem) => void,
): ColumnType<StreamItem>[] => [
  {
    title: '',
    dataIndex: 'icon',
    width: 10,
    style: { padding: '0 0 0 16px' },
  },
  { title: 'Stream', dataIndex: 'token' },
  {
    title: 'Payer',
    dataIndex: 'payerAbbr',
  },
  { title: 'Flow rate', dataIndex: 'flowrateMonth' },
  {
    title: 'Get Paid',
    action: (record) => (
      <TableActionButton
        title='GET PAID NOW'
        handleClick={() => handleGetPaid(record)}
        disabled={userHasActiveLoan}
      />
    ),
  },
]

export function SuperfluidUpcomingList({
  hasActiveLoan,
  poolInfo,
  loading,
  handleGetPaid,
}: Props): React.ReactElement {
  const { account, isActive } = useWeb3React()
  const [streams, setStreams] = useState<StreamItem[] | undefined>()
  const { data } = useQuery<{ streams: Stream[] }>(GET_RECEIVED_STREAMS, {
    variables: {
      receiver: account ? account.toLowerCase() : undefined,
      tokenIds: poolInfo?.extra?.superTokens?.map((item) => item.id) ?? [],
    },
  })

  useEffect(() => {
    if (data?.streams?.length) {
      let result: Array<StreamItem | undefined> = data.streams.map((item) => {
        const ONE_MONTH_SECONDS = 30 * 24 * 60 * 60
        const flowrateMonth = downScale(
          toBigNumber(item.currentFlowRate).mul(ONE_MONTH_SECONDS),
          item.token.decimals,
        )
        if (Number(Number(flowrateMonth).toFixed(0)) > 0) {
          return {
            id: item.id,
            icon: <ReceiptIcon css={{ width: '24px' }} />,
            token: item.token.symbol,
            tokenId: item.token.id,
            payer: item.sender.id,
            payerAbbr: getWalletAddressAbbr(item.sender.id),
            flowrate: item.currentFlowRate,
            flowrateMonth: `${Number(flowrateMonth).toFixed(0)}/mo`,
          }
        }
        return undefined
      })
      result = result.filter((item) => !!item)
      setStreams(result as StreamItem[])
    }
  }, [data])

  const goToCreateStream = useCallback(() => {}, [])

  return (
    <UpcomingList<StreamItem>
      items={streams}
      loading={loading}
      columns={getUpcomingColumns(hasActiveLoan, handleGetPaid)}
      title='Ongoing Streams'
      connectWalletDesc='Please connect wallet to check your ongoing streams.'
      noItemDesc='You don’t have any ongoing streams eligible for factoring. For now, you can click the button
      below to create streams.'
    >
      {isActive && (
        <Button
          onClick={goToCreateStream}
          type='link'
          size='small'
          variant='contained'
          sx={{ marginTop: '20px' }}
          href='https://app.superfluid.finance/'
          target='_blank'
        >
          CREATE STREAM
        </Button>
      )}
    </UpcomingList>
  )
}
