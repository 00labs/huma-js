import { BN } from '@coral-xyz/anchor'
import {
  PermissionlessDepositCommitment,
  PermissionlessDepositMode,
  SolanaChainEnum,
} from '@huma-finance/shared'
import { usePermissionlessApy } from '@huma-finance/web-shared'
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined'
import { Box, Button, css, Divider, Tooltip, useTheme } from '@mui/material'
import React from 'react'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'
import { WrapperModal } from '../../WrapperModal'
import { Apy } from './components/Apy'
import { Benefit } from './components/Benefit'
import { CommitSwitcher } from './components/CommitSwitcher'
import { ModeSelector } from './components/ModeSelector'
import { SelectModeTitle } from './components/SelectModeTitle'

type Props = {
  chainId: SolanaChainEnum
  withdrawableAmount: BN
  withdrawableAmountFormatted: string | number
  selectedDepositMode: PermissionlessDepositMode
  selectedDepositCommitment: PermissionlessDepositCommitment
  setSelectedDepositMode: (mode: PermissionlessDepositMode) => void
  setSelectedDepositCommitment: (
    commitment: PermissionlessDepositCommitment,
  ) => void
  withdrawAndDeposit: () => void
}

export function WithdrawAndDepositConfirm({
  chainId,
  withdrawableAmount,
  withdrawableAmountFormatted,
  selectedDepositMode,
  selectedDepositCommitment,
  setSelectedDepositMode,
  setSelectedDepositCommitment,
  withdrawAndDeposit,
}: Props): React.ReactElement {
  useLogOnFirstMount('ConfirmTransferAndRedeposit')
  const theme = useTheme()

  const {
    modeTargetApy: classicModeTargetApy,
    humaRewardsApy: classicHumaRewardsApy,
  } = usePermissionlessApy(
    chainId,
    PermissionlessDepositMode.CLASSIC,
    selectedDepositCommitment,
    withdrawableAmount,
  )
  const {
    modeTargetApy: maxiModeTargetApy,
    humaRewardsApy: maxiHumaRewardsApy,
  } = usePermissionlessApy(
    chainId,
    PermissionlessDepositMode.MAXI,
    selectedDepositCommitment,
    withdrawableAmount,
  )

  const styles = {
    title: css`
      font-weight: 400;
      font-size: 20px;
      color: #ececec;
      font-weight: 700;
      line-height: 160%;
      letter-spacing: 0.15px;
      margin-top: ${theme.spacing(-1)};
    `,
    description: css`
      font-weight: 400;
      font-size: 14px;
      color: #999;
      margin-top: ${theme.spacing(1)};
    `,
    availableToWithdraw: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: ${theme.spacing(1)};
      font-weight: 400;
      font-size: 16px;
      color: #999;
      background: #1b1b1b;
      padding: ${theme.spacing(2)};
      border-radius: 8px;
      height: 60px;
    `,
    availableToWithdrawTitle: css`
      font-weight: 500;
      font-size: 16px;
      color: #b8b8b8;
    `,
    availableToWithdrawAmount: css`
      font-size: 24px;
      font-weight: 700;
      color: #ececec;
    `,
    selectDepositMode: css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: ${theme.spacing(3)};
      gap: ${theme.spacing(0.5)};
    `,
    selectDepositModeTitle: css`
      font-weight: 700;
      font-size: 16px;
      color: #b8b8b8;
    `,
    infoIcon: css`
      width: 16px;
      height: 16px;
      color: #686868;
    `,
    lockupTitle: css`
      display: flex;
      align-items: center;
      gap: ${theme.spacing(0.5)};
      color: #b8b8b8;
      font-size: 16px;
      font-weight: 700;
      line-height: 150%;
      letter-spacing: 0.15px;
      margin-top: ${theme.spacing(2)};
    `,
    commitSwitcher: css`
      margin-top: ${theme.spacing(2)};
    `,
    divider: css`
      margin-top: ${theme.spacing(2)};
      border-color: #222;
    `,
    buttonContainer: css`
      width: 100%;
      margin-top: ${theme.spacing(2)};

      button {
        width: 100%;
      }
    `,
  }

  return (
    <WrapperModal title=''>
      <Box css={styles.title}>Withdraw and redeposit to Permissionless</Box>
      <Box css={styles.availableToWithdraw}>
        <Box css={styles.availableToWithdrawTitle}>Available to withdraw</Box>
        <Box css={styles.availableToWithdrawAmount}>
          ${withdrawableAmountFormatted}
        </Box>
      </Box>
      <SelectModeTitle />
      <ModeSelector
        classicModeTargetApy={classicModeTargetApy}
        maxiModeTargetApy={maxiModeTargetApy}
        classicHumaRewardsApy={classicHumaRewardsApy}
        maxiHumaRewardsApy={maxiHumaRewardsApy}
        selectedDepositMode={selectedDepositMode}
        setSelectedDepositMode={setSelectedDepositMode}
      />
      <Box css={styles.lockupTitle}>
        <Box>Lockup to earn more yield</Box>
        <Tooltip
          title='Rewards are based on your engagement with the Huma protocol.'
          placement='top'
        >
          <InfoOutlineIcon css={styles.infoIcon} />
        </Tooltip>
      </Box>
      <Box css={styles.commitSwitcher}>
        <CommitSwitcher
          selectedCommitment={selectedDepositCommitment}
          commitments={Object.values(PermissionlessDepositCommitment)}
          totalApy={
            selectedDepositMode === PermissionlessDepositMode.CLASSIC
              ? (classicModeTargetApy ?? 0) + (classicHumaRewardsApy ?? 0)
              : (maxiModeTargetApy ?? 0) + (maxiHumaRewardsApy ?? 0)
          }
          onCommitmentChange={setSelectedDepositCommitment}
        />
      </Box>
      <Divider css={styles.divider} />
      <Apy
        usdcApy={
          selectedDepositMode === PermissionlessDepositMode.CLASSIC
            ? classicModeTargetApy
            : maxiModeTargetApy
        }
        humaRewardsApy={
          selectedDepositMode === PermissionlessDepositMode.CLASSIC
            ? classicHumaRewardsApy
            : maxiHumaRewardsApy
        }
      />
      <Box css={styles.buttonContainer}>
        <Button variant='contained' onClick={withdrawAndDeposit}>
          WITHDRAW AND DEPOSIT
        </Button>
      </Box>
      <Benefit />
    </WrapperModal>
  )
}
