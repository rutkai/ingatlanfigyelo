import {Filters} from "./filters/filters";

export class User {
  public username;
  public filterGroups: Filters[] = [];

  public addFilterGroup(group: Filters) {
    this.filterGroups.push(group);
  }

  public removeFilterGroup(group: Filters) {
    const index = this.filterGroups.indexOf(group);
    if (index > -1) {
      this.filterGroups.splice(index, 1);
    }
  }
}
