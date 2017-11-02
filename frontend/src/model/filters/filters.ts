import {Filter} from "./types/filter";

export class Filters {
  public filters: Filter[] = [];

  public addFilter(filter: Filter) {
    this.filters.push(filter);
  }

  public removeFilter(filter: Filter) {
    const index = this.filters.indexOf(filter);
    if (index > -1) {
      this.filters.splice(index, 1);
    }
  }
}
