import { ApplicationError } from '../../../helpers/ApplicationError'
import {
  ok,
  created,
  clientError,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  tooMany,
  fail
} from '../HttpResponseAdapter'
import { describe, expect, it } from '@jest/globals'

describe('when is the ok function', () => {
  it('should return status 200', () => {
    const httpResponse = ok({ message: 'ok' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toBeDefined
  })
})

describe('when is the created function', () => {
  it('should return status 201', () => {
    const httpResponse = created({ message: 'created successfully' })

    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toBeDefined
  })
})

describe('when is the clientError function', () => {
  it('should return status 400', () => {
    const httpResponse = clientError('client error')

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe('client error')
  })
})

describe('when is the unauthorized function', () => {
  it('should return status 401', () => {
    const httpResponse = unauthorized(new ApplicationError('Unauthorized'))

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.error).toBe('Unauthorized')
  })
})

describe('when is the forbidden function', () => {
  it('should return status 403', () => {
    const httpResponse = forbidden(new ApplicationError('Forbidden'))

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body.error).toBe('Forbidden')
  })
})

describe('when is the notFound function', () => {
  it('should return status 404', () => {
    const httpResponse = notFound(new ApplicationError('Not Found'))

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body.error).toBe('Not Found')
  })
})

describe('when is the conflict function', () => {
  it('should return status 409', () => {
    const httpResponse = conflict(new ApplicationError('There was a conflict'))

    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body.error).toBe('There was a conflict')
  })
})

describe('when is the tooMany function', () => {
  it('should return status 429', () => {
    const httpResponse = tooMany(new ApplicationError('Too Many Requests'))

    expect(httpResponse.statusCode).toBe(429)
    expect(httpResponse.body.error).toBe('Too Many Requests')
  })
})

describe('when is the fail function', () => {
  it('should return status 500', () => {
    const httpResponse = fail(new ApplicationError('Internal Error'))

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe('Internal Error')
  })
})
