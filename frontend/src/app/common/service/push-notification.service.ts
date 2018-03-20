import {Injectable} from "@angular/core";
import Push from "push.js";
import {ServiceWorkerService} from "./service-worker.service";
import {PushNotificationRepository} from "../repository/push-notification.repository";

@Injectable()
export class PushNotificationService {
  private readonly vapidPublicKey = 'BGd5YMex0aq9Twdm15nm0ZWw3NiyYC0a06lZ2SRNtrKkRKr4ME3OcpJIhFSfORoOy_uv5CDkHHw2goskztqVrYM';

  private enabled = false;
  private hasSubscription?: boolean = null;

  constructor(private pushNotificationRepository: PushNotificationRepository, private serviceWorkerService: ServiceWorkerService) {
    this.serviceWorkerService.getRegistration()
      .then((registration: ServiceWorkerRegistration) => {
        if ('PushManager' in window && registration) {
          return registration.pushManager.getSubscription();
        }
        return null;
      })
      .then((subscription?: PushSubscription) => {
        this.hasSubscription = subscription !== null;

        if (Push.Permission.get() === Push.Permission.GRANTED) {
          this.enabled = this.hasSubscription !== false;
        }
      });
  }

  public show(body: string, title = "Új ingatlan!"): void {
    if (!this.enabled || document.hasFocus() || Push.Permission.get() !== Push.Permission.GRANTED) {
      return;
    }

    Push.create(title, {
      body,
      icon: 'assets/logo.png',
      onClick: function () {
        window.focus();
        this.close();
      }
    })
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public enable(): Promise<void> {
    if ('PushManager' in window && !this.hasSubscription) {
      this.serviceWorkerService.getRegistration()
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
          })
            .catch(err => console.log(err));
        });
    }

    switch (Push.Permission.get()) {
      case Push.Permission.DEFAULT:
        return Push.Permission.request()
          .then(() => {
            this.enabled = true;
          });
      case Push.Permission.GRANTED:
        this.enabled = true;
        return Promise.resolve();
      case Push.Permission.DENIED:
        return Promise.reject('Notifications are disabled');
    }
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
