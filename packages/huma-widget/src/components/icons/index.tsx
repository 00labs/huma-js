import { SvgIconProps } from '@mui/material'
import ApproveLenderSvg from './approve-lender.svg?react'
import AutoPaybackSvg from './auto-payback.svg?react'
import CeloSvg from './celo.svg?react'
import CheckCircleSvg from './check-circle.svg?react'
import CheckGreenSvg from './check-green.svg?react'
import CheckSvg from './check.svg?react'
import CongratulationsSvg from './congratulations.svg?react'
import DonutSvg from './donut.svg?react'
import EthereumSvg from './ethereum.svg?react'
import HumaFullLogoSvg from './huma-full.svg?react'
import HumaPointsSvg from './huma-points.svg?react'
import HumaLogoSvg from './huma.svg?react'
import LoaderSvg from './loader.svg?react'
import MetamaskSvg from './metamask.svg?react'
import MinusSignInactiveSvg from './minus-sign-inactive.svg?react'
import MinusSignSvg from './minus-sign.svg?react'
import ModeClassicSvg from './mode-classic.svg?react'
import ModeMaxiSvg from './mode-maxi.svg?react'
import PlusSignInactiveSvg from './plus-sign-inactive.svg?react'
import PlusSignSvg from './plus-sign.svg?react'
import PolygonSvg from './polygon.svg?react'
import ReceiptSvg from './receipt.svg?react'
import RibbonSvg from './ribbon.svg?react'
import SeparatorSvg from './separator.svg?react'
import SorrySvg from './sorry.svg?react'
import UsdcSvg from './usdc.svg?react'
import WalletConnectSvg from './wallet-connect.svg?react'

export function HumaIcon(props: SvgIconProps): React.ReactElement {
  return <HumaLogoSvg {...props} />
}

export function HumaFullIcon(props: SvgIconProps): React.ReactElement {
  return <HumaFullLogoSvg {...props} />
}

export function MetamaskIcon(props: SvgIconProps): React.ReactElement {
  return <MetamaskSvg {...props} />
}

export function WalletConnectIcon(props: SvgIconProps): React.ReactElement {
  return <WalletConnectSvg {...props} />
}

export function EthereumIcon(props: SvgIconProps): React.ReactElement {
  return <EthereumSvg {...props} />
}

export function PolygonIcon(props: SvgIconProps): React.ReactElement {
  return <PolygonSvg {...props} />
}

export function ReceiptIcon(props: SvgIconProps): React.ReactElement {
  return <ReceiptSvg {...props} />
}

export function SeparatorIcon(props: SvgIconProps): React.ReactElement {
  return <SeparatorSvg {...props} />
}

export function LoaderIcon(props: SvgIconProps): React.ReactElement {
  return <LoaderSvg {...props} />
}

export function SorryIcon(props: SvgIconProps): React.ReactElement {
  return <SorrySvg {...props} />
}

export function CheckIcon(props: SvgIconProps): React.ReactElement {
  return <CheckSvg {...props} />
}

export function CheckGreenIcon(props: SvgIconProps): React.ReactElement {
  return <CheckGreenSvg {...props} />
}

export function CheckCircleIcon(props: SvgIconProps): React.ReactElement {
  return <CheckCircleSvg {...props} />
}

export function AutoPaybackIcon(props: SvgIconProps): React.ReactElement {
  return <AutoPaybackSvg {...props} />
}

export function ApproveLenderIcon(props: SvgIconProps): React.ReactElement {
  return <ApproveLenderSvg {...props} />
}

export function DonutIcon(props: SvgIconProps): React.ReactElement {
  return <DonutSvg {...props} />
}

export function UsdcIcon(props: SvgIconProps): React.ReactElement {
  return <UsdcSvg {...props} />
}

export function CeloIcon(props: SvgIconProps): React.ReactElement {
  return <CeloSvg {...props} />
}

export function CongratulationsIcon(props: SvgIconProps): React.ReactElement {
  return <CongratulationsSvg {...props} />
}

export function RibbonIcon(props: SvgIconProps): React.ReactElement {
  return <RibbonSvg {...props} />
}

export function HumaPointsIcon(props: SvgIconProps): React.ReactElement {
  return <HumaPointsSvg {...props} />
}

export function ModeClassicIcon(props: SvgIconProps): React.ReactElement {
  return <ModeClassicSvg {...props} />
}

export function ModeMaxiIcon(props: SvgIconProps): React.ReactElement {
  return <ModeMaxiSvg {...props} />
}

export function MinusSignIcon(props: SvgIconProps): React.ReactElement {
  return <MinusSignSvg {...props} />
}

export function PlusSignIcon(props: SvgIconProps): React.ReactElement {
  return <PlusSignSvg {...props} />
}

export function MinusSignInactiveIcon(props: SvgIconProps): React.ReactElement {
  return <MinusSignInactiveSvg {...props} />
}

export function PlusSignInactiveIcon(props: SvgIconProps): React.ReactElement {
  return <PlusSignInactiveSvg {...props} />
}

export function getIcon(icon: string) {
  if (!icon) return null

  return (
    {
      USDC: UsdcIcon,
      Celo: CeloIcon,
    }[icon] || null
  )
}
