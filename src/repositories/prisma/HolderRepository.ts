import { prisma } from '../../config/database/prisma'
import { t } from '../../config/i18next/I18nextLocalization'
import Holder, { HolderProps } from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import ApplicationHelper from '../../helpers/ApplicationHelper'
import { IHolderRepository } from '../IHolderRepository'

type ListHoldersParams = {
  search: string
  page: number
  perPage: number
}

export class HolderRepository implements IHolderRepository {
  async linkUser(
    id: string,
    user_id: string
  ): Promise<Holder | ApplicationError> {
    try {
      const holderPrisma = await prisma.holder.findUnique({
        where: { id }
      })

      if (!holderPrisma)
        return new ApplicationError(t('error.notFound', { resource: 'holder' }))

      await prisma.user.update({
        where: { id: user_id },
        data: {
          holder_id: id
        }
      })

      const holder = ApplicationHelper.snakeToCamel(holderPrisma) as HolderProps
      return holder as Holder
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.updating', { resource: 'holder' })
      return new ApplicationError(_message)
    }
  }

  async unlinkUser(
    id: string,
    user_id: string
  ): Promise<Holder | ApplicationError> {
    try {
      const holderPrisma = await prisma.holder.findUnique({
        where: { id }
      })

      if (!holderPrisma)
        return new ApplicationError(t('error.notFound', { resource: 'holder' }))

      await prisma.user.update({
        where: { id: user_id, holder_id: id },
        data: {
          holder_id: null
        }
      })

      const holder = ApplicationHelper.snakeToCamel(holderPrisma) as HolderProps
      return holder as Holder
    } catch (error) {
      const _message =
        error instanceof ApplicationError
          ? error.message
          : t('error.updating', { resource: 'holder' })
      return new ApplicationError(_message)
    }
  }

