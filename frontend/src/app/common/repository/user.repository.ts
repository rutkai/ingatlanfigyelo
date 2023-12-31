import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {Filters} from "../model/filters/filters";
import {Filter} from "../model/filters/types/filter";
import {FilterFactory} from "../factory/filter.factory";
import {environment} from "../../../environments/environment";
import {View} from "../";
import {QuietHours} from "../types/quiet-hours";

@Injectable()
export class UserRepository {
  constructor(private http: HttpClient, private filterFactory: FilterFactory) {
  }

  public getProfile(): Promise<User> {
    return this.http.get(`${environment.apiScheme}://${environment.apiDomain}/user/profile`, {withCredentials: true}).toPromise()
      .then((response: any) => response.user)
      .then((userData: any) => this.unserializeUser(userData));
  }

  public login(username: string, password: string): Promise<User> {
    const payload = {
      username,
      password
    };

    return this.http.post(`${environment.apiScheme}://${environment.apiDomain}/user/login`, payload, {withCredentials: true}).toPromise()
      .then((response: any) => response.user)
      .then((userData: any) => this.unserializeUser(userData));
  }

  public logout(): Promise<void> {
    return this.http.get(`${environment.apiScheme}://${environment.apiDomain}/user/logout`, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  public sendForgottenPassword(username: string): Promise<void> {
    const payload = {
      username
    };

    return this.http.post(`${environment.apiScheme}://${environment.apiDomain}/user/password-recovery`, payload, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  public resetPassword(id: string, password: string, token: string): Promise<void> {
    const payload = {
      id,
      password,
      token
    };

    return this.http.put(`${environment.apiScheme}://${environment.apiDomain}/user/password-reset`, payload, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  public register(username: string, password: string): Promise<void> {
    const payload = {
      username,
      password
    };

    return this.http.post(`${environment.apiScheme}://${environment.apiDomain}/user/register`, payload, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  public saveFilters(filterGroups: Filters[]): Promise<void> {
    const payload = [];

    filterGroups.map((filters: Filters) => {
      const group = [];
      filters.filters.map((filter: Filter) => {
        group.push(filter.serialize());
      });
      payload.push(group);
    });

    return this.http.put(`//${environment.apiDomain}/filters/save`, payload, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  public changeView(view: View): Promise<void> {
    const payload = {view};

    return this.http.put(`//${environment.apiDomain}/user/view`, payload, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  public changeNotificationFrequency(frequency: number): Promise<void> {
    const payload = {frequency};

    return this.http.put(`//${environment.apiDomain}/user/notification-frequency`, payload, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  public changeNotificationQuietTime(quietHours: QuietHours): Promise<void> {
    const payload = {quietHours};

    return this.http.put(`//${environment.apiDomain}/user/notification-quiet-time`, payload, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  private unserializeUser(userData: any): User {
    const user = new User();
    user.id = userData.id;
    user.username = userData.username;
    user.view = userData.view;
    user.notificationFrequency = userData.notificationFrequency;
    user.notificationQuietHours = userData.notificationQuietHours;
    user.filterGroups = userData.filterGroups ? this.unserializeFilterGroups(userData.filterGroups) : [];
    return user;
  }

  private unserializeFilterGroups(filterGroups: any): Filters[] {
    return filterGroups.map((filters: any): Filters => {
      const filtersObj = new Filters();
      filtersObj.filters = filters.map((filterData: any): Filter => {
        const filter = this.filterFactory.createFilterFor(filterData.field);
        filter.unserialize(filterData);
        return filter;
      });
      return filtersObj;
    });
  }
}
