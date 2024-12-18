/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface ApplicationValidator {
  schema(): any
  parse(): Promise<any>
  validate(): Promise<boolean>
  errors(): Promise<string[]>
}
