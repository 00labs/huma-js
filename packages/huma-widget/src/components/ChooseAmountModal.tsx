import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import {
  Box,
  Button,
  css,
  Divider,
  Input,
  Slider,
  useTheme,
} from '@mui/material'
import { useMQ } from '@huma-finance/shared'
import React, { useState } from 'react'

import { IconType } from '../utilTypes'
import { WrapperModal } from './WrapperModal'

type Props = {
  title: string
  tokenIcon?: IconType
  description1?: string
  description2?: string
  currentAmount: number
  sliderMax: number
  tokenSymbol: string
  topLeft?: string
  topRight?: string
  downLeft?: string
  downRight?: string
  actionText?: string
  hideTerms?: boolean
  payoffAmount?: number
  type?: 'slider' | 'input'
  handleChangeAmount: (amount: number) => void
  handleAction: () => void
}

export function ChooseAmountModal({
  title,
  tokenIcon,
  description1,
  description2,
  currentAmount,
  sliderMax,
  tokenSymbol,
  topLeft,
  topRight,
  downLeft,
  downRight,
  actionText = 'accept terms',
  payoffAmount,
  hideTerms = false,
  type = 'slider',
  handleChangeAmount,
  handleAction,
}: Props): React.ReactElement {
  const theme = useTheme()
  const { isXsSize } = useMQ()
  const [inputTouched, setInputTouched] = useState(false)

  const styles = {
    subTitle: css`
      font-weight: 400;
    `,
    description2: css`
      ${theme.cssMixins.rowCentered};
      font-weight: 400;
      font-size: 16px;
      color: ${theme.palette.text.secondary};
      margin-top: ${theme.spacing(2)};
    `,
    chosenAmountWrapper: css`
      ${theme.cssMixins.rowCentered};
      background: linear-gradient(232.71deg, #a363f4 4.17%, #ff6a8a 178.69%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      font-size: 32px;
      margin-bottom: ${theme.spacing(1)};
      margin-top: ${theme.spacing(4)};
    `,
    chosenAmount: css`
      font-weight: 700;
      font-size: 32px;
    `,
    chosenAmountSymbol: css`
      font-size: 75%;
      margin-left: ${theme.spacing(0.5)};
      letter-spacing: 0.1px;
    `,
    inputAmountWrapper: css`
      margin-bottom: ${theme.spacing(1)};
      margin-top: ${theme.spacing(4)};
    `,
    inputAmount: css`
      ${theme.cssMixins.rowSpaceBetweened};
    `,
    inputField: css`
      width: 100%;
    `,
    maxButton: css`
      width: 80px;
    `,
    amountAvailable: css`
      ${theme.cssMixins.rowVCentered};
      margin-top: ${theme.spacing(0.5)};
      margin-bottom: ${theme.spacing(12)};
      font-size: 16px;
      & > svg {
        margin-right: ${theme.spacing(0.5)};
      }
    `,
    tokenIcon: {
      width: '16px',
      height: '16px',
    },
    editIcon: css`
      color: ${theme.palette.primary.main};
      cursor: pointer;
      display: inline-grid;
      vertical-align: middle;
      & > svg {
        font-size: 24px;
      }
      & > svg:first-of-type {
        margin-bottom: ${theme.spacing(-1)};
      }
    `,
    input: css`
      font-size: 18px;
      -webkit-text-fill-color: ${theme.palette.primary.main};
    `,
    slider: css`
      margin-bottom: ${theme.spacing(7)};
      &.MuiSlider-root {
        height: 8px !important;
        color: #e9e9e9;
      }
      & .MuiSlider-track {
        height: 8px !important;
        background: linear-gradient(232.71deg, #a363f4 4.17%, #ff6a8a 178.69%);
        border-radius: 8px;
      }
      & .MuiSlider-thumb::before {
        background: #ffffff;
        border: 1px solid #f9f9f9;
        box-shadow: 1px 1px 12px 2px rgba(163, 100, 244, 0.6);
        border-radius: 50px;
        width: 24px;
        height: 24px;
      }
    `,
    info: css`
      font-weight: 400;
      ${theme.cssMixins.rowSpaceBetweened};
      font-size: 16px;
      color: ${theme.palette.text.secondary};
    `,
    divider: css`
      margin: ${theme.spacing(2, 0)};
      background: #49505b;
      border-color: #e9e3f1;
    `,
    okButton: css`
      font-weight: 700;
      width: 100%;
      position: absolute;
      bottom: ${theme.spacing(isXsSize ? 2 : 0)};
    `,
    terms: css`
      ${theme.cssMixins.rowHCentered};
      font-weight: 400;
      font-size: 12px;
      color: ${theme.palette.text.secondary};
      margin-top: ${theme.spacing(1)};
      letter-spacing: 0px;
      width: 100%;
      position: absolute;
      bottom: ${theme.spacing(-3)};
    `,
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    handleChangeAmount(newValue as number)
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInputTouched(true)
    if (!event.target.value) {
      handleChangeAmount(0)
    } else {
      handleChangeAmount(Number(event.target.value))
    }
  }

  const handleSetMax = () => {
    handleChangeAmount(sliderMax)
  }

  const handleIncrement = () => {
    const newAmount = currentAmount + 1
    if (newAmount <= sliderMax) {
      handleChangeAmount(newAmount)
    }
  }

  const handleDecrement = () => {
    const newAmount = currentAmount - 1
    if (newAmount >= 0) {
      handleChangeAmount(newAmount)
    }
  }

  const handlePayoff = () => {
    if (payoffAmount) {
      handleChangeAmount(payoffAmount)
    }
  }

  const subTitle = (
    <Box component='span'>
      <Box component='span' css={styles.subTitle}>
        {description1}
      </Box>
      {payoffAmount && (
        <Button
          sx={{ fontSize: '12px' }}
          variant='text'
          size='small'
          onClick={handlePayoff}
          className='choose-amount-modal-select-payoff-btn'
        >
          Pay Off
        </Button>
      )}
    </Box>
  )

  return (
    <WrapperModal title={title} subTitle={subTitle}>
      {type === 'slider' && (
        <>
          <Box css={styles.chosenAmountWrapper}>
            <Box css={styles.chosenAmount}>
              {Number(currentAmount).toFixed(2)}
              <Box component='span' css={styles.chosenAmountSymbol}>
                {tokenSymbol}
              </Box>
              <Box component='span' css={styles.editIcon}>
                <ArrowDropUpIcon
                  onClick={handleIncrement}
                  className='choose-amount-modal-increment-icon'
                />
                <ArrowDropDownIcon onClick={handleDecrement} />
              </Box>
            </Box>
          </Box>
          <Slider
            max={Number(sliderMax)}
            min={0}
            css={styles.slider}
            aria-label='Amount'
            value={currentAmount}
            onChange={handleSliderChange}
          />
        </>
      )}
      {type === 'input' && (
        <Box css={styles.inputAmountWrapper}>
          <Box css={styles.inputAmount}>
            <Input
              css={styles.inputField}
              type='number'
              value={!inputTouched && currentAmount === 0 ? '' : currentAmount}
              onChange={handleInputChange}
              placeholder='0'
            />
            <Button
              variant='contained'
              css={styles.maxButton}
              onClick={handleSetMax}
            >
              Max
            </Button>
          </Box>
          <Box css={styles.amountAvailable}>
            {tokenIcon && React.createElement(tokenIcon, styles.tokenIcon)}
            <Box>{Number(sliderMax).toFixed(2)} Available</Box>
          </Box>
        </Box>
      )}
      <Box css={styles.info}>
        <Box>{topLeft}</Box>
        <Box>{topRight}</Box>
      </Box>
      {topLeft && downLeft && <Divider css={styles.divider} />}
      <Box css={styles.info}>
        <Box>{downLeft}</Box>
        <Box>{downRight}</Box>
      </Box>
      <Box css={styles.description2}>{description2}</Box>
      <Button
        className='choose-amount-modal-action-btn'
        variant='contained'
        css={styles.okButton}
        onClick={handleAction}
        disabled={
          !currentAmount ||
          Number(currentAmount) <= 0 ||
          Number(currentAmount) > Number(sliderMax)
        }
      >
        {actionText.toUpperCase()}
      </Button>
      {!hideTerms && (
        <Box css={styles.terms}>
          By clicking {actionText}, you agree to Huma’s Terms of Service.
        </Box>
      )}
    </WrapperModal>
  )
}
