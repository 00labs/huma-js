import axios, { AxiosRequestConfig } from 'axios'

axios.defaults.withCredentials = true

export const requestGet = async <T>(
  url: string,
  customConfig: AxiosRequestConfig = {},
): Promise<T> => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    ...customConfig,
  }

  // @ts-ignore
  return axios.get(url, {}, config).then((response) => response.data as T)
}

export const requestPost = async <T>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any,
  customConfig: AxiosRequestConfig = {},
): Promise<T> => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    ...customConfig,
  }

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
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    ...customConfig,
  }

  return (
    axios
      .put(url, payload, config)
      // @ts-ignore
      .then((response) => response.data as T)
  )
}
