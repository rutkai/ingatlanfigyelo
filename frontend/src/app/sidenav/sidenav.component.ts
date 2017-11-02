import {Component} from "@angular/core";
import {UserStore} from "../../store/user.store";
import {User} from "../../model/user";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public user: User;

  constructor(private userStore: UserStore) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

}
