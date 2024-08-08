export const checkIsDev = () =>
  !!(
    window.location.hostname.startsWith('dev') ||
    window.location.hostname.startsWith('v2') ||
    window.location.hostname.startsWith('pr-') ||
    window.location.hostname.startsWith('deploy-preview') ||
    // @TODO Remove this after the env is ready
    window.location.hostname.startsWith('testnet-campaigns') ||
    process.env.NODE_ENV === 'development'
  )
