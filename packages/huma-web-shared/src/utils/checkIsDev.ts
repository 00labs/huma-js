export const checkIsDev = () =>
  import.meta.env.VITE_FORCE_IS_DEV_FALSE !== 'true' &&
  !!(
    window.location.hostname.startsWith('dev') ||
    window.location.hostname.startsWith('pr-') ||
    window.location.hostname.startsWith('localhost') ||
    window.location.hostname.startsWith('testnet')
  )
