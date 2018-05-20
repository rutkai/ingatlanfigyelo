import {Filters} from "./filters/filters";
import {View} from "../types/view";
import {QuietHours} from "../types/quiet-hours";

export class User {
  public id: string;
  public username: string;
  public view: View;
  public notificationFrequency: number;
  public notificationQuietHours: QuietHours;
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
