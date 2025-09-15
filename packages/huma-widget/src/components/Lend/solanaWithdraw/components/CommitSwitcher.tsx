import { css, SerializedStyles } from '@emotion/react'
import {
  PermissionlessDepositCommitment,
  PermissionlessDepositCommitOptions,
  toPercentage,
} from '@huma-finance/shared'
import { useMQ } from '@huma-finance/web-shared'
import { alpha, Box, Typography, useTheme } from '@mui/material'
import { ReactElement } from 'react'
import {
  MinusSignIcon,
  MinusSignInactiveIcon,
  PlusSignIcon,
  PlusSignInactiveIcon,
} from '../../../icons'

interface Props {
  selectedCommitment: PermissionlessDepositCommitment
  commitments: PermissionlessDepositCommitment[]
  totalApy: number | undefined
  styles?: SerializedStyles
  onCommitmentChange: (commitment: PermissionlessDepositCommitment) => void
}

export function CommitSwitcher({
  selectedCommitment,
  commitments,
  totalApy,
  styles: extraStyles,
  onCommitmentChange,
}: Props): ReactElement {
  const theme = useTheme()
  const { isXsSize } = useMQ()

  const activeIndex = commitments.indexOf(selectedCommitment)
  const isFirstItem = selectedCommitment === commitments[0]
  const isLastItem = selectedCommitment === commitments[commitments.length - 1]

  const getPreviousCommitment = () => {
    if (isFirstItem) return null
    return commitments[activeIndex - 1]
  }

  const getNextCommitment = () => {
    if (isLastItem) return null
    return commitments[activeIndex + 1]
  }

  const handlePrevious = () => {
    const previousCommitment = getPreviousCommitment()
    if (previousCommitment) {
      onCommitmentChange(previousCommitment)
    }
  }

  const handleNext = () => {
    const nextCommitment = getNextCommitment()
    if (nextCommitment) {
      onCommitmentChange(nextCommitment)
    }
  }

  const itemHeight = isXsSize ? 76 : 88

  const styles = {
    container: css`
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${theme.spacing(2)};
    `,
    button: css`
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      > svg {
        width: ${isXsSize ? '48px' : '60px'};
        height: auto;
      }
    `,
    buttonDisabled: css`
      cursor: not-allowed;
    `,
    carouselContainer: css`
      position: relative;
      flex: 1;
      height: ${itemHeight}px;
      overflow: hidden;
      border-radius: ${theme.shape.borderRadius}px;
    `,
    carouselContent: css`
      position: absolute;
      top: ${activeIndex * -itemHeight}px;
      transition: top 0.3s;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
    `,
    item: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${theme.spacing(isXsSize ? 1 : 2, 2)};
      background: ${alpha('#FFFFFF', 0.05)};
      height: ${itemHeight}px;
      width: 100%;
    `,
    info: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: ${theme.spacing(0.5)};
    `,
    minusSignIcon: css`
      &:hover {
        > path {
          fill: url(#paint1_linear_11507_28492);
        }
      }
    `,
    plusSignIcon: css`
      &:hover {
        > path {
          fill: url(#paint1_linear_11507_28493);
        }
      }
    `,
    apySkeleton: css`
      width: 80px;
      height: 32px;
    `,
  }

  const renderCommitmentOption = (
    commitment: PermissionlessDepositCommitment,
  ) => {
    const option = PermissionlessDepositCommitOptions[commitment]

    return (
      <Box key={commitment} css={styles.item}>
        <Box css={styles.info}>
          <Typography variant={isXsSize ? 'body2' : 'h6'} color='textSecondary'>
            {option.title}
          </Typography>
        </Box>
        <Typography variant={isXsSize ? 'body2' : 'h6'} color='textSecondary'>
          {toPercentage(totalApy!, 1)}
        </Typography>
      </Box>
    )
  }

  return (
    <Box css={[styles.container, extraStyles]}>
      <Box
        css={[styles.button, isFirstItem && styles.buttonDisabled]}
        onClick={handlePrevious}
      >
        {isFirstItem ? (
          <MinusSignInactiveIcon />
        ) : (
          <MinusSignIcon css={styles.minusSignIcon} />
        )}
      </Box>

      <Box css={styles.carouselContainer}>
        <Box css={styles.carouselContent}>
          {commitments.map(renderCommitmentOption)}
        </Box>
      </Box>

      <Box
        css={[styles.button, isLastItem && styles.buttonDisabled]}
        onClick={handleNext}
      >
        {isLastItem ? (
          <PlusSignInactiveIcon />
        ) : (
          <PlusSignIcon css={styles.plusSignIcon} />
        )}
      </Box>
    </Box>
  )
}
