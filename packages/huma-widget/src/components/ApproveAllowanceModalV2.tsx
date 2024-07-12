import { MaxUint256 } from '@ethersproject/constants'
import {
  getERC20Contract,
  PoolInfoV2,
  sendTxAtom,
  txAtom,
  TxStateType,
  UnderlyingTokenInfo,
  useMount,
} from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, BigNumberish } from 'ethers'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useEffect } from 'react'

import { BottomButton } from './BottomButton'
import { AutoPaybackImg } from './images'
import { LoadingModal } from './LoadingModal'
import { ViewOnExplorer } from './ViewOnExplorer'
import { WrapperModal } from './WrapperModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  showAutoPayback?: boolean
  allowanceAmount?: BigNumberish
  spender?: string
  resetAfterSuccess?: boolean
  handleSuccess: () => void
}

export function ApproveAllowanceModalV2({
  poolInfo,
  poolUnderlyingToken,
  showAutoPayback = false,
  allowanceAmount,
  spender,
  resetAfterSuccess = true,
  handleSuccess,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const { provider, account } = useWeb3React()
  const reset = useResetAtom(txAtom)
  const [{ state, txHash }, send] = useAtom(sendTxAtom)
  const waitingForAccept = state === TxStateType.New
  const { symbol, address } = poolUnderlyingToken

  useEffect(() => {
    if (state === TxStateType.Success) {
      if (resetAfterSuccess) {
        reset()
      }
      handleSuccess()
    }
  }, [handleSuccess, reset, resetAfterSuccess, state])

  const styles = {
    iconWrapper: css`
      ${theme.cssMixins.rowCentered};
      margin-top: ${theme.spacing(6)};
      & > img {
        width: 220px;
      }
    `,
    description: css`
      margin-top: ${theme.spacing(4)};
      font-weight: 400;
      font-size: 16px;
      color: #a8a1b2;
      padding: ${theme.spacing(0, 1)};
    `,
  }

  const sendIncreaseAllowance = useCallback(async () => {
    const allowanceSpender = spender ?? poolInfo.pool
    const targetAllowanceAmount = allowanceAmount ?? MaxUint256
    const underlyingTokenContract = await getERC20Contract(
      address,
      provider,
      account,
    )
    const currentAllowance = await underlyingTokenContract?.allowance(
      account!,
      allowanceSpender,
    )
    const amountToIncrease = BigNumber.from(targetAllowanceAmount).sub(
      currentAllowance ?? 0,
    )
    send({
      contract: underlyingTokenContract!,
      method: 'increaseAllowance',
      params: [allowanceSpender, amountToIncrease],
      provider,
    })
  }, [
    account,
    address,
    allowanceAmount,
    poolInfo.pool,
    provider,
    send,
    spender,
  ])

  useMount(() => {
    if (!showAutoPayback) {
      sendIncreaseAllowance()
    }
  })

  if (showAutoPayback && waitingForAccept) {
    return (
      <WrapperModal
        title='Auto Payback'
        subTitle='Enable auto payback and never miss payments. You only need to do it once.'
      >
        <Box css={styles.iconWrapper}>
          <img src={AutoPaybackImg} alt='auto-payback' />
        </Box>
        <Box css={styles.description}>
          This allowance transaction removes the need to confirm follow up{' '}
          {symbol} transactions. Gas is on us.
        </Box>
        <BottomButton variant='contained' onClick={sendIncreaseAllowance}>
          APPROVE {symbol} PAYMENTS
        </BottomButton>
      </WrapperModal>
    )
  }

  return (
    <LoadingModal
      title={`Approve ${symbol}`}
      description='Waiting for approval confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
