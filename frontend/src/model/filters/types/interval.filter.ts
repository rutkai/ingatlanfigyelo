import {Filter} from "./filter";

export class IntervalFilter extends Filter {
  public nullable = false;
  public min: number|null;
  public max: number|null;

  public unserialize(data: any) {
    this.field = data.field;
    this.min = data.min;
    this.max = data.max;
  }

  public serialize(): any {
    return {
      field: this.field,
      min: this.min,
      max: this.max
    };
  }
}
