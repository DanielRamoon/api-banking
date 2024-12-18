/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationError } from '../../helpers/ApplicationError'

export type HttpResponse = {
  statusCode: number
  body: any
}

export function ok<T>(dto?: T): HttpResponse {
  return {
    statusCode: 200,
    body: dto
  }
}

export function created<T>(dto?: T): HttpResponse {
  return {
    statusCode: 201,
    body: dto
  }
}

export function accepted<T>(dto?: T): HttpResponse {
  return {
    statusCode: 202,
    body: dto
  }
}

export function clientError(error: string | string[] | object): HttpResponse {
  return {
    statusCode: 400,
    body: {
      error
    }
  }
}

export function unprocessable(
  error: string | string[] | object | ApplicationError
): HttpResponse {
  return {
    statusCode: 422,
    body: {
      error: error instanceof ApplicationError ? error.message : error
    }
  }
}

export function unauthorized(error: ApplicationError): HttpResponse {
  return {
    statusCode: 401,
    body: {
      error: error.message
    }
  }
}

export function forbidden(error: ApplicationError): HttpResponse {
  return {
    statusCode: 403,
    body: {
      error: error.message
    }
  }
}

export function notFound(error: ApplicationError): HttpResponse {
  return {
    statusCode: 404,
    body: {
      error: error.message
    }
  }
}

export function conflict(error: ApplicationError): HttpResponse {
  return {
    statusCode: 409,
    body: {
      error: error.message
    }
  }
}

export function tooMany(error: ApplicationError): HttpResponse {
  return {
    statusCode: 429,
    body: {
      error: error.message
    }
  }
}

export function fail(error: ApplicationError): HttpResponse {
  return {
    statusCode: 500,
    body: {
      error: error.message
    }
  }
}
