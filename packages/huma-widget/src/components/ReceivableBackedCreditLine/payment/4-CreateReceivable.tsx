import { HumaContext, HumaReceivableFactory } from '@huma-finance/sdk'
import {
  ChainEnum,
  CURRENCY_CODE,
  PoolInfoV2,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { ContractReceipt, ethers } from 'ethers'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { ViewOnExplorer } from '../../ViewOnExplorer'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  setTokenId: (tokenId: string) => void
}

export function CreateReceivable({
  poolInfo,
  poolUnderlyingToken,
  setTokenId,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider, chainId } = useWeb3React()
  const { paymentAmount } = useAppSelector(selectWidgetState)
  const [txHash, setTxHash] = useState('')

  const getTokenIdFromReceipt = useCallback((txReceipt: ContractReceipt) => {
    if (!Array.isArray(txReceipt.events)) {
      return undefined
    }
    const event = txReceipt.events.find(
      (event) => event.event === 'ReceivableCreated',
    )
    if (!event || !event.args!! || !event.args?.tokenId) {
      return undefined
    }
    return event.args.tokenId.toString() as string
  }, [])

  useEffect(() => {
    const sendTx = async () => {
      if (provider && chainId) {
        try {
          const humaContext = new HumaContext({
            signer: provider.getSigner(),
            provider,
            chainId,
            poolName: poolInfo.poolName,
            poolType: poolInfo.poolType,
          })
          const receivableFactory = new HumaReceivableFactory({
            humaContext,
            arWeavePaymentChainId: ChainEnum.Mumbai,
          })
          const receivableAmountBN = ethers.utils.parseUnits(
            String(paymentAmount),
            poolUnderlyingToken.decimals,
          )
          const maturityDate = moment().add(1, 'months').unix()
          const tx = await receivableFactory.createReceivable(
            CURRENCY_CODE.USD,
            receivableAmountBN,
            maturityDate,
            '',
          )
          setTxHash(tx.hash)
          const txReceipt = await tx.wait()
          const tokenId = getTokenIdFromReceipt(txReceipt)
          if (tokenId) {
            setTokenId(tokenId)
          }
          dispatch(setStep(WIDGET_STEP.ApproveNFT))
        } catch (e) {
          console.log(e)
          dispatch(setStep(WIDGET_STEP.Error))
        }
      }
    }
    sendTx()
  }, [
    chainId,
    dispatch,
    getTokenIdFromReceipt,
    paymentAmount,
    poolInfo.poolName,
    poolInfo.poolType,
    poolUnderlyingToken.decimals,
    provider,
    setTokenId,
  ])

  return (
    <LoadingModal
      title='Create Receivable'
      description='Waiting for confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
