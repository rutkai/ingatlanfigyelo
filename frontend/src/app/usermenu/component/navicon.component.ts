import {Component, EventEmitter, Output} from "@angular/core";
import {User, UserStore} from "../../common";

@Component({
  selector: 'app-usermenu-navicon',
  templateUrl: './navicon.component.html',
  styleUrls: ['./navicon.component.scss']
})
export class NaviconComponent {
  @Output() public toggleUsermenu = new EventEmitter();

  public readonly gravatarBaseUrl = 'https://www.gravatar.com/avatar/';

  public user: User;

  constructor(userStore: UserStore) {
    userStore.user$.subscribe((user: User) => {
      this.user = user;
    });
  }

  public userButton() {
    this.toggleUsermenu.emit();
  }
}
