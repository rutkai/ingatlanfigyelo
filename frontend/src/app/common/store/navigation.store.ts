import {Injectable} from "@angular/core";

@Injectable()
export class NavigationStore {
  private pos = 0;

  public get position(): number {
    return this.pos;
  }

  public set position(value: number) {
    this.pos = value;
  }
}
