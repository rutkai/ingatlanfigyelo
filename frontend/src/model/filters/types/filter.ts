import {EstateAttributes} from "../estate-attributes";

export abstract class Filter {
  public field: EstateAttributes;

  public abstract unserialize(data: any);
  public abstract serialize(): any;
}
