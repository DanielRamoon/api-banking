/* eslint-disable no-unused-vars */
import { ApplicationError } from '../helpers/ApplicationError'

export interface ApplicationService {
  run(params: object): Promise<unknown | ApplicationError>
}
