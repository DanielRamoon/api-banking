import { PaginateAdapter } from '../PaginateAdapter'

describe('PaginateAdapter', () => {
  it('should paginate items correctly when there are more items', () => {
    const paginateAdapter = new PaginateAdapter()
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
    const totalItems = 15

    const result = paginateAdapter.itemsPaginated(items, totalItems)

    expect(result).toEqual({
      total_items: totalItems,
      per_page: 10,
      current_page: 0,
      next_page: 1,
      has_more_items: true,
      items: items
    })
  })

  it('should paginate items correctly when there are no more items', () => {
    const paginateAdapter = new PaginateAdapter()
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
    const totalItems = 5

    const result = paginateAdapter.itemsPaginated(items, totalItems)

    expect(result).toEqual({
      total_items: totalItems,
      per_page: 10,
      current_page: 0,
      next_page: null,
      has_more_items: false,
      items: items
    })
  })
})
