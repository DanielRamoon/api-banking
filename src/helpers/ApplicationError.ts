export class ApplicationError extends Error {
  status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}
