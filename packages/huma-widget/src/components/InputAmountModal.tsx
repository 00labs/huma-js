import { Box, Button, css, TextField, useTheme } from '@mui/material'
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
  maxAmount: number | string
  maxAmountText?: string
  info?: string
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
  maxAmount,
  maxAmountText = 'MAX',
  info,
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
        font-family: 'Uni-Neue-Black';
        font-size: 40px;
        line-height: 133.4%;
      }
    `,
    max: css`
      display: flex;
      min-width: fit-content;
      justify-content: center;
      align-items: center;
      border-radius: 32px;
      background: var(--Purple-3, #f7f1ff);
      padding: 4px 10px;
      gap: 8px;
      color: var(--Purple-1, #b246ff);
      font-family: 'Uni-Neue-Bold';
      font-size: 13px;
      line-height: 22px;
      letter-spacing: 0.46px;
    `,
    info: css`
      color: var(--Black-5, #6b6572);
      font-family: 'Uni-Neue-Bold';
      font-size: 20px;
      line-height: 160%;
      letter-spacing: 0.15px;
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
            InputProps={{
              endAdornment: (
                <Button css={styles.max} onClick={setMaxAmount}>
                  {maxAmountText}
                </Button>
              ),
            }}
          />
        </Box>
      </Box>

      {info && <Box css={styles.info}>{info}</Box>}

      <BottomButton
        variant='contained'
        onClick={handleAction}
        disabled={Number(currentAmount) <= 0}
      >
        {actionText}
      </BottomButton>
    </WrapperModal>
  )
}
