const checkIsDev = () =>
  window.location.hostname.startsWith('dev') ||
  window.location.hostname.startsWith('deploy-preview') ||
  process.env.NODE_ENV === 'development'

export const envUtil = {
  checkIsDev,
}
