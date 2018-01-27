import {Inject, Injectable} from "@angular/core";

@Injectable()
export class StorageService {
  constructor(@Inject('Window') private window: Window) {
  }

  public get(id: string): any {
    let item = this.window.localStorage.getItem(id);
    return item !== null ? JSON.parse(item) : null;
  }

  public set(id: string, data: any): void {
    this.window.localStorage.setItem(id, JSON.stringify(data));
  }
}
