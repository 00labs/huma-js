import { SvgIconProps } from '@mui/material'

export type WCProps<P = {}> = P & {
  children?: React.ReactNode
}

export type IconType = (
  props: SvgIconProps<'svg', {}>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => React.ReactElement<any, string | React.JSXElementConstructor<any>>

export type ColumnType<T> = {
  title: string
  dataIndex?: string
  width?: number
  style?: Record<string, string>
  action?: (record: T) => React.ReactNode
}

export type CustomError = {
  message: string
}

declare global {
  interface Window {
    REACT_APP_FORCE_DEV_PREFIX_FOR_URLS: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any
  }
}
