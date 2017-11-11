import {Injectable} from "@angular/core";
import {UserRepository} from "../repository/user.repository";
import {Filters} from "../model/filters/filters";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {
  }

  public register(username: string, password: string): Promise<void> {
    return this.userRepository.register(username, password);
  }

  public saveFilters(filterGroups: Filters[]): Promise<void> {
    return this.userRepository.saveFilters(filterGroups);
  }
}
