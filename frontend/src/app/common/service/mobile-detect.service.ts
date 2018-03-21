import {Inject, Injectable} from "@angular/core";
import * as MobileDetect from "mobile-detect";

@Injectable()
export class MobileDetectService {
  private mobileDetector;

  constructor(@Inject('Window') window: Window) {
    this.mobileDetector = new MobileDetect(window.navigator.userAgent);
  }

  public isMobile(): boolean {
    return !!this.mobileDetector.mobile();
  }
}
