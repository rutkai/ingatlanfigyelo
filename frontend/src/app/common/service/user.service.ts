import {Injectable} from "@angular/core";
import {UserRepository} from "../repository/user.repository";
import {Filters} from "../model/filters/filters";
import {View} from "../types/view";
import {User} from "../model/user";
import {UserStore} from "../store/user.store";
import {QuietHours} from "../types/quiet-hours";

@Injectable()
export class UserService {
  private user: User;

  constructor(private userStore: UserStore, private userRepository: UserRepository) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public sendPasswordRecovery(username: string): Promise<void> {
    return this.userRepository.sendForgottenPassword(username);
  }

  public resetPassword(id: string, password: string, token: string): Promise<void> {
    return this.userRepository.resetPassword(id, password, token);
  }

  public register(username: string, password: string): Promise<void> {
    return this.userRepository.register(username, password);
  }

  public saveFilters(filterGroups: Filters[]): Promise<void> {
    return this.userRepository.saveFilters(filterGroups);
  }

  public changeView(view: View): Promise<void> {
    return this.userRepository.changeView(view)
      .then(() => {
        this.user.view = view;
        this.userStore.updateUser(this.user);
      });
  }

  public changeNotificationFrequency(frequency: number): Promise<void> {
    return this.userRepository.changeNotificationFrequency(frequency)
      .then(() => {
        this.user.notificationFrequency = frequency;
      });
  }

  public changeNotificationQuietTime(quietHours: QuietHours): Promise<void> {
    return this.userRepository.changeNotificationQuietTime(quietHours)
      .then(() => {
        this.user.notificationQuietHours = quietHours;
      });
  }
}
