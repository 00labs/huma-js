import { useMediaQuery, useTheme } from '@mui/material'

export const useMQ = () => {
  const theme = useTheme()
  const isXsSize = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmSize = useMediaQuery(theme.breakpoints.down('md'))
  const isMdSize = useMediaQuery(theme.breakpoints.down('lg'))
  const isLgSize = useMediaQuery(theme.breakpoints.up('lg'))

  return {
    isXsSize,
    isSmSize,
    isMdSize,
    isLgSize,
  }
}
