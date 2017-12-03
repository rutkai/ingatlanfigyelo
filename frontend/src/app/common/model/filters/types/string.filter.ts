import {Filter} from "./filter";

export class StringFilter extends Filter {
  public containsAny: string[] = [];

  public unserialize(data: any) {
    this.field = data.field;
    this.containsAny = data.contains;
  }

  public serialize(): any {
    return {
      field: this.field,
      contains: this.containsAny
    };
  }
}
