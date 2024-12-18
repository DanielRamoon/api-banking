/* eslint-disable no-unused-vars */
import { ApplicationError } from '../helpers/ApplicationError'

export interface ApplicationMailer {
  send(
    subject: string,
    to: Array<object>,
    linkRecovery: string
  ): Promise<object | ApplicationError>
  sendRecoveryPassword(
    subject: string,
    to: Array<object>,
    token: string
  ): Promise<object | ApplicationError>
}
