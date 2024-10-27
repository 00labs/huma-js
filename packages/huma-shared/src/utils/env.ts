export const checkIsDev = () =>
  !process.env.REACT_APP_FORCE_IS_DEV_FALSE &&
  !!(
    window.location.hostname.startsWith('dev') ||
    window.location.hostname.startsWith('v2') ||
    window.location.hostname.startsWith('pr-') ||
    window.location.hostname.startsWith('deploy-preview') ||
    window.location.hostname.startsWith('localhost') ||
    process.env.NODE_ENV === 'development'
  )
