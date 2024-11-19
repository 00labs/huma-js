// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmpty = (value: undefined | null | any) =>
  value === undefined || value === null

export const openInNewTab = (url: string) => {
  // @ts-ignore
  window.open(url, '_blank').focus()
}

export const sleep = (ms: number) =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, ms))

export const isIframe = () => window !== window.parent
