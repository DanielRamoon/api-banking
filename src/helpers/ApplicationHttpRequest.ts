/* eslint-disable no-unused-vars */
export enum AuthorizationType {
  basic = 'Basic',
  bearer = 'Bearer'
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type ApplicationHttpRequestProps = {
  withError?: boolean
  data?: {
    error?: {
      message?: string
      status?: number | string
      type?: string
      status_code?: number
      fields?: string | object
      error?: {
        message?: string
        status?: number | string
      }
    }
  }
  status?: number
  error?: string
}

export default abstract class ApplicationHttpRequest {
  abstract initialize(
    authorizationType: AuthorizationType,
    baseUrl: string,
    apiKey?: string,
    password?: string
  ): void
  abstract fetch(
    method: Method,
    url: string,
    body?: object
  ): Promise<ApplicationHttpRequestProps>
  abstract setHeaders(token: string, authorizationType: AuthorizationType): void
  abstract setAccessToken(apiKey?: string, password?: string): void
  abstract setBaseURL(baseUrl: string): void
  abstract getHeaders(): object
  abstract getAccessToken(): string
  abstract getBaseURL(): string
  abstract setContentType(contentType: string): void
  abstract getContentType(): string
  abstract addHeader(key: string, value: string): void
}
