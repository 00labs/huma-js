import { BN } from '@coral-xyz/anchor'
import {
  PermissionlessDepositCommitment,
  PermissionlessDepositMode,
  SolanaChainEnum,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useMQ, usePermissionlessApy } from '@huma-finance/web-shared'
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined'
import { Box, css, Tooltip, useTheme } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { ClaimAndStakeOption } from '.'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'
import { WrapperModal } from '../../WrapperModal'
import { CommitSwitcher } from './components/CommitSwitcher'
import { ModeSelector } from './components/ModeSelector'

type Props = {
  chainId: SolanaChainEnum
  poolUnderlyingToken: UnderlyingTokenInfo
  withdrawableAmount: BN
  withdrawableAmountFormatted: string | number
  selectedOption: ClaimAndStakeOption
  selectedDepositMode: PermissionlessDepositMode
  selectedDepositCommitment: PermissionlessDepositCommitment
  setSelectedOption: (option: ClaimAndStakeOption) => void
  setSelectedDepositMode: (mode: PermissionlessDepositMode) => void
  setSelectedDepositCommitment: (
    commitment: PermissionlessDepositCommitment,
  ) => void
  handleConfirmOption: () => void
}

export function WithdrawAndDepositConfirm({
  chainId,
  poolUnderlyingToken,
  withdrawableAmount,
  withdrawableAmountFormatted,
  selectedOption,
  selectedDepositMode,
  selectedDepositCommitment,
  setSelectedOption,
  setSelectedDepositMode,
  setSelectedDepositCommitment,
  handleConfirmOption,
}: Props): React.ReactElement {
  useLogOnFirstMount('ConfirmTransfer')
  const theme = useTheme()
  const { isSmSize } = useMQ()
  const dispatch = useDispatch()
  const { symbol } = poolUnderlyingToken

  const {
    modeTargetApy: classicModeTargetApy,
    humaRewardsApy: classicHumaRewardsApy,
  } = usePermissionlessApy(
    chainId,
    PermissionlessDepositMode.CLASSIC,
    PermissionlessDepositCommitment.INITIAL_COMMITMENT_SIX_MONTHS,
    withdrawableAmount,
  )
  const {
    modeTargetApy: maxiModeTargetApy,
    humaRewardsApy: maxiHumaRewardsApy,
  } = usePermissionlessApy(
    chainId,
    PermissionlessDepositMode.MAXI,
    PermissionlessDepositCommitment.INITIAL_COMMITMENT_SIX_MONTHS,
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
      height: 80px;
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
      margin-top: ${theme.spacing(3)};
    `,
  }

  return (
    <WrapperModal title=''>
      <Box css={styles.title}>Withdraw and redeposit to Permissionless</Box>
      <Box css={styles.description}>Withdraw all the available amount</Box>
      <Box css={styles.availableToWithdraw}>
        <Box css={styles.availableToWithdrawTitle}>Available to withdraw</Box>
        <Box css={styles.availableToWithdrawAmount}>
          ${withdrawableAmountFormatted}
        </Box>
      </Box>
      <Box css={styles.selectDepositMode}>
        <Box css={styles.selectDepositModeTitle}>Select deposit mode</Box>
        <Tooltip
          title={
            <Box>
              <Box>
                Huma Permissionless offers two modes to match different LP
                strategies. You can switch between them anytime, as often as you
                like.
              </Box>
              <ul>
                <li>
                  <strong>Classic Mode:</strong> Provides stable yield with
                  moderate Huma Feather rewards. The current APY is 10%, updated
                  monthly based on market conditions. This mode is ideal for LPs
                  who prioritize consistent income.
                </li>
                <li>
                  <strong>Maxi Mode:</strong> Offers maximum Huma rewards by
                  trading away stable yield. LPs in this mode earn only Huma
                  rewards, making it the go-to choice for Huma-maximizing
                  believers—aka the Huma maxis.
                </li>
              </ul>
            </Box>
          }
          placement='top'
        >
          <InfoOutlineIcon css={styles.infoIcon} />
        </Tooltip>
      </Box>
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
              ? classicModeTargetApy
              : maxiModeTargetApy
          }
          onCommitmentChange={setSelectedDepositCommitment}
        />
      </Box>
    </WrapperModal>
  )
}
