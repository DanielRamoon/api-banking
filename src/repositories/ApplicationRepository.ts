/* eslint-disable no-unused-vars */
import { ApplicationError } from '../helpers/ApplicationError'

export interface ApplicationRepository {
  create(params: object): Promise<object | ApplicationError>
  list(params: object): Promise<object[] | ApplicationError>
  update(id: string, params: object): Promise<object | ApplicationError>
  delete(id: string): Promise<void | ApplicationError>
  find(id: string): Promise<object | ApplicationError>
  findUser(type: string, email: string): Promise<object | ApplicationError>
  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError>
  emailExists(email: string, id?: string): Promise<boolean>
  count(): Promise<number | ApplicationError>
}
