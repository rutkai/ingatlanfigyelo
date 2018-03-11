import {Injectable} from "@angular/core";

@Injectable()
export class ServiceWorkerService {
  private registration: ServiceWorkerRegistration;
  private registered = false;

  private pendingRequests = [];

  public register(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((registration: ServiceWorkerRegistration) => {
        this.registration = registration;
        this.registrationFinished();
      }).catch(err => {
        this.registrationFinished();
        console.log('Unable to load service worker (precache)!', err);
      });
    } else {
      this.registered = true;
    }
  }

  public getRegistration(): Promise<ServiceWorkerRegistration> {
    if (this.registered) {
      return Promise.resolve(this.registration);
    }

    return new Promise(resolve => {
      this.pendingRequests.push(resolve);
    });
  }

  private registrationFinished(): void {
    this.registered = true;

    for (const request of this.pendingRequests) {
      request(this.registration);
    }
  }
}
