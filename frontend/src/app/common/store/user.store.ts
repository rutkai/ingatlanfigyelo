import {Injectable} from "@angular/core";
import {UserRepository} from "../repository/user.repository";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {User} from "../model/user";

@Injectable()
export class UserStore {
  private user: BehaviorSubject<User> = new BehaviorSubject(null);
  public user$: Observable<User> = this.user.asObservable();

  constructor(private userRepository: UserRepository) {
    userRepository.getProfile()
      .then((user: User) => {
        this.user.next(user);
      })
      .catch(() => {});
  }

  public login(username: string, password: string): Promise<void> {
    return this.userRepository.login(username, password)
      .then((user: User) => {
        this.user.next(user);
      });
  }

  public logout(): Promise<void> {
    return this.userRepository.logout()
      .then(() => {
        this.user.next(null);
      });
  }

  public updateUser(user: User) {
    this.user.next(user);
  }
}
