import {Component} from "@angular/core";
import {NotificationService, User, UserService, UserStore, View} from "../../common";

@Component({
  selector: 'app-usermenu-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  public user: User;

  public views = View;

  constructor(private notificationService: NotificationService,
              private userStore: UserStore,
              private userService: UserService) {
    userStore.user$.subscribe((user: User) => {
      this.user = user;
    });
  }

  public logout(): void {
    this.userStore.logout()
      .then(() => {
        this.notificationService.showSnackbarNotification('Kijelentkezés sikeres');
      })
      .catch(() => {
        this.notificationService.showSnackbarNotification('Váratlan hiba');
      });
  }

  public setCardsView(): void {
    if (this.user.view !== View.CARDS) {
      this.userService.changeView(View.CARDS);
    }
  }

  public setInlineView(): void {
    if (this.user.view !== View.INLINE) {
      this.userService.changeView(View.INLINE);
    }
  }
}
