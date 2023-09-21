import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { AccountStats, PoolInfoType } from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { ColumnType } from '../../utilTypes'
import { FactoredList } from '../Factoring'

type FactoredStreamType = {
  id: string
  icon: EmotionJSX.Element
  name: string
  payer: string
  amount?: string | number
  factored?: string | number
  token: string
  tokenId: string
  flowrate: string
  flowrateMonth: string
  due?: string
  remained?: string | number
}

type Props = {
  poolInfo: PoolInfoType
  loading: boolean
  accountStats: AccountStats
  handlePayManually: (item: FactoredStreamType) => void
}

const getColumns = (): ColumnType<FactoredStreamType>[] => [
  {
    title: '',
    dataIndex: 'icon',
    width: 10,
    style: { padding: '0 0 0 16px' },
  },
  { title: 'Streams', dataIndex: 'name' },
  { title: 'Due', dataIndex: 'due' },
  { title: 'Amount', dataIndex: 'amount' },
  { title: 'Factored', dataIndex: 'factored' },
  { title: 'Remaining', dataIndex: 'remained' },
]

export function SuperfluidFactoredList({
  poolInfo,
  loading,
  accountStats,
  handlePayManually,
}: Props): React.ReactElement {
  const setItem = useCallback(
    () =>
      Promise.resolve({
        name: poolInfo?.extra?.superToken?.symbol ?? '',
      }),
    [poolInfo?.extra?.superToken],
  )

  return (
    <FactoredList
      title='Streams'
      poolInfo={poolInfo}
      loading={loading}
      handlePayManually={handlePayManually}
      getColumns={getColumns}
      accountStats={accountStats}
      setItem={setItem}
    />
  )
}
