import {Component, EventEmitter, Output} from "@angular/core";
import {NotificationService, User, UserStore} from "../common";

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss']
})
export class SidenavMenuComponent {
  @Output() public openFilters = new EventEmitter<void>();

  public user: User;

  constructor(private notificationService: NotificationService,
              private userStore: UserStore) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public openFiltersSidenav() {
    this.openFilters.emit();
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
}
