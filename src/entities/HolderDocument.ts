/* eslint-disable no-unused-vars */
export type HolderDocumentProps = {
  id?: string
  resource?: string
  type: DocumentType
  file: string
  holderId: string
  createdAt?: Date
  updatedAt?: Date
}

export enum DocumentType {
  SELFIE = 'SELFIE',
  RG_FRENTE = 'RG_FRENTE',
  RG_VERSO = 'RG_VERSO',
  CNH_FRENTE = 'CNH_FRENTE',
  CNH_VERSO = 'CNH_VERSO',
  CCMEI = 'CCMEI',
  PAGINA_CONTRATO_SOCIAL = 'PAGINA_CONTRATO_SOCIAL',
  PAGINA_ESTATUTO_SOCIAL = 'PAGINA_ESTATUTO_SOCIAL',
  PAGINA_ATA_ELEICAO_DIRETORES = 'PAGINA_ATA_ELEICAO_DIRETORES',
  PAGINA_PROCURACAO = 'PAGINA_PROCURACAO'
}

export default class HolderDocument {
  private props: HolderDocumentProps

  constructor(dto: HolderDocumentProps) {
    this.props = dto
  }

  get serializable_hash(): HolderDocument {
    return {
      id: this.id,
      resource: this.resource,
      type: this.type,
      file: this.file,
      holderId: this.holderId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as HolderDocument
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get resource(): string {
    return this.props.resource ?? 'holder_document'
  }

  get type(): DocumentType {
    return this.props.type
  }

  get file(): string {
    return this.props.file
  }

  get holderId(): string {
    return this.props.holderId
  }

  get createdAt(): Date | null {
    return this.props.createdAt ?? null
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null
  }
}
