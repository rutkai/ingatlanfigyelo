import {Filter} from "./filter";
import {EstateAttributes} from "../estate-attributes";

export class MultiselectFilter extends Filter {
  public availableList: any[];
  public selected: any[] = [];

  constructor(field: EstateAttributes, availableList: any[]) {
    super(field);
    this.availableList = availableList;
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
