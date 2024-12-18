/* eslint-disable no-unused-vars */
import { HttpResponse } from '../../adapters/http/HttpResponseAdapter'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HTTPRequest<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}
