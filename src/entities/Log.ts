/* eslint-disable no-unused-vars */
export type LogProps = {
  id?: string
  resource: string
  error: string
  createdAt: Date
  updatedAt: Date
}

export default class Log {
  private props: LogProps

  constructor(dto: LogProps) {
    this.props = dto
  }

  get serializable_hash(): Log {
    return {
      id: this.id,
      resource: this.resource,
      error: this.error,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as Log
  }

  get id(): string {
    return this.props.id ?? ''
  }

  get resource(): string {
    return this.props.resource
  }

  get error(): string {
    return JSON.parse(this.props.error)
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
