import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class NavigationStore {
  private lastPosition = 0;

  private restoreRequest = new BehaviorSubject(this.lastPosition);
  public restoreRequest$ = this.restoreRequest.asObservable();

  public restorePosition() {
    this.restoreRequest.next(this.lastPosition);
  }

  public storePosition(position: number) {
    this.lastPosition = position;
  }

  public resetPosition() {
    this.lastPosition = 0;
  }
}
