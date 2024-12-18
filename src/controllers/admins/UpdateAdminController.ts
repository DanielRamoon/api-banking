import { Role } from '../../entities/Admin'
import { HTTPRequest } from '../../adapters/http/HttpRequestAdapter'
import {
  HttpResponse,
  clientError,
  fail,
  notFound,
  ok
} from '../../adapters/http/HttpResponseAdapter'
import { ApplicationService } from '../../services/ApplicationService'
import { ApplicationError } from '../../helpers/ApplicationError'
import { t } from '../../config/i18next/I18nextLocalization'
import AdminValidator from '../../helpers/validators/zod/AdminValidator'
import { IAdminRepository } from '../../repositories/IAdminRepository'

type UpdateAdminParams = {
  id: string
  name: string
  email: string
  role: string
}

export default class UpdateAdminController implements HTTPRequest {
  private adminRepository: IAdminRepository
  private updateAdminService: ApplicationService

  constructor(
    adminRepository: IAdminRepository,
    updateAdminService: ApplicationService
  ) {
    this.adminRepository = adminRepository
    this.updateAdminService = updateAdminService
  }

  async handle({
    id,
    name,
    email,
    role
  }: UpdateAdminParams): Promise<HttpResponse> {
    try {
      const adminValidator = new AdminValidator(
        {
          id,
          name,
          email,
          role: role as Role
        },
        this.adminRepository
      )

      const adminValid = await adminValidator.validate()

      if (!adminValid) {
        const adminErrors = await adminValidator.errors()
        return clientError(adminErrors)
      }

      const result = await this.updateAdminService.run({
        id,
        name,
        email,
        role
      })

      if (result instanceof ApplicationError) return notFound(result)

      return ok(result)
    } catch (error) {
      return fail(new ApplicationError(t('error.internal')))
    }
  }
}
