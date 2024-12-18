/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationError } from '../helpers/ApplicationError'

export type PaginatedItems = {
  total_items: number
  per_page: number
  current_page: number
  next_page: number | null
  has_more_items: boolean
  items: Array<object>
}

export class PaginateAdapter {
  private skip: number = 0
  private page: number = 0
  private perPage: number = 10

  public itemsPaginated = (
    items: object[],
    totalItems: number
  ): PaginatedItems | ApplicationError => {
    try {
      const currentSkip: number = this.getSkip()
      const currentPage: number = this.getPage()

      const hasMoreItems = currentSkip + this.getPerPage() < totalItems
      const nextPage = hasMoreItems ? currentPage + 1 : null

      return {
        total_items: totalItems,
        per_page: this.getPerPage(),
        current_page: currentPage,
        next_page: nextPage,
        has_more_items: hasMoreItems,
        items
      }
    } catch (error: any) {
      return new ApplicationError(error.message)
    }
  }

  public setSkip = (page: number): void => {
    page = page ? page : 1
    const currentPage: number = parseInt(`${page}`)
    this.setPage(currentPage)

    const skip: number =
      !!currentPage && currentPage == 1
        ? 0
        : (currentPage - 1) * this.getPerPage()

    this.skip = skip
  }

  public setPage = (page: number): void => {
    this.page = page
  }

  public getSkip = (): number => {
    return this.skip
  }

  public getPage = (): number => {
    return this.page
  }

  public setPerPage = (perPage: number): void => {
    this.perPage = perPage
  }

  public getPerPage(): number {
    return this.perPage
  }
}
