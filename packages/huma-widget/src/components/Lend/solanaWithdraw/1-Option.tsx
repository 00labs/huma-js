import { UnderlyingTokenInfo } from '@huma-finance/shared'
import { useMQ } from '@huma-finance/web-shared'
import CheckIcon from '@mui/icons-material/Check'
import {
  Box,
  css,
  FormControlLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material'
import React from 'react'
import { ClaimAndStakeOption, ClaimAndStakeOptions } from '.'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'
import { BottomButton } from '../../BottomButton'
import { WrapperModal } from '../../WrapperModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  withdrawableAmountFormatted: string | number
  selectedOption: ClaimAndStakeOption
  setSelectedOption: (option: ClaimAndStakeOption) => void
  handleConfirmOption: () => void
}

export function Option({
  poolUnderlyingToken,
  withdrawableAmountFormatted,
  selectedOption,
  setSelectedOption,
  handleConfirmOption,
}: Props): React.ReactElement {
  useLogOnFirstMount('ConfirmTransfer')
  const theme = useTheme()
  const { isSmSize } = useMQ()
  const { symbol } = poolUnderlyingToken

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = ClaimAndStakeOptions.find(
      (option) => option.id === event.target.value,
    )
    if (option) {
      setSelectedOption(option)
    }
  }

  const styles = {
    amount: css`
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: 700;
      color: ${theme.palette.text.primary};
      margin-top: ${theme.spacing(5)};
    `,
    radioGroup: css`
      margin-top: ${theme.spacing(isSmSize ? 3 : 5)};
    `,
    radioButtonContainer: css`
      padding: ${theme.spacing(0.125)};
      border-radius: 8px;
      margin-bottom: ${theme.spacing(2)};
    `,
    radioButton: css`
      margin-bottom: ${theme.spacing(2)};
      background: #1b1b1b;
      width: 100%;
      margin: 0;
      border-radius: 8px;
      padding: ${theme.spacing(2, 0.5)};
    `,
    radio: css`
      color: ${theme.palette.text.tertiary};
    `,
    radioButtonActive: css`
      background: linear-gradient(190deg, #d157ff 4.58%, #74deff 100%);
      box-shadow: 2px 2px 24px 1px #272727;
    `,
    radioActive: css`
      color: #c677ff !important;
    `,
    actionButton: css`
      margin-top: ${theme.spacing(4)};
    `,
    description: css`
      margin-top: ${theme.spacing(0.5)};
    `,
    descriptionList: css`
      margin: 0;
      padding-left: ${theme.spacing(0)};
      list-style-type: none;
    `,
    descriptionItem: css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: ${theme.spacing(0.5)};
      line-height: 18px;
      gap: ${theme.spacing(1)};
    `,
    checkIcon: css`
      width: 16px;
      height: 16px;
      margin-top: 1px;
      flex-shrink: 0;
      color: #27db63;
    `,
    label: css`
      font-size: 16px;
      font-weight: 400;
      line-height: 150%;
      letter-spacing: 0.15px;
    `,
    descriptionText: css`
      font-size: 14px;
      font-weight: 400;
      line-height: 150%;
      letter-spacing: 0.15px;
      color: #999;
    `,
  }

  return (
    <WrapperModal title={`Withdraw ${symbol}`}>
      <Box css={styles.amount}>${withdrawableAmountFormatted}</Box>
      <RadioGroup
        value={selectedOption.id}
        onChange={handleOptionChange}
        css={styles.radioGroup}
      >
        {ClaimAndStakeOptions.map((option) => {
          const isActive = selectedOption.id === option.id
          return (
            <Box
              key={option.id}
              css={[
                styles.radioButtonContainer,
                isActive && styles.radioButtonActive,
              ]}
            >
              <FormControlLabel
                css={styles.radioButton}
                value={option.id}
                control={
                  <Radio css={[styles.radio, isActive && styles.radioActive]} />
                }
                label={
                  <Box>
                    <Box css={styles.label}>{option.label}</Box>
                    {option.description && (
                      <ul css={styles.descriptionList}>
                        {option.description.map((description) => (
                          <li key={description} css={styles.descriptionItem}>
                            <CheckIcon css={styles.checkIcon} />
                            <Box component='span' css={styles.descriptionText}>
                              {description}
                            </Box>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Box>
                }
              />
            </Box>
          )
        })}
      </RadioGroup>
      <BottomButton variant='contained' onClick={handleConfirmOption}>
        {selectedOption.id === 'claim-and-stake'
          ? 'WITHDRAW AND REDEPOSIT'
          : 'WITHDRAW'}
      </BottomButton>
    </WrapperModal>
  )
}
