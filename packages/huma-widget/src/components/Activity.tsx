import { gql, useQuery } from '@apollo/client'
import {
  CreditEvent,
  CreditEventText,
  downScale,
  isEmpty,
  PoolInfoType,
  timeUtil,
} from '@huma-finance/shared'
import { useMQ } from '@huma-finance/web-shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

import { HumaTable } from './HumaTable'

const GET_ACTIVITY = gql`
  query GetCreditLineActivity($pool: String!, $owner: String!, $event: [Int]!) {
    creditEvents(
      where: { pool: $pool, owner: $owner, event_in: $event }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      timestamp
      owner
      pool
      event
    }
  }
`

type Props = {
  poolInfo: PoolInfoType
  targetEvents: CreditEvent[]
}

type ActivityDataType = {
  id: string
  owner: string
  pool: string
  timestamp: string
  amount: string
  event: number
  eventText: string | undefined
}

const columns = [
  { title: 'Action', dataIndex: 'eventText' },
  {
    title: 'Amount',
    action: (record: { amount: string }) => {
      if (isEmpty(record.amount) || Number.isNaN(record.amount)) {
        return ''
      }
      return Number(record.amount).toFixed(2)
    },
  },
  { title: 'Date', dataIndex: 'timestamp' },
]

export function Activity({
  poolInfo,
  targetEvents,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const { account } = useWeb3React()
  const { decimals } = poolInfo.poolUnderlyingToken
  const [events, setEvents] = useState<ActivityDataType[] | undefined>()
  const { data } = useQuery<{
    creditEvents: ActivityDataType[]
  }>(GET_ACTIVITY, {
    variables: {
      pool: poolInfo.pool,
      owner: account,
      event: targetEvents,
    },
  })
  const { isSmSize } = useMQ()

  const getPadding = () => {
    if (isSmSize) {
      return theme.spacing(2, 3)
    }
    return theme.spacing(4, 6)
  }

  useEffect(() => {
    if (!data?.creditEvents) {
      return
    }
    const result = data.creditEvents.map((item) => {
      const event = JSON.parse(JSON.stringify(item)) as ActivityDataType
      event.eventText = CreditEventText[item.event]
      event.amount = downScale(event.amount, decimals)
      event.timestamp = timeUtil.timestampToLL(Number(event.timestamp))
      return event
    })
    setEvents(result)
  }, [data?.creditEvents, decimals])

  const styles = {
    wrapper: css`
      margin-top: ${theme.spacing(9)};
    `,
    title: css`
      font-weight: 800;
      font-size: 24px;
      color: ${theme.palette.text.primary};
      margin-bottom: ${theme.spacing(2)};
    `,
    tableWrapper: css`
      box-shadow: 0px 4px 40px 8px rgba(0, 0, 0, 0.04);
      border-radius: 24px;
      padding: ${getPadding()};
    `,
  }

  return (
    <Box css={styles.wrapper}>
      <Box css={styles.title}>Recent Activity</Box>
      <Box css={styles.tableWrapper}>
        <HumaTable columns={columns} rows={events} hideRowsPerPage={isSmSize} />
      </Box>
    </Box>
  )
}
