import { isEmpty } from '@huma-finance/shared'
import {
  Box,
  Button,
  css,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useState } from 'react'
import { NumericFormat } from 'react-number-format'

import { BottomButton } from './BottomButton'
import { WrapperModal } from './WrapperModal'

type Props = {
  title: string
  subTitle: string
  actionText: string
  tokenSymbol: string
  suffix?: string
  currentAmount: number | string
  minimumAmount?: number
  maxAmount: number | string
  maxAmountText?: string
  maxAmountTitle?: string
  infos?: string[]
  handleChangeAmount: (amount: number) => void
  handleAction: () => void
}

export function InputAmountModal({
  title,
  subTitle,
  actionText,
  tokenSymbol,
  suffix: defaultSuffix,
  currentAmount,
  minimumAmount,
  maxAmount,
  maxAmountText = 'MAX',
  maxAmountTitle,
  infos,
  handleChangeAmount,
  handleAction,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const [inputTouched, setInputTouched] = useState(false)
  const suffix = ` ${defaultSuffix ?? tokenSymbol}`

  const styles = {
    inputAmountWrapper: css`
      margin-bottom: ${theme.spacing(1)};
      margin-top: ${theme.spacing(16)};
    `,
    inputAmount: css`
      ${theme.cssMixins.rowSpaceBetweened};
    `,
    inputField: css`
      input {
        width: 100%;
        color: ${theme.palette.text.primary};
        font-weight: 800;
        font-size: 40px;
        line-height: 133.4%;
      }
    `,
    maxWrapper: css`
      position: relative;
      display: flex;
      justify-content: flex-end;
    `,
    maxTitle: css`
      position: absolute;
      color: ${theme.palette.text.primary};
      font-weight: 400;
      font-size: 12px;
      line-height: 166%;
      letter-spacing: 0.4px;
      top: ${theme.spacing(-3)};
      width: 200px;
      text-align: right;
    `,
    max: css`
      display: flex;
      min-width: fit-content;
      justify-content: center;
      align-items: center;
      border-radius: 32px;
      padding: 4px 10px;
      gap: 8px;
      font-weight: 700;
      font-size: 13px;
      line-height: 22px;
      letter-spacing: 0.46px;
      white-space: nowrap;
    `,
    info: css`
      color: ${theme.palette.text.secondary};
      font-weight: 400;
      font-size: 16px;
      line-height: 160%;
      letter-spacing: 0.15px;
    `,
    subInfo: css`
      position: absolute;
      bottom: ${theme.spacing(6)};
    `,
  }

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInputTouched(true)
    handleChangeAmount(
      Number(event.target.value.replace(suffix, '').replaceAll(',', '')),
    )
  }

  const setMaxAmount = () => {
    handleChangeAmount(Number(maxAmount))
  }

  const getDisabled = () => {
    if (Number(currentAmount) <= 0) {
      return true
    }
    if (!isEmpty(maxAmount) && Number(currentAmount) > Number(maxAmount)) {
      return true
    }
    if (!isEmpty(minimumAmount) && Number(currentAmount) < minimumAmount!) {
      return true
    }
    return false
  }

  const getEndAdornment = () => (
    <Box css={styles.maxWrapper}>
      {maxAmountTitle && <Box css={styles.maxTitle}>{maxAmountTitle}</Box>}
      <Button variant='contained' css={styles.max} onClick={setMaxAmount}>
        {maxAmountText}
      </Button>
    </Box>
  )

  return (
    <WrapperModal title={title} subTitle={subTitle}>
      <Box css={styles.inputAmountWrapper}>
        <Box css={styles.inputAmount}>
          <NumericFormat
            css={styles.inputField}
            decimalScale={0}
            onChange={onChange}
            value={
              !inputTouched && Number(currentAmount) === 0 ? '' : currentAmount
            }
            suffix={suffix}
            thousandSeparator
            customInput={TextField}
            placeholder={`0${suffix}`}
            variant='standard'
            InputProps={{ endAdornment: getEndAdornment() }}
          />
        </Box>
      </Box>
      {infos && (
        <Box>
          {infos.map((info) => (
            <Typography css={styles.info} key={info}>
              {info}
            </Typography>
          ))}
        </Box>
      )}
      {!!minimumAmount && minimumAmount > 0 && (
        <Box>
          <Typography css={styles.info} key='minDeposit'>
            Minimum deposit: {minimumAmount} {tokenSymbol}
          </Typography>
        </Box>
      )}
      <BottomButton
        variant='contained'
        onClick={handleAction}
        disabled={getDisabled()}
      >
        {actionText}
      </BottomButton>
    </WrapperModal>
  )
}
