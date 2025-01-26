import {
  PoolInfoType,
  SuperfluidPoolProcessor,
  SuperfluidPoolProcessor_ABI,
} from '@huma-finance/shared'
import { useERC2612Permit, useMount } from '@huma-finance/web-shared'
import { BigNumber, Contract, ethers } from 'ethers'
import React from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import {
  setError,
  setMultisend,
  setStep,
} from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoType
  payerAddress: string
  borrower: string
  superToken: string
}

export function Permit({
  poolInfo,
  payerAddress,
  borrower,
  superToken,
}: Props): React.ReactElement | null {
  const dispatch = useDispatch()
  const { borrowAmountBN: borrowAmountBNJson, stream } =
    useAppSelector(selectWidgetState)
  const { getTradableStreamPermitMessage } = useERC2612Permit()
  const borrowAmountBN = BigNumber.from(borrowAmountBNJson)

  const getDrawdownCallData = async () => {
    const NFTPermitResult = await getTradableStreamPermitMessage(
      poolInfo.assetAddress!,
      borrower,
      superToken,
      payerAddress,
      poolInfo.poolProcessor!,
      stream!.borrowFlowrate!,
      stream!.durationInSeconds!,
    )

    const drawdownEncodedData = ethers.utils.defaultAbiCoder.encode(
      [
        'address',
        'address',
        'address',
        'int96',
        'uint256',
        'uint256',
        'uint8',
        'bytes32',
        'bytes32',
      ],
      [
        borrower,
        superToken,
        payerAddress,
        stream?.borrowFlowrate,
        stream?.durationInSeconds,
        NFTPermitResult.expiry,
        NFTPermitResult.v,
        NFTPermitResult.r,
        NFTPermitResult.s,
      ],
    )
    const poolProcessorContract = new Contract(
      poolInfo.poolProcessor!,
      SuperfluidPoolProcessor_ABI,
    ) as SuperfluidPoolProcessor

    return poolProcessorContract.interface.encodeFunctionData(
      'mintAndDrawdown',
      [borrower, borrowAmountBN, poolInfo.assetAddress!, drawdownEncodedData],
    )
  }

  useMount(async () => {
    try {
      const callData = []
      const addresses: string[] = []
      const drawdownCalldata = await getDrawdownCallData()
      addresses.push(poolInfo.poolProcessor!)
      callData.push(drawdownCalldata)

      dispatch(setMultisend({ addresses, callData }))
      dispatch(setStep(WIDGET_STEP.Transfer))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      let errorMessage = e.reason || `Sign permit failed`
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        errorMessage = 'User has rejected the permit sign'
      }
      dispatch(setError({ errorMessage, errorReason: errorMessage }))
    }
  })

  return (
    <LoadingModal
      title='Sign Token and NFT'
      description='Waiting for signing...'
    />
  )
}
