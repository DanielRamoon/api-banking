import { describe, expect, it } from '@jest/globals'
import HolderDocument, { DocumentType } from '../HolderDocument'
import holderDocumentMock from '../../__mocks__/entities/holder-document-mock'

describe('HolderDocument Class', () => {
  it('should create a HolderDocument instance', () => {
    const document = new HolderDocument(holderDocumentMock)
    expect(document).toBeInstanceOf(HolderDocument)
  })

  it('should return the correct ID', () => {
    const document = new HolderDocument(holderDocumentMock)
    expect(document.id).toBe(holderDocumentMock.id)
  })

  it('should return the correct resource', () => {
    const document = new HolderDocument(holderDocumentMock)
    expect(document.resource).toBe('holder_document')
  })

  it('should return the correct type', () => {
    const document = new HolderDocument(holderDocumentMock)
    expect(document.type).toBe(DocumentType.SELFIE)
  })

  it('should return the correct file', () => {
    const document = new HolderDocument(holderDocumentMock)
    expect(document.file).toBe('selfie.jpg')
  })

  it('should return the correct holderId', () => {
    const document = new HolderDocument(holderDocumentMock)
    expect(document.holderId).toBe(holderDocumentMock.holderId)
  })

  it('should return the correct createdAt date', () => {
    const document = new HolderDocument(holderDocumentMock)
    expect(document.createdAt).toEqual(new Date('2023-01-01'))
  })

  it('should return the correct updatedAt date', () => {
    const document = new HolderDocument(holderDocumentMock)
    expect(document.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
