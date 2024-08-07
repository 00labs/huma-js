import axios from 'axios'
import { requestGet, requestPut } from '../../src/utils/request'

jest.mock('axios')

describe('requestGet', () => {
  it('returns the response data from a successful GET request', async () => {
    const responseData = { message: 'Success' }
    // @ts-ignore
    axios.get.mockResolvedValueOnce({ data: responseData })

    const url = 'https://example.com/api'
    const result = await requestGet(url)

    expect(result).toEqual(responseData)
    expect(axios.get).toHaveBeenCalledWith(
      url,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        withCredentials: true,
      },
    )
  })

  it('throws an error if the GET request fails', async () => {
    const errorMessage = 'Request failed'
    // @ts-ignore
    axios.get.mockRejectedValueOnce(new Error(errorMessage))

    const url = 'https://example.com/api'
    await expect(requestGet(url)).rejects.toThrow(errorMessage)
    expect(axios.get).toHaveBeenCalledWith(
      url,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        withCredentials: true,
      },
    )
  })
})

describe('requestPut', () => {
  it('returns the response data from a successful PUT request', async () => {
    const responseData = { message: 'Success' }
    // @ts-ignore
    axios.put.mockResolvedValueOnce({ data: responseData })

    const url = 'https://example.com/api'
    const result = await requestPut(url)

    expect(result).toEqual(responseData)
    expect(axios.put).toHaveBeenCalledWith(url, undefined, expect.any(Object))
  })

  it('returns the response data from a successful PUT request with payload', async () => {
    const responseData = { message: 'Success' }
    // @ts-ignore
    axios.put.mockResolvedValueOnce({ data: responseData })

    const url = 'https://example.com/api'
    const payload = { key: 'value' }
    const result = await requestPut(url, payload)

    expect(result).toEqual(responseData)
    expect(axios.put).toHaveBeenCalledWith(url, payload, expect.any(Object))
  })

  it('throws an error if the PUT request fails', async () => {
    const errorMessage = 'Request failed'
    // @ts-ignore
    axios.put.mockRejectedValueOnce(new Error(errorMessage))

    const url = 'https://example.com/api'
    await expect(requestPut(url)).rejects.toThrow(errorMessage)
    expect(axios.put).toHaveBeenCalledWith(url, undefined, expect.any(Object))
  })
})
