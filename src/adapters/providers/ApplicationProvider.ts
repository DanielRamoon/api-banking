/* eslint-disable no-unused-vars */

import { ApplicationError } from '../../helpers/ApplicationError'
import { ApplicationHttpRequestProps } from '../../helpers/ApplicationHttpRequest'

export interface ApplicationProvider {
  execute(
    params: object
  ): Promise<ApplicationHttpRequestProps | ApplicationError>
}
