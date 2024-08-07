import { drawdownWithReceivable } from '@huma-finance/sdk'
import { PoolInfoV2 } from '@huma-finance/core'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { ViewOnExplorer } from '../../ViewOnExplorer'

type Props = {
  poolInfo: PoolInfoV2
  tokenId: string
}

export function Transfer({ poolInfo, tokenId }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider, account } = useWeb3React()
  const { borrowAmountBN: borrowAmountBNJson } =
    useAppSelector(selectWidgetState)
  const borrowAmountBN = BigNumber.from(borrowAmountBNJson).toString()
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    const sendTx = async () => {
      if (provider) {
        try {
          const tx = await drawdownWithReceivable(
            provider.getSigner(),
            poolInfo.poolName,
            tokenId,
            borrowAmountBN,
          )
          setTxHash(tx.hash)
          await tx.wait()
          dispatch(setStep(WIDGET_STEP.Done))
        } catch (e) {
          console.error(e)
          dispatch(setStep(WIDGET_STEP.Error))
        }
      }
    }
    sendTx()
  }, [borrowAmountBN, dispatch, poolInfo.poolName, provider, tokenId])

  if (!account || !provider) {
    return <LoadingModal title='Borrow' />
  }

  return (
    <LoadingModal
      title='Transaction Pending'
      description='Waiting for confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
