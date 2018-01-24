import {Filter} from "./filter";

export class StringFilter extends Filter {
  public nullable = true;
  public containsAny: string[] = [];

  public unserialize(data: any) {
    this.field = data.field;
    this.nullable = data.nullable;
    this.containsAny = data.contains;
  }

  public serialize(): any {
    return {
      field: this.field,
      nullable: this.nullable,
      contains: this.containsAny
    };
  }
}
