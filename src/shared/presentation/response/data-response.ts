/**
 * Note:
 * Using this class for list data response
 * Total is the total amount of items in the data set,
 * regardless of the pagination.
 * Page and limit are used for pagination and are 1-indexed.
 */
export class ListDataResponse<T> {
  listData: T[];
  total: number;
  page: number;
  limit: number;

  constructor({
    data,
    total,
    page,
    limit,
  }: {
    data: T[];
    total: number;
    page: number;
    limit: number;
  }) {
    this.listData = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

/**
 * Note:
 * Using this class for single data response
 */
export class SingleDataResponse<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
