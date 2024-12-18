import { ApplicationError } from '../../helpers/ApplicationError'
import SendMailService from '../SendMailService'
import CreateTokenService from '../CreateTokenService'
import { t } from '../../config/i18next/I18nextLocalization'
import { ALLOWED_USER_TYPES, EMAIL_REGEX } from '../../helpers/constants'
import { ApplicationMailer } from '../../mailers/ApplicationMailer'
import { ApplicationRepositoryHelper } from '../../helpers/ApplicationRepositoryHelper'

type RecoveryPasswordProps = {
  type: string
  email: string
  name: string
}

// eslint-disable-next-line prettier/prettier
export default class SendRecoveryPasswordEmailService implements SendMailService {
  private applicationMailer: ApplicationMailer
  private applicationRepository: ApplicationRepositoryHelper
  private createTokenService: CreateTokenService

  constructor(
    applicationMailer: ApplicationMailer,
    applicationRepository: ApplicationRepositoryHelper
  ) {
    this.applicationMailer = applicationMailer
    this.applicationRepository = applicationRepository
    this.createTokenService = new CreateTokenService()
  }

  async run({
    type,
    email,
    name
  }: RecoveryPasswordProps): Promise<object | ApplicationError> {
    try {
      if (!type)
        return new ApplicationError(t('email.error.user_type.required'))

      if (!ALLOWED_USER_TYPES.includes(type))
        return new ApplicationError(
          t('email.error.user_type.invalid', { type })
        )

      if (!email) return new ApplicationError(t('email.error.required'))
      if (!EMAIL_REGEX.test(email))
        return new ApplicationError(t('email.error.invalid'))

      const repository = this.applicationRepository.getRepositoryInstance(type)
      const emailExists = await repository.emailExists(email)

      if (!emailExists)
        throw new ApplicationError(t('error.notFound', { resource: 'Email' }))

      const subject = t('email.password.recovery.subject')
      const to = [{ email, name }]
      const token = (await this.createTokenService.run({
        payload: { type, email, name },
        expiresIn: (1000 * 60 * 20).toString()
      })) as string

      const result = await this.applicationMailer.sendRecoveryPassword(
        subject,
        to,
        token
      )

      return result
    } catch (error) {
      if (error instanceof ApplicationError) {
        return new ApplicationError(error.message)
      } else {
        return new ApplicationError(t('error.internal'))
      }
    }
  }
}
