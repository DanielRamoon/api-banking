import { describe, expect, it } from '@jest/globals'
import { AxiosAdapter } from '../../axios/AxiosAdapter'
import axios from 'axios'
import {
  AuthorizationType,
  Method
} from '../../../../helpers/ApplicationHttpRequest'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('AxiosAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should make a successful GET request', async () => {
    const baseUrl = 'https://example.com'
    const apiKey = 'api-key'
    const adapter = new AxiosAdapter()
    adapter.initialize(AuthorizationType.basic, baseUrl, apiKey, '', false)

    const responseData = { message: 'Success' }
    const responseStatus = 200

    ;(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({
      data: responseData,
      status: responseStatus
    })

    const result = await adapter.fetch(Method.GET, '/api/resource')

    expect(mockedAxios).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      withError: false,
      status: responseStatus,
      data: responseData
    })
  })

  it('should make a failed GET request', async () => {
    const baseUrl = 'https://example.com'
    const apiKey = 'api-key'
    const adapter = new AxiosAdapter()
    adapter.initialize(AuthorizationType.basic, baseUrl, apiKey, '', false)

    const errorMessage = 'Not Found'
    const responseStatus = 404

    ;(mockedAxios as unknown as jest.Mock).mockRejectedValueOnce({
      response: {
        data: errorMessage,
        status: responseStatus
      }
    })

    try {
      await adapter.fetch(Method.GET, '/api/resource')
    } catch (error) {
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      expect(error).toEqual({
        withError: true,
        status: responseStatus,
        data: { error: errorMessage },
        error: undefined
      })
    }
  })
})
