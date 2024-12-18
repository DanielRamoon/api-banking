import { ApplicationError } from '../ApplicationError'

describe('ApplicationError', () => {
  it('should create an instance of ApplicationError', () => {
    const errorMessage = 'Test error message'
    const error = new ApplicationError(errorMessage)

    expect(error).toBeInstanceOf(ApplicationError)
    expect(error.message).toBe(errorMessage)
  })

  it('should have a name property equal to "Error"', () => {
    const error = new ApplicationError('Test error message')

    expect(error.name).toBe('Error')
  })

  it('should have the correct stack trace', () => {
    const errorMessage = 'Test error message'
    const error = new ApplicationError(errorMessage)

    expect(error.stack).toContain(errorMessage)
    expect(error.stack).toContain('Error: Test error message')
  })
})