  async find(id: string): Promise<Holder | ApplicationError> {
    try {
      const holderPrisma = await prisma.holder.findFirst({
        where: {
          OR: [{ id }, { zoop_holder_id: id }]
        },
        include: {
          holder_documents: true,
          operations: true
        }
      })

      if (!holderPrisma)
        return new ApplicationError(t('error.notFound', { resource: 'holder' }))

      const holder = ApplicationHelper.snakeToCamel(holderPrisma) as HolderProps

      return holder as Holder
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async findByCNPJAndTaxpayerId(
    taxpayerId: string,
    cnpj?: string
  ): Promise<Holder | ApplicationError> {
    try {
      let cnpjVerification = {}
      if (cnpj) {
        const formattedCNPJ = ApplicationHelper.CNPJFormatted(cnpj)
        cnpjVerification = {
          OR: [
            { cnpj },
            { cnpj: cnpj.replace(/\D+/g, '') },
            { cnpj: formattedCNPJ }
          ]
        }
      }

      const TaxpayerIdFormatted =
        ApplicationHelper.taxpayerIdFormatted(taxpayerId)

      const holderPrisma = await prisma.holder.findFirst({
        where: {
          OR: [
            { taxpayer_id: taxpayerId },
            { taxpayer_id: taxpayerId.replace(/\D+/g, '') },
            { taxpayer_id: TaxpayerIdFormatted }
          ],
          ...cnpjVerification
        }
      })

      if (!holderPrisma)
        return new ApplicationError(t('error.notFound', { resource: 'holder' }))

      const holder = ApplicationHelper.snakeToCamel(holderPrisma) as HolderProps
      return holder as Holder
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async list({
    search,
    page,
    perPage
  }: ListHoldersParams): Promise<ApplicationError | Holder[]> {
    try {
      const TaxpayerIdFormatted = ApplicationHelper.taxpayerIdFormatted(search)
      const CNPJFormatted = ApplicationHelper.CNPJFormatted(search)

      const holders = await prisma.holder.findMany({
        skip: page,
        take: perPage,
        where: {
          OR: [
            { id: search },
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { taxpayer_id: { contains: search } },
            { taxpayer_id: { contains: search.replace(/\D+/g, '') } },
            { taxpayer_id: { contains: TaxpayerIdFormatted } },
            { cnpj: { contains: search } },
            { cnpj: { contains: search.replace(/\D+/g, '') } },
            { cnpj: { contains: CNPJFormatted } }
          ]
        },
        include: {
          holder_documents: true,
          operations: true
        }
      })

      const formatedHolders = holders.map(holder => {
        return new Holder(ApplicationHelper.snakeToCamel(holder) as HolderProps)
      })

      return formatedHolders
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async count(): Promise<number | ApplicationError> {
    const holdersAggregate = await prisma.holder.aggregate({
      _count: {
        id: true
      }
    })

    return holdersAggregate?._count?.id
  }

  async ensureTaxpayerIdCNPJUniqueness(
    taxpayerId: string,
    cnpj: string,
    id?: string
  ): Promise<boolean> {
    const formatedTaxpayerId = taxpayerId.replace(/\D+/g, '')

    let validateWithId = {}
    if (id) {
      validateWithId = { NOT: { id } }
    }

    let cnpjVerification = {}
    if (cnpj) {
      const formattedCNPJ = cnpj.replace(/\D+/g, '')
      cnpjVerification = {
        OR: [{ cnpj }, { cnpj: formattedCNPJ }]
      }
    }

    const holder = await prisma.holder.findFirst({
      where: {
        taxpayer_id: formatedTaxpayerId,
        ...cnpjVerification,
        ...validateWithId
      }
    })

    return !!holder
  }

  async create({
    taxpayerId,
    name,
    accountType,
    email,
    cnpj,
    revenueCents,
    cbo,
    rg,
    pep,
    mothersName,
    birthday,
    cnae,
    legalName,
    establishmentFormat,
    establishmentDate,
    phoneAreaCode,
    phonePrefix,
    phoneNumber,
    addressStreet,
    addressNumber,
    addressCity,
    addressComplement,
    addressState,
    addressNeighborhood,
    addressPostalCode,
    addressCountry
  }: HolderProps): Promise<Holder | ApplicationError> {
    try {
      const holderPrisma = await prisma.holder.create({
        data: {
          name,
          email,
          cnpj,
          cbo,
          rg,
          pep,
          birthday,
          cnae: cnae || '',
          taxpayer_id: taxpayerId,
          account_type: accountType,
          revenue_cents: revenueCents,
          mothers_name: mothersName,
          legal_name: legalName,
          establishment_format: establishmentFormat,
          establishment_date: establishmentDate,
          phone_area_code: phoneAreaCode,
          phone_prefix: phonePrefix,
          phone_number: phoneNumber,
          address_street: addressStreet,
          address_number: addressNumber,
          address_city: addressCity,
          address_complement: addressComplement,
          address_state: addressState,
          address_neighborhood: addressNeighborhood,
          address_postal_code: addressPostalCode,
          address_country: addressCountry
        }
      })

      const holder = ApplicationHelper.snakeToCamel(holderPrisma) as HolderProps

      return new Holder(holder)
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async update(
    id: string,
    params: HolderProps
  ): Promise<Holder | ApplicationError> {
    try {
      const _params = ApplicationHelper.camelToSnake(params)

      const holder = await prisma.holder.update({
        where: { id },
        data: {
          ..._params
        }
      })

      const updatedHolder = new Holder(
        ApplicationHelper.snakeToCamel(holder) as HolderProps
      )

      return updatedHolder
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  async delete(id: string): Promise<void | ApplicationError> {
    try {
      await prisma.holder.delete({
        where: { id }
      })
    } catch (error) {
      const _message =
        error instanceof ApplicationError ? error.message : t('error.internal')
      return new ApplicationError(_message)
    }
  }

  findUser(type: string, email: string): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${{ type, email }}`)
  }

  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${{ email, password }}`)
  }

  async emailExists(email: string, id?: string): Promise<boolean> {
    try {
      let validateWithId = {}
      if (id) {
        validateWithId = { NOT: { id } }
      }

      const holder = await prisma.holder.findUnique({
        where: { email, ...validateWithId }
      })

      return !!holder
    } catch (error) {
      return false
    }
  }

  async userCount(holderId: string): Promise<number> {
    const users = await prisma.user.findMany({
      where: { holder_id: holderId }
    })

    return users.length
  }
}
