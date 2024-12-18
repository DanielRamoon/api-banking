import { t } from '../config/i18next/I18nextLocalization'
import { ApplicationError } from '../helpers/ApplicationError'
import { ApplicationService } from './ApplicationService'
import jwt from 'jsonwebtoken'

export type CreatreTokenProps = {
  payload: object
  expiresIn?: string
}

export default class CreateTokenService implements ApplicationService {
  #jwtSecretKey: string = process.env.JWT_SECRET_KEY!

  public async run({
    payload,
    expiresIn
  }: CreatreTokenProps): Promise<string | ApplicationError> {
    if (!payload) return new ApplicationError(t('error.jwtToken.required'))

    return jwt.sign(payload, this.#jwtSecretKey, {
      expiresIn: expiresIn ?? '1h'
    })
  }
}
