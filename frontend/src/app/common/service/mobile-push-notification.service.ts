import {Injectable} from "@angular/core";
import {ServiceWorkerService} from "./service-worker.service";
import {PushNotificationRepository} from "../repository/push-notification.repository";

@Injectable()
export class MobilePushNotificationService {
  private readonly vapidPublicKey = 'BGd5YMex0aq9Twdm15nm0ZWw3NiyYC0a06lZ2SRNtrKkRKr4ME3OcpJIhFSfORoOy_uv5CDkHHw2goskztqVrYM';

  private enabled = false;
  private hasSubscription?: boolean = null;

  constructor(private pushNotificationRepository: PushNotificationRepository,
              private serviceWorkerService: ServiceWorkerService) {
  }

  public init(): void {
    this.serviceWorkerService.getRegistration()
      .then((registration: ServiceWorkerRegistration) => {
        if ('PushManager' in window && registration) {
          return registration.pushManager.getSubscription();
        }
        return null;
      })
      .then((subscription?: PushSubscription) => {
        this.hasSubscription = subscription !== null;
        this.enabled = this.hasSubscription !== false;
      });
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public enable(): Promise<void> {
    if ('PushManager' in window && !this.hasSubscription) {
      return this.serviceWorkerService.getRegistration()
        .then((registration: ServiceWorkerRegistration) => {
          if (!registration) {
            return;
          }

          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.getEncodedVapidKey()
          }).then((subscription: PushSubscription) => {
            return this.pushNotificationRepository.subscribe(subscription);
          }).then(() => {
            this.hasSubscription = true;
          }).catch(err => console.log(err));
        });
    }

    return Promise.reject('Not supported');
  }

  public disable(): void {
    this.enabled = false;

    if (this.hasSubscription) {
      this.serviceWorkerService.getRegistration()
        .then((registration: ServiceWorkerRegistration) => registration.pushManager.getSubscription())
        .then((subscription: PushSubscription) => {
          if (subscription) {
            return this.pushNotificationRepository.unsubscribe(subscription.endpoint)
              .then(() => {
                this.hasSubscription = false;
                return subscription.unsubscribe();
              });
          }
        });
    }
  }

  private getEncodedVapidKey(): Uint8Array {
    const padding = '='.repeat((4 - this.vapidPublicKey.length % 4) % 4);
    const base64 = (this.vapidPublicKey + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
