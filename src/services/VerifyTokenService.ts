import { t } from '../config/i18next/I18nextLocalization'
import { ApplicationError } from '../helpers/ApplicationError'
import { ApplicationService } from './ApplicationService'
import jwt from 'jsonwebtoken'

export type VerifyTokenProps = {
  token: string
}

type DecodedProps = {
  id: string
  email: string
  type: string
  exp: string
}

export default class VerifyTokenService implements ApplicationService {
  #jwtSecreteKey: string = process.env.JWT_SECRET_KEY!

  public async run({
    token
  }: VerifyTokenProps): Promise<object | ApplicationError> {
    try {
      const _decoded = jwt.verify(
        token,
        this.#jwtSecreteKey
      ) as unknown as DecodedProps

      return {
        id: _decoded.id,
        email: _decoded.email,
        type: _decoded.type,
        exp: _decoded.exp
      }
    } catch (error) {
      return new ApplicationError(t('error.jwtToken.verify'))
    }
  }
}
