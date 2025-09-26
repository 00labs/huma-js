import { toPercentage } from '@huma-finance/shared'
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined'
import { Box, css, Tooltip, useTheme } from '@mui/material'
import React from 'react'
import { HumaNoEmptySpaceIcon, UsdcIcon } from '../../../icons'

type Props = {
  usdcApy: number | undefined
  humaRewardsApy: number | undefined
}

export function Apy({ usdcApy, humaRewardsApy }: Props): React.ReactElement {
  const theme = useTheme()

  const styles = {
    container: css`
      display: flex;
      flex-direction: column;
      margin-top: ${theme.spacing(2)};
    `,
    usdcApy: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${theme.spacing(0.5)};
    `,
    usdcApyTitle: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${theme.spacing(0.5)};
      color: #b8b8b8;
      font-size: 16px;
      font-weight: 500;
      line-height: 150%;
      letter-spacing: 0.15px;
    `,
    usdcApyValue: css`
      display: flex;
      align-items: center;
      gap: ${theme.spacing(0.5)};
      color: #b8b8b8;
      font-size: 16px;
      font-weight: 500;
      line-height: 150%;
      letter-spacing: 0.15px;

      & > svg {
        width: 16px;
        height: 16px;
      }
    `,
    humaRewardsApy: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${theme.spacing(0.5)};
    `,
    humaRewardsApyValue: css`
      display: flex;
      align-items: center;
      gap: ${theme.spacing(0.5)};
      color: #b8b8b8;
      font-size: 16px;
      font-weight: 500;
      line-height: 150%;
      letter-spacing: 0.15px;

      & > svg {
        width: 16px;
        height: 16px;
      }
    `,
    infoIcon: css`
      width: 16px;
      height: 16px;
      color: #686868;
    `,
    humaRewardsApyTitle: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${theme.spacing(0.5)};
      color: #b8b8b8;
      font-size: 16px;
      font-weight: 500;
      line-height: 150%;
      letter-spacing: 0.15px;
    `,
  }

  return (
    <Box css={styles.container}>
      <Box css={styles.usdcApy}>
        <Box css={styles.usdcApyTitle}>
          <Box>USDC yield</Box>
          <Tooltip
            title='Current monthly USDC APY for Classic mode.'
            placement='top'
          >
            <InfoOutlineIcon css={styles.infoIcon} />
          </Tooltip>
        </Box>
        <Box css={styles.usdcApyValue}>
          <Box>{toPercentage(usdcApy, 1)}</Box>
          <UsdcIcon />
        </Box>
      </Box>
      <Box css={styles.humaRewardsApy}>
        <Box css={styles.humaRewardsApyTitle}>
          <Box>Huma rewards</Box>
          <Tooltip
            title='Returns are estimated based on the 7-day average price of $HUMA.'
            placement='top'
          >
            <InfoOutlineIcon css={styles.infoIcon} />
          </Tooltip>
        </Box>
        <Box css={styles.humaRewardsApyValue}>
          <Box>{toPercentage(humaRewardsApy, 1)}</Box>
          <HumaNoEmptySpaceIcon />
        </Box>
      </Box>
    </Box>
  )
}
