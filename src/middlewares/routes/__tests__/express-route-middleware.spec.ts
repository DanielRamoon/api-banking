import { describe, expect, it } from '@jest/globals'
import { resolve } from '../ExpressRouteMiddleware'
import { HTTPRequest } from '../../../adapters/http/HttpRequestAdapter'
import { Request, Response } from 'express'

const mockHttpRequest: HTTPRequest = {
  handle: jest.fn()
}

const mockRequest = {} as Request
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
} as unknown as Response

describe('resolve', () => {
  it('should handle the HTTP request and return a successful response', async () => {
    ;(mockHttpRequest.handle as jest.Mock).mockResolvedValue({
      statusCode: 200,
      body: { message: 'Success' }
    })

    await resolve(mockHttpRequest)(mockRequest, mockResponse)

    expect(mockHttpRequest.handle).toHaveBeenCalledWith({
      ...mockRequest.body,
      ...mockRequest.params,
      ...mockRequest.query
    })
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Success' })
  })

  it('should handle the HTTP request and return an error response', async () => {
    ;(mockHttpRequest.handle as jest.Mock).mockResolvedValue({
      statusCode: 400,
      body: { error: 'Bad Request' }
    })

    await resolve(mockHttpRequest)(mockRequest, mockResponse)

    expect(mockHttpRequest.handle).toHaveBeenCalledWith({
      ...mockRequest.body,
      ...mockRequest.params,
      ...mockRequest.query
    })
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Bad Request' })
  })
})
