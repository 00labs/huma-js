export function isValidHttpUrl(path: string) {
  let url

  try {
    url = new URL(path)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
