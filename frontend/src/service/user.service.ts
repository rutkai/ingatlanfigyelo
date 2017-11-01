import {Injectable} from "@angular/core";
import {UserRepository} from "../repository/user.repository";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {
  }

  public register(username: string, password: string): Promise<void> {
    return this.userRepository.register(username, password);
  }
}
