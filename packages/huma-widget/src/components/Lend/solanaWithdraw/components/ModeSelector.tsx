import { PermissionlessDepositMode, toPercentage } from '@huma-finance/shared'
import { Box, css, useTheme } from '@mui/material'
import React from 'react'
import { ModeClassicIcon, ModeMaxiIcon } from '../../../icons'

type Props = {
  classicModeTargetApy: number | undefined
  maxiModeTargetApy: number | undefined
  classicHumaRewardsApy: number | undefined
  maxiHumaRewardsApy: number | undefined
  selectedDepositMode: PermissionlessDepositMode
  setSelectedDepositMode: (mode: PermissionlessDepositMode) => void
}

export function ModeSelector({
  classicModeTargetApy,
  maxiModeTargetApy,
  classicHumaRewardsApy,
  maxiHumaRewardsApy,
  selectedDepositMode,
  setSelectedDepositMode,
}: Props): React.ReactElement {
  const theme = useTheme()

  const styles = {
    modes: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: ${theme.spacing(1)};
      gap: ${theme.spacing(1)};
    `,
    modeContainer: css`
      padding: ${theme.spacing(0.125)};
      width: 100%;
    `,
    mode: css`
      display: flex;
      flex-direction: column;
      gap: ${theme.spacing(1)};
      padding: ${theme.spacing(2, 3)};
      cursor: pointer;
      background: #1b1b1b;
      border-radius: 8px;
    `,
    modeSelected: css`
      border-radius: 8px;
      background: linear-gradient(190deg, #d157ff 4.58%, #74deff 100%);
      box-shadow: 2px 2px 24px 1px #272727;
    `,
    modeTitle: css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: ${theme.spacing(1)};
      font-size: 16px;
      font-weight: 500;
    `,
    modeTitleClassic: css`
      color: #74deff;
    `,
    modeTitleMaxi: css`
      color: #c677ff;
    `,
    modeApy: css`
      font-size: 16px;
      font-weight: 500;
      color: #ececec;
      margin-top: ${theme.spacing(1)};
    `,
    modeHumaRewardsApy: css`
      font-size: 16px;
      font-weight: 500;
      color: #ececec;
      margin-top: ${theme.spacing(-1)};
    `,
  }

  const getMode = (mode: PermissionlessDepositMode) => {
    const modeInfos = {
      [PermissionlessDepositMode.CLASSIC]: {
        icon: <ModeClassicIcon />,
        title: 'Classic',
        apy: classicModeTargetApy,
        humaRewardsApy: classicHumaRewardsApy,
      },
      [PermissionlessDepositMode.MAXI]: {
        icon: <ModeMaxiIcon />,
        title: 'Maxi',
        apy: maxiModeTargetApy,
        humaRewardsApy: maxiHumaRewardsApy,
      },
    }

    const modeInfo = modeInfos[mode]

    return (
      <Box
        css={[
          styles.modeContainer,
          selectedDepositMode === mode && styles.modeSelected,
        ]}
        onClick={() => setSelectedDepositMode(mode)}
      >
        <Box css={styles.mode}>
          <Box css={styles.modeTitle}>
            {modeInfo.icon}
            <Box
              css={
                mode === PermissionlessDepositMode.CLASSIC
                  ? styles.modeTitleClassic
                  : styles.modeTitleMaxi
              }
            >
              {modeInfo.title}
            </Box>
          </Box>
          <Box css={styles.modeApy}>
            {toPercentage(modeInfo.apy, 1)} USDC APY
          </Box>
          <Box css={styles.modeHumaRewardsApy}>
            {toPercentage(modeInfo.humaRewardsApy, 1)} Est. $HUMA
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box css={styles.modes}>
      {getMode(PermissionlessDepositMode.CLASSIC)}
      {getMode(PermissionlessDepositMode.MAXI)}
    </Box>
  )
}
