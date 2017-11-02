import {Filter} from "./filter";

export class MultiselectFilter extends Filter {
  public availableList: any[];
  public selected: any[] = [];

  constructor(availableList: any[]) {
    super();
    this.availableList = availableList;
  }

  public unserialize(data: any) {
    this.field = data.field;
    this.selected = data.sources;
  }

  public serialize(): any {
    return {
      field: this.field,
      selected: this.selected
    };
  }
}
