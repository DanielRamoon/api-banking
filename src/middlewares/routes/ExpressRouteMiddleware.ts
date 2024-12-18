import { Response, Request } from 'express'
import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'

export const resolve = (httpRequest: HTTPRequest) => {
  return async (request: Request, response: Response) => {
    const requestData = {
      ...request.body,
      ...request.params,
      ...request.query,
      user: request.user
    }

    const httpResponse = await httpRequest.handle(requestData)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      return response.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      return response.status(httpResponse.statusCode).json({
        error: httpResponse.body.error
      })
    }
  }
}
