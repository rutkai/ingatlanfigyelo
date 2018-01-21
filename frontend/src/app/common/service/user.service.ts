import {Injectable} from "@angular/core";
import {UserRepository} from "../repository/user.repository";
import {Filters} from "../model/filters/filters";
import {View} from "../types/view";
import {User} from "../model/user";
import {UserStore} from "../store/user.store";

@Injectable()
export class UserService {
  private user: User;

  constructor(private userStore: UserStore, private userRepository: UserRepository) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
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
}
