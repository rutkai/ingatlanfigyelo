import {Component, EventEmitter, Output} from '@angular/core';
import {UserStore} from "../store/user.store";
import {User} from "../model/user";
import {
  MatDialog, MatDialogConfig
} from "@angular/material";
import {LoginDialogComponent} from "./user/login-dialog.component";
import {RegisterDialogComponent} from "./user/register-dialog.component";
import {UserService} from "../service/user.service";
import {NotificationService} from "../service/notification.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() public toggleSidenav = new EventEmitter();

  public user: User;

  constructor(private notificationService: NotificationService, private dialog: MatDialog,
              private userStore: UserStore, private userService: UserService) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public sidenavButtonPressed(): void {
    this.toggleSidenav.emit();
  }

  public register(): void {
    const config = new MatDialogConfig();
    config.data = {};
    const dialogRef = this.dialog.open(RegisterDialogComponent, config);

    dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        return;
      }

      this.userService.register(data.username, data.password)
        .then(() => {
          this.notificationService.showSnackbarNotification('Sikeres regisztráció');
        })
        .catch(() => {
          this.notificationService.showSnackbarNotification('Ez a felhasználónév már foglalt!');
        });
    });
  }

  public login(): void {
    const config = new MatDialogConfig();
    config.data = {};
    const dialogRef = this.dialog.open(LoginDialogComponent, config);

    dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        return;
      }

      this.userStore.login(data.username, data.password)
        .then(() => {
          this.notificationService.showSnackbarNotification('Sikeres bejelentkezés');
        })
        .catch(() => {
          this.notificationService.showSnackbarNotification('Hibás felhasználónév/jelszó');
        });
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
}
