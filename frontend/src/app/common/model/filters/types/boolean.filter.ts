import {Filter} from "./filter";

export class BooleanFilter extends Filter {
  public nullable = true;
  public value = false;

  public unserialize(data: any) {
    this.field = data.field;
    this.nullable = data.nullable;
    this.value = data.value;
  }

  public serialize(): any {
    return {
      field: this.field,
      nullable: this.nullable,
      value: this.value
    };
  }
}
