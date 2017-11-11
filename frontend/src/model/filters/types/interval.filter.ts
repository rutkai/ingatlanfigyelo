import {Filter} from "./filter";

export class IntervalFilter extends Filter {
  public nullable = false;
  public min: number|null;
  public max: number|null;

  public unserialize(data: any) {
    this.field = data.field;
    this.nullable = data.nullable;
    this.min = data.min;
    this.max = data.max;
  }

  public serialize(): any {
    return {
      field: this.field,
      nullable: this.nullable,
      min: this.min,
      max: this.max
    };
  }
}
