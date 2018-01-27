import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export interface PositionData {
  top: number;
  bottom: number;
  height: number;
}

@Injectable()
export class ScrollPositionStore {
  private positionData = <PositionData>{
    top: 0,
    bottom: 0,
    height: 0,
  };
  private position = new BehaviorSubject(this.positionData);
  public position$ = this.position.asObservable();

  public updatePosition(position: number, height: number): void {
    this.positionData = <PositionData>{
      top: position,
      bottom: position + height,
      height
    };
    this.position.next(this.positionData);
  }
}
