import {Injectable} from "@angular/core";
import Push from "push.js";
import {ServiceWorkerService} from "./service-worker.service";
import {PushNotificationRepository} from "../repository/push-notification.repository";
import {DesktopPushNotificationService} from "./desktop-push-notification.service";
import {MobilePushNotificationService} from "./mobile-push-notification.service";
import {MobileDetectService} from "./mobile-detect.service";

@Injectable()
export class PushNotificationService {
  private isMobile: boolean;

  constructor(private desktopPushNotificationService: DesktopPushNotificationService,
              private mobilePushNotificationService: MobilePushNotificationService,
              private mobileDetectService: MobileDetectService) {
    this.isMobile = this.mobileDetectService.isMobile();
    if (this.isMobile) {
      this.mobilePushNotificationService.init();
    } else {
      this.desktopPushNotificationService.init();
    }
  }

  public show(body: string, title = "Új ingatlan!"): void {
    if (!this.isMobile) {
      this.desktopPushNotificationService.show(body, title);
    }
  }

  public isChangeable(): boolean {
    return this.isMobile;
  }

  public isEnabled(): boolean {
    if (this.isMobile) {
      return this.mobilePushNotificationService.isEnabled();
    } else {
      return false;
    }
  }

  public enable(): Promise<void> {
    if (this.isMobile) {
      return this.mobilePushNotificationService.enable();
    } else {
      return Promise.reject('Not supported!');
    }
  }

  public disable(): void {
    if (this.isMobile) {
      this.mobilePushNotificationService.disable();
    }
  }
}
