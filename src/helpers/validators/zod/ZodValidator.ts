/* eslint-disable @typescript-eslint/no-explicit-any */
import ApplicationValidator from '../ApplicationValidator'

export abstract class ZodValidator implements ApplicationValidator {
  props: any

  constructor(props: any) {
    this.props = props
  }

  public abstract schema(): any
  public parse = async (): Promise<any> => {
    return await this.schema().safeParseAsync(this.props)
  }

  public validate = async (): Promise<boolean> => {
    const schemaParsed: any = await this.parse()
    return schemaParsed.success
  }

  public errors = async (): Promise<string[]> => {
    const schemaParsed = await this.parse()
    if (!schemaParsed.success) {
      return schemaParsed.error.issues.map((issue: any) => issue.message)
    }

    return []
  }
}
