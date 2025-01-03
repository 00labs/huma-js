import axios, { AxiosRequestConfig } from 'axios'

axios.defaults.withCredentials = true

const getConfig = (customConfig: AxiosRequestConfig = {}) => ({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  ...customConfig,
})

export const requestGet = async <T>(
  url: string,
  customConfig: AxiosRequestConfig = {},
): Promise<T> => {
  const config = getConfig(customConfig)
  // @ts-ignore
  return axios.get(url, config).then((response) => response.data as T)
}

export const requestPost = async <T>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any,
  customConfig: AxiosRequestConfig = {},
): Promise<T> => {
  const config = getConfig(customConfig)
  return (
    axios
      .post(url, payload, config)
      // @ts-ignore
      .then((response) => response.data as T)
  )
}

export const requestPut = async <T>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any,
  customConfig: AxiosRequestConfig = {},
): Promise<T> => {
  const config = getConfig(customConfig)
  return (
    axios
      .put(url, payload, config)
      // @ts-ignore
      .then((response) => response.data as T)
  )
}

export const requestPatch = async <T>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any,
  customConfig: AxiosRequestConfig = {},
): Promise<T> => {
  const config = getConfig(customConfig)
  return (
    axios
      .patch(url, payload, config)
      // @ts-ignore
      .then((response) => response.data as T)
  )
}
