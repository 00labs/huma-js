import InfoOutlineIcon from '@mui/icons-material/InfoOutlined'
import { Box, css, Tooltip, useTheme } from '@mui/material'
import React from 'react'

export function SelectModeTitle(): React.ReactElement {
  const theme = useTheme()

  const styles = {
    selectDepositMode: css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: ${theme.spacing(2)};
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
  }

  return (
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
  )
}
