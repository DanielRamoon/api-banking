/* eslint-disable @typescript-eslint/no-explicit-any */
import ApplicationHttpRequest, {
  ApplicationHttpRequestProps,
  AuthorizationType,
  Method
} from '../../../helpers/ApplicationHttpRequest'
import { LogRepository } from '../../../repositories/prisma/LogRepository'
import { CreateLogService } from '../../../services/logs/CreateLogService'
import axios from 'axios'

export class AxiosAdapter extends ApplicationHttpRequest {
  private baseUrl: string = ''
  private accessToken: string = ''
  private headers: { [key: string]: string } = {}
  private contetType: string = ''
  private saveLog: boolean = true

  public initialize(
    authorizationType: AuthorizationType,
    baseUrl: string,
    apiKey?: string,
    password?: string,
    saveLog: boolean = true
  ): void {
    this.setBaseURL(baseUrl)
    this.setAccessToken(apiKey, password)
    this.setHeaders(this.getAccessToken(), authorizationType)
    this.saveLog = saveLog
  }

  async fetch(
    method: Method,
    url: string,
    body?: object
  ): Promise<ApplicationHttpRequestProps> {
    return new Promise<ApplicationHttpRequestProps>((resolve, reject) => {
      axios({
        url,
        method,
        data: body,
        headers: this.headers,
        withCredentials: true
      })
        .then((response: { data: any; status: number }) => {
          const { data, status } = response
          const responseHandler: ApplicationHttpRequestProps = {
            withError: false,
            status,
            data
          }

          resolve(responseHandler)
        })
        .catch(
          (error: {
            response: { data: any; status: any }
            message: string
          }) => {
            let responseHandler: ApplicationHttpRequestProps
            if (error.response) {
              responseHandler = {
                withError: true,
                status: error.response.status,
                data: { error: error.response.data },
                error: error.message
              }
            } else {
              responseHandler = {
                withError: true,
                data: { error }
              }
            }

            this.createErrorLog(
              JSON.stringify({
                url,
                body,
                response: responseHandler
              })
            )

            reject(responseHandler)
          }
        )
    })
  }

  setHeaders(token: string, authorizationType: AuthorizationType): void {
    this.headers = {
      Accept: 'application/json',
      'cache-control': 'no-cache',
      Authorization: `${authorizationType} ${token}`
    }

    if (this.getContentType())
      this.headers['Content-Type'] = this.getContentType()
  }

  addHeader(key: string, value: string): void {
    this.headers[key] = value
  }

  setAccessToken(apiKey?: string, password?: string): void {
    if (!!apiKey && password !== undefined) {
      const token = `${apiKey}:${password}`
      const encodedToken = Buffer.from(token).toString('base64')

      this.accessToken = encodedToken
    } else if (apiKey) {
      this.accessToken = apiKey
    }
  }

  setBaseURL(baseUrl: string): void {
    this.baseUrl = baseUrl
  }

  getHeaders(): object {
    return this.headers
  }

  getAccessToken(): string {
    return this.accessToken
  }

  getBaseURL(): string {
    return this.baseUrl
  }

  setContentType(contentType: string): void {
    this.contetType = contentType
  }

  getContentType(): string {
    return this.contetType ?? ''
  }

  private createErrorLog(error: string) {
    if (this.saveLog) {
      const logRepository = new LogRepository()
      const createLogService = new CreateLogService(logRepository)

      createLogService.run({
        error
      })
    }
  }
}
