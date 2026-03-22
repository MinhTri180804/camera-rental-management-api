export class ListDataResponse<T> {
  listData: T[];
  total: number;
  page: number;
  limit: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.listData = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

export class SingleDataResponse<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
