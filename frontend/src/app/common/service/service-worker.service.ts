import {Injectable} from "@angular/core";
import {Observable} from "rxjs/internal/Observable";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

@Injectable()
export class ServiceWorkerService {
  private message: BehaviorSubject<any> = new BehaviorSubject({});
  public message$: Observable<any> = this.message.asObservable();

  private registration: ServiceWorkerRegistration;
  private registered = false;

  private pendingRequests = [];

  public register(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((registration: ServiceWorkerRegistration) => {
        this.registration = registration;
        registration.addEventListener('message', (event: any) => {
          this.message.next(event.data);
        });
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
