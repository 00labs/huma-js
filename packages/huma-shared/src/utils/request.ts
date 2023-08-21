import axios from 'axios'

export const requestGet = async <T>(url: string): Promise<T> => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  // @ts-ignore
  return axios.get(url, {}, config).then((response) => response.data as T)
}

export const requestPost = async <T>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any,
): Promise<T> => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  return (
    axios
      .post(url, payload, config)
      // @ts-ignore
      .then((response) => response.data as T)
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requestPut = async <T>(url: string, payload?: any): Promise<T> => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  return (
    axios
      .put(url, payload, config)
      // @ts-ignore
      .then((response) => response.data as T)
  )
}
