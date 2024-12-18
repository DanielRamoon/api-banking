import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  created,
  fail,
  unprocessable
} from '../../adapters/http/HttpResponseAdapter'
import { ApplicationService } from '../../services/ApplicationService'
import { ApplicationError } from '../../helpers/ApplicationError'
import PasswordValidator from '../../helpers/validators/zod/PasswordValidator'
import { Role } from '../../entities/Admin'
import { t } from '../../config/i18next/I18nextLocalization'
import PasswordHelper from '../../helpers/PasswordHelper'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import AdminValidator from '../../helpers/validators/zod/AdminValidator'

type CreateAdminParams = {
  name: string
  email: string
  role: string
  password: string
  confirm: string
}

export default class CreateAdminController implements HTTPRequest {
  private adminRepository: IAdminRepository
  private createAdminService: ApplicationService

  constructor(
    adminRepository: IAdminRepository,
    createAdminService: ApplicationService
  ) {
    this.adminRepository = adminRepository
    this.createAdminService = createAdminService
  }

  async handle({
    name,
    email,
    role,
    password,
    confirm
  }: CreateAdminParams): Promise<HttpResponse> {
    try {
      const adminValidator = new AdminValidator(
        {
          name,
          email,
          role: role as Role
        },
        this.adminRepository,
        true
      )

      const passwordValidator = new PasswordValidator({ password, confirm })

      const adminValid = await adminValidator.validate()
      const passwordValid = await passwordValidator.validate()

      const errors = []
      if (!adminValid) {
        const adminErrors = await adminValidator.errors()
        errors.push({ admin: adminErrors })
      }

      if (!passwordValid) {
        const passwordErrors = await passwordValidator.errors()
        errors.push({ password: passwordErrors })
      }

      if (errors.length > 0) {
        return clientError(errors)
      }

      const encryptedPassword = await PasswordHelper.encrypt(password)

      const result = await this.createAdminService.run({
        name,
        email,
        role,
        encryptedPassword
      })

      if (result instanceof ApplicationError) return unprocessable(result)

      return created(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
