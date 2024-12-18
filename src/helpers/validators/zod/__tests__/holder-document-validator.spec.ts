import { describe, expect, it } from '@jest/globals'
import holderDocumentMock from '../../../../__mocks__/entities/holder-document-mock'
import holderMock from '../../../../__mocks__/entities/holder-mock'
import HolderDocumentValidator from '../HolderDocumentValidator'
import { t } from '../../../../config/i18next/I18nextLocalization'
import {
  HolderDocumentProps,
  DocumentType
} from '../../../../entities/HolderDocument'
import HolderRepository from '../../../../repositories/memory/HolderRepository'

const holderRepository = new HolderRepository()

describe('AdminValidator', () => {
  beforeAll(async () => {
    await holderRepository.create(holderMock)
  })

  it('should validate valid user parameters', async () => {
    const mock: HolderDocumentProps = {
      ...holderDocumentMock,
      holderId: holderMock.id!
    }
    const adminValidator = new HolderDocumentValidator(mock, holderRepository)

    expect(await adminValidator.validate()).toBe(true)
    expect(await adminValidator.errors()).toEqual([])
  })

  it('should throw validation error for invalid company document id', async () => {
    const invalidCompanyDocumentParams: HolderDocumentProps = {
      ...holderDocumentMock,
      id: '123-456'
    }
    const adminValidator = new HolderDocumentValidator(
      invalidCompanyDocumentParams,
      holderRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.holderDocument.error.id.format', {
        id: invalidCompanyDocumentParams.id
      })
    )
  })

  it('should throw validation error for missing type', async () => {
    const invalidCompanyDocumentParams: HolderDocumentProps = {
      ...holderDocumentMock,
      type: '' as DocumentType
    }
    const adminValidator = new HolderDocumentValidator(
      invalidCompanyDocumentParams,
      holderRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.holderDocument.error.type.format', { type: '' })
    )
  })

  it('should throw validation error for missing type', async () => {
    const invalidCompanyDocumentParams: HolderDocumentProps = {
      ...holderDocumentMock,
      file: ''
    }
    const adminValidator = new HolderDocumentValidator(
      invalidCompanyDocumentParams,
      holderRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.holderDocument.error.file.format', { file: '' })
    )
  })

  it('should throw validation error for invalid zoop account id', async () => {
    const invalidCompanyDocumentParams: HolderDocumentProps = {
      ...holderDocumentMock,
      holderId: '123-456'
    }
    const adminValidator = new HolderDocumentValidator(
      invalidCompanyDocumentParams,
      holderRepository
    )

    expect(await adminValidator.validate()).toBe(false)
    expect(await adminValidator.errors()).toContain(
      t('entity.holderDocument.error.holderId.format', {
        id: invalidCompanyDocumentParams.holderId
      })
    )
  })
})
