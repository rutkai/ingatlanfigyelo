import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class PushNotificationRepository {
  constructor(private http: HttpClient) {
  }

  public subscribe(subscription: PushSubscription): Promise<void> {
    return this.http.post(`${environment.apiScheme}://${environment.apiDomain}/push/subscribe`, subscription, {withCredentials: true})
      .toPromise()
      .then(() => {});
  }

  public unsubscribe(endpoint: any): Promise<void> {
    return this.http.post(`${environment.apiScheme}://${environment.apiDomain}/push/unsubscribe`, {endpoint}, {withCredentials: true})
      .toPromise()
      .then(() => {});
  }
}
