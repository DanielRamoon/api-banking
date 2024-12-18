/* eslint-disable no-unused-vars */
export default interface HttpServer {
  initialize(): void
  listen(port: string, message?: string): void
}
