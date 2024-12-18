/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { randomUUID } from 'crypto'
import Holder, { HolderProps } from '../../entities/Holder'
import { ApplicationError } from '../../helpers/ApplicationError'
import { IHolderRepository } from '../IHolderRepository'
import { t } from '../../config/i18next/I18nextLocalization'

export default class HolderRepository implements IHolderRepository {
  holders: Map<string, Holder>

  constructor() {
    this.holders = new Map<string, Holder>()
  }
  userCount(holderId: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  linkUser(id: string, user_id: string): Promise<Holder | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  unlinkUser(id: string, user_id: string): Promise<Holder | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  async findByCNPJAndTaxpayerId(
    taxpayerId: string,
    cnpj?: string | undefined
  ): Promise<Holder | ApplicationError> {
    const iterator = this.holders[Symbol.iterator]()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, holder] of iterator) {
      const isDuplicated =
        holder.taxpayerId === taxpayerId && holder.cnpj === cnpj
      if (isDuplicated) return holder
    }

    return new ApplicationError(t('error.notFound', { resource: 'holder' }))
  }

  async list(): Promise<ApplicationError | Holder[]> {
    const _holders = [...this.holders.values()]
    return _holders
  }

  update(id: string, params: object): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${params}`)
  }

  delete(id: string): Promise<void | ApplicationError> {
    throw new Error(`Method not implemented. ${id}`)
  }

  async find(id: string): Promise<object | ApplicationError> {
    const holder = await this.holders.get(id)

    if (!holder)
      return new ApplicationError(t('error.notFound', { resource: 'holder' }))

    return holder
  }

  findUser(type: string, email: string): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${email}`)
  }

  updatePassword(
    email: string,
    password: string
  ): Promise<object | ApplicationError> {
    throw new Error(`Method not implemented. ${password}`)
  }

  async emailExists(email: string): Promise<boolean> {
    for (const holder of this.holders.values()) {
      const _foundUser = holder.email === email

      if (_foundUser) return true
    }

    return false
  }

  count(): Promise<number | ApplicationError> {
    throw new Error('Method not implemented.')
  }

  async create(params: HolderProps): Promise<object | ApplicationError> {
    try {
      const {
        id,
        resource,
        zoopHolderId,
        zoopAccountId,
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
        addressCountry,
        createdAt,
        updatedAt
      }: HolderProps = params

      const holder = new Holder({
        id,
        resource,
        zoopHolderId,
        zoopAccountId,
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
        addressCountry,
        createdAt,
        updatedAt
      })

      this.holders.set(id ?? randomUUID(), holder)

      return holder
    } catch (error) {
      return new ApplicationError('Error')
    }
  }

  async ensureTaxpayerIdCNPJUniqueness(
    taxpayerId: string,
    cnpj: string
  ): Promise<boolean> {
    const iterator = this.holders[Symbol.iterator]()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, holder] of iterator) {
      const isDuplicated =
        holder.taxpayerId === taxpayerId && holder.cnpj === cnpj
      if (isDuplicated) return true
    }

    return false
  }
}
