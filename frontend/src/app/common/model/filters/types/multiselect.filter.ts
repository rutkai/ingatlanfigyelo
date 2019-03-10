import {Filter} from "./filter";
import {EstateAttributes} from "../estate-attributes";
import {Observable} from "rxjs";

export class MultiselectFilter extends Filter {
  public availableList: any[];
  public selected: any[] = [];

  constructor(field: EstateAttributes, items: Observable<any[]>) {
    super(field);
    items.subscribe((items: any[]) => {
      this.availableList = items;
    });
  }

  public unserialize(data: any) {
    this.field = data.field;
    this.selected = data.selected;
  }

  public serialize(): any {
    return {
      field: this.field,
      selected: this.selected ? this.selected : []
    };
  }
}
