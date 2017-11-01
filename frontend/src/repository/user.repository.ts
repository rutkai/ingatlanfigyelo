import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";

@Injectable()
export class UserRepository {
  constructor(private http: HttpClient) {
  }

  public getProfile(): Promise<User> {
    return this.http.get(`/user/profile`, {withCredentials: true}).toPromise()
      .then((response: any) => response.user)
      .then((userData: any) => {
        const user = new User();
        user.username = userData.username;
        return user;
      });
  }

  public login(username: string, password: string): Promise<User> {
    const payload = {
      username,
      password
    };

    return this.http.post(`/user/login`, payload, {withCredentials: true}).toPromise()
      .then((response: any) => response.user)
      .then((userData: any) => {
        const user = new User();
        user.username = userData.username;
        return user;
      });
  }

  public logout(): Promise<void> {
    return this.http.get(`/user/logout`, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }

  public register(username: string, password: string): Promise<void> {
    const payload = {
      username,
      password
    };

    return this.http.post(`/user/register`, payload, {withCredentials: true}).toPromise()
      .then(() => {
      });
  }
}
